// ═══════════════════════════════════════════════════════
// FILE: src/app/dashboard/orders/page.jsx
// ═══════════════════════════════════════════════════════
import OrderDetailsLink from "@/components/OrderDetailsLink";
import { getStrapiData } from "@/lib/strapi";
import Link from "next/link";

export default async function OrdersPage() {
  const { data: orders } = await getStrapiData("/api/orders?populate=*");
console.log("orders: ",orders)
  const statusLabel = (status) => {
    const map = {
      pending: { label: "در انتظار", color: "amber" },
      processing: { label: "در حال پردازش", color: "blue" },
      completed: { label: "تکمیل شده", color: "green" },
      cancelled: { label: "لغو شده", color: "red" },
    };
    return map[status] || { label: status || "نامشخص", color: "amber" };
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">سفارشات</h1>
          <p className="page-subtitle">{orders?.length ?? 0} سفارش ثبت شده</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>شماره سفارش</th>
              <th>نام مشتری</th>
              <th>وضعیت</th>
              <th style={{ textAlign: "center" }}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {!orders || orders.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>🛒</div>
                  سفارشی یافت نشد
                </td>
              </tr>
            ) : orders.map((order) => {
              const { label, color } = statusLabel(order.statuses);
              return (
                <tr key={order.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: "var(--accent)", fontFamily: "monospace", fontSize: "15px" }}>
                      #{order.id}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{order?.users_permissions_user?.username || "—"}</td>
                  <td><span className={`badge badge-${color}`}>{label}</span></td>
                  <td style={{ textAlign: "center" }}>
                    <OrderDetailsLink href={`/dashboard/orders/${order.id}`} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
