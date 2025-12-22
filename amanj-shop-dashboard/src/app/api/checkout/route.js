import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function POST(request) {
  const cookieStore = cookies();
  const token = cookieStore.get("strapi_jwt")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "لطفاً ابتدا وارد حساب کاربری خود شوید." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { items, totalAmount, addressId } = body;

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
