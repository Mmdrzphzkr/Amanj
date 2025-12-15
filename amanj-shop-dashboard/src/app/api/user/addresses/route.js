// src/app/api/user/addresses/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// استفاده از متغیر محیطی آدرس استرپی
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL; 

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("strapi_jwt")?.value;

  if (!token) {
    // کاربر لاگین نیست
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. دریافت اطلاعات کاربری (از جمله ID) برای فیلتر کردن آدرس‌ها
    const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!userRes.ok) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const user = await userRes.json();
    const userId = user.id;

    // 2. فچ کردن آدرس‌هایی که فیلد 'user' آن‌ها برابر با شناسه کاربر فعلی است
    const addressesRes = await fetch(
      // از فیلتر Strapi استفاده می‌کنیم: آدرس‌هایی که فیلد user.id آن‌ها برابر userId است
      `${STRAPI_URL}/api/addresses?filters[user][id][$eq]=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // توکن کاربر را برای مجوز ارسال می‌کنیم
        },
      }
    );

    const addressesData = await addressesRes.json();
    
    // برگرداندن آدرس‌ها به فرانت‌اند
    return NextResponse.json(addressesData.data);

  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}