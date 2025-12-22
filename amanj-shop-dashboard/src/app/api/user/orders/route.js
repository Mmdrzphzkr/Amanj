// src/app/api/user/orders/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// استفاده از متغیر محیطی آدرس استرپی
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("strapi_jwt")?.value;

  if (!token) {
    return NextResponse.json([], { status: 401 });
  }

  try {
    // 1. تایید هویت کاربر و گرفتن ID
    const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!userRes.ok) {
      return NextResponse.json([], { status: 401 });
    }
    const user = await userRes.json();
    const userId = user.id;

    // 2. فچ کردن سفارشات با نام صحیح رابطه: users_permissions_user
    // همچنین اضافه کردن populate=* برای گرفتن جزئیات آدرس و آیتم‌ها
    const url = `${STRAPI_URL}/api/orders?filters[users_permissions_user][id][$eq]=${userId}&sort=createdAt:desc&populate=*`;

    const ordersRes = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const ordersData = await ordersRes.json();

    // استراپی دیتا را در فیلد data برمی‌گرداند. اگر خالی بود آرایه [] بدهید.
    return NextResponse.json(ordersData.data || []);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  const cookieStore = cookies();
  const token = cookieStore.get("strapi_jwt")?.value;

  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    // 1. گرفتن کاربر
    const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const user = await userRes.json();
    const userId = user.id;

    const body = await request.json();

    // 2. payload صحیح v5
    const orderPayload = {
      data: {
        ...body.data,
        users_permissions_user: {
          connect: [userId],
        },
      },
    };

    // 3. ارسال به Strapi
    const res = await fetch(`${STRAPI_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("STRAPI ERROR:", result);
      return NextResponse.json(
        { message: result?.error?.message || "Strapi error" },
        { status: res.status }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("ORDER POST ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
