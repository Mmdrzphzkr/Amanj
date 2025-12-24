// amanj-shop-dashboard/src/app/profile/orders/[orderId]/page.jsx
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import OrderDetailsView from "./OrderDetailsView"; // کامپوننتی که در مرحله بعد می‌سازیم

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

async function getOrderDetails(orderId) {
  const cookieStore = cookies();
  const token = cookieStore.get("strapi_jwt")?.value;
  if (!token) return null;

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/orders?filters[id][$eq]=${orderId}&populate=*`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const order = json.data && json.data.length > 0 ? json.data[0] : null;

    if (!order) return null;

    const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const currentUser = await userRes.json();

    // چک کردن دسترسی کاربر به این سفارش
    if (order.users_permissions_user?.id !== currentUser.id) return null;

    return order;
  } catch (error) {
    return null;
  }
}

export default async function OrderDetailsPage({ params }) {
  const order = await getOrderDetails(params.orderId);
  if (!order) return notFound();

  return <OrderDetailsView order={order} />;
}
