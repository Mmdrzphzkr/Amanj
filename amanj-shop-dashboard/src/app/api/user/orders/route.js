// src/app/api/user/orders/route.js
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
    // 1. دریافت اطلاعات کاربری (برای گرفتن ID و ارسال توکن به استرپی)
    // بهتر است این مرحله را تکرار کنیم تا مطمئن شویم توکن هنوز معتبر است و ID را داریم
    const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userRes.ok) {
        // اگر توکن منقضی شده، به کاربر اجازه دسترسی نمی‌دهیم
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const user = await userRes.json();
    const userId = user.id;

    // 2. فچ کردن لیست سفارشات کاربر
    // فیلتر: سفارشاتی که فیلد 'user' آنها برابر با userId است.
    // Populate: برای نمایش جزییات بیشتر (مثلاً اگر در آینده رابطه‌ای با محصول اضافه کردید)
    const ordersRes = await fetch(
      `${STRAPI_URL}/api/orders?filters[user][id][$eq]=${userId}&sort=createdAt:desc&populate=*`, // جدیدترین‌ها اول نمایش داده شوند
      {
        headers: {
          Authorization: `Bearer ${token}`, // ارسال توکن برای دسترسی به محتوای محافظت شده
        },
      }
    );

    const ordersData = await ordersRes.json();
    
    // برگرداندن داده‌ها به فرانت‌اند
    return NextResponse.json(ordersData.data);

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}