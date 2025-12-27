// src/app/api/user/addresses/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

// --- تابع کمکی برای گرفتن آیدی کاربر لاگین شده ---
async function getUserId(token) {
  const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!userRes.ok) return null;
  const user = await userRes.json();
  return user.id;
}

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("strapi_jwt")?.value;

  if (!token) return NextResponse.json([]); // برگشت آرایه خالی برای جلوگیری از خطای iterable

  try {
    const userId = await getUserId(token);
    if (!userId) return NextResponse.json([]);

    // بر اساس خطای قبلی، نام رابطه در دیتابیس شما users_permissions_user است
    const url = `${STRAPI_URL}/api/addresses?filters[users_permissions_user][id][$eq]=${userId}&populate=*`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const addressesData = await res.json();

    // استراپی لیست را در فیلد data برمی‌گرداند
    // اگر دیتایی نباشد، addressesData.data نال یا آندیفایند است، پس حتما || [] بگذارید
    return NextResponse.json(addressesData.data || []);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  const cookieStore = cookies();
  const token = cookieStore.get("strapi_jwt")?.value;

  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await userRes.json();
    const userId = user.id;

    const body = await request.json();

    // مشکل اصلی اینجا بود: کلید باید دقیقا مطابق دیتابیس باشد
    const payload = {
      data: {
        ...body.data,
        users_permissions_user: { connect: userId }, // تغییر از user به نام صحیح در عکس دیتابیس شما
      },
    };

    const res = await fetch(`${STRAPI_URL}/api/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      // اگر استراپی خطای کلید نامعتبر بدهد، اینجا مشخص می‌شود
      // console.log(result.error?.message);
      return NextResponse.json(
        { message: result.error?.message || "Strapi Error" },
        { status: res.status }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
