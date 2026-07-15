import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { validateCheckoutInput } from "@/lib/validation";
import { rateLimit, getClientIp, getRateLimitHeaders } from "@/lib/rateLimit";
import { auditLog, AuditEventTypes } from "@/lib/audit";

const STRAPI_URL = (
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
  ).replace(/\/+$/, "");

export async function POST(request) {
  // Rate limiting: 10 checkouts per minute
  const clientIp = getClientIp(request);
  const rateLimitKey = `checkout:${clientIp}`;
  const { allowed, remaining, resetTime } = rateLimit(rateLimitKey, 10, 60000);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Please try again later." },
      {
        status: 429,
        headers: getRateLimitHeaders(remaining, resetTime),
      }
    );
  }

  const cookieStore = cookies();
  const token = cookieStore.get("strapi_jwt")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "لطفاً ابتدا وارد حساب کاربری خود شوید." },
      {
        status: 401,
        headers: getRateLimitHeaders(remaining, resetTime),
      }
    );
  }

  try {
    const body = await request.json();
    const { items, totalAmount, addressId } = body;

    // Validate input
    const validation = validateCheckoutInput(items, totalAmount, addressId);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        {
          status: 400,
          headers: getRateLimitHeaders(remaining, resetTime),
        }
      );
    }

    // Validate body size (1MB limit)
    const bodySize = JSON.stringify(body).length;
    if (bodySize > 1024 * 1024) {
      return NextResponse.json(
        { error: "Request body too large" },
        {
          status: 413,
          headers: getRateLimitHeaders(remaining, resetTime),
        }
      );
    }

    // ۱. ثبت سفارش در جدول Orders
    const orderResponse = await fetch(`${STRAPI_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          items: items,
          total_amount: totalAmount,
          Statuses: "pending",
          address: addressId,
        },
      }),
    });

    if (!orderResponse.ok) {
      throw new Error("خطا در ثبت سفارش نهایی");
    }

    const orderResult = await orderResponse.json();

    // ۲. کاهش موجودی انبار (Stock) برای هر محصول
    // از Promise.all استفاده می‌کنیم تا درخواست‌ها همزمان و سریع انجام شوند
    const stockUpdates = items.map(async (item) => {
      // ابتدا موجودی فعلی محصول را می‌گیریم (برای دقت بیشتر)
      const productRes = await fetch(`${STRAPI_URL}/api/products/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const productData = await productRes.json();
      const currentStock = productData.data.stock || 0;

      // محاسبه موجودی جدید
      const newStock = Math.max(0, currentStock - item.quantity);

      // آپدیت کردن محصول در Strapi
      return fetch(`${STRAPI_URL}/api/products/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: { stock: newStock },
        }),
      });
    });

    await Promise.all(stockUpdates);

    return NextResponse.json({
      success: true,
      message: "سفارش ثبت و موجودی انبار به‌روزرسانی شد",
      orderId: orderResult.data.id,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { error: "خطا در پردازش نهایی خرید" },
      { status: 500 }
    );
  }
}
