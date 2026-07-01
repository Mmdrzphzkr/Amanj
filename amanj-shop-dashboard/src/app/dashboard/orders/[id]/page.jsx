"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderDetailsClient({ order }) {
  console.log("order: ",order)
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(order.statuses || "pending");
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState(null);
  // استخراج داده‌های روابط
  const user = order.users_permissions_user?.data?.attributes || order.users_permissions_user.username;
  const address = order.order_address?.data?.attributes || order.order_address;
  const items = order.items || [];
  const paymentDetails = order.payment_details || {};
  const shippingCost = order.shipping_cost || 0;
  const shippingMethod = order.shipping_method_name || "";
  const paymentMethod = order.payment_method || "";
  const orderId = order.order_id || order.id;

  // گزینه‌های وضعیت (هماهنگ با enumeration در Strapi)
  const statusOptions = [
    { value: "pending", label: "در انتظار", color: "amber" },
    { value: "processing", label: "در حال پردازش", color: "blue" },
    { value: "completed", label: "تکمیل شده", color: "green" },
    { value: "cancelled", label: "لغو شده", color: "red" },
  ];

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { statuses: newStatus } }),
      });

      if (res.ok) {
        setCurrentStatus(newStatus);
        setMessage({ type: "success", text: "وضعیت سفارش با موفقیت به‌روز شد" });
        router.refresh();
      } else {
        const error = await res.json();
        setMessage({ type: "error", text: error?.message || "خطا در به‌روزرسانی وضعیت" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "خطا در ارتباط با سرور" });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const option = statusOptions.find(opt => opt.value === status) || statusOptions[0];
    return <span className={`badge badge-${option.color}`}>{option.label}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">جزئیات سفارش #{orderId}</h1>
          <p className="page-subtitle">
            تاریخ ثبت: {new Date(order.createdAt).toLocaleDateString("fa-IR")}
          </p>
        </div>
        <Link href="/dashboard/orders" className="btn-ghost" style={{ textDecoration: "none" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          بازگشت به لیست سفارشات
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* اطلاعات اصلی و وضعیت */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>اطلاعات سفارش</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>وضعیت فعلی:</span>
              {getStatusBadge(currentStatus)}
            </div>
          </div>

          {/* فرم تغییر وضعیت */}
          <div style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-md)", padding: "16px", marginBottom: "24px" }}>
            <label className="label" style={{ marginBottom: "8px" }}>تغییر وضعیت سفارش</label>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <select
                value={currentStatus}
                onChange={handleStatusChange}
                disabled={updating}
                style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  padding: "10px 14px",
                  fontSize: "14px",
                  outline: "none",
                  cursor: updating ? "not-allowed" : "pointer",
                  minWidth: "180px"
                }}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {updating && <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>در حال به‌روزرسانی...</span>}
            </div>
            {message && (
              <div style={{ marginTop: "12px", fontSize: "13px", color: message.type === "error" ? "var(--danger)" : "var(--success)" }}>
                {message.text}
              </div>
            )}
          </div>

          {/* جدول اطلاعات مشتری و آدرس */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "12px" }}>مشتری</h3>
              <div style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-md)", padding: "16px" }}>
                <p><strong>نام:</strong> {user?.username || user?.name || "—"}</p>
                <p><strong>ایمیل:</strong> {user?.email || "—"}</p>
                <p><strong>تلفن:</strong> {user?.phone || "—"}</p>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "12px" }}>آدرس ارسال</h3>
              <div style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-md)", padding: "16px" }}>
                {address ? (
                  <>
                    <p>{address.addressLine1 || address.address_line1 || ""}</p>
                    <p>{address.addressLine2 || address.address_line2 || ""}</p>
                    <p>{address.city} - {address.state}</p>
                    <p>{address.postalCode || address.postal_code || ""}</p>
                    <p>{address.country}</p>
                  </>
                ) : (
                  <p>آدرسی ثبت نشده</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* محصولات سفارش (items) */}
        <div className="card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>محصولات سفارش</h2>
          {items.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>هیچ محصولی در این سفارش وجود ندارد.</p>
          ) : (
            <div className="table-wrapper">
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>نام محصول</th>
                    <th>قیمت واحد</th>
                    <th>تعداد</th>
                    <th>جمع</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const product = item.product?.data?.attributes || item.product || {};
                    const name = product.name || item.name || "محصول";
                    const price = item.price || product.price || 0;
                    const quantity = item.quantity || 1;
                    const total = price * quantity;
                    return (
                      <tr key={idx}>
                        <td style={{ fontWeight: 500 }}>{name}</td>
                        <td>{price.toLocaleString("fa-IR")} تومان</td>
                        <td>{quantity}</td>
                        <td style={{ fontWeight: 600, color: "var(--accent)" }}>{total.toLocaleString("fa-IR")} تومان</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* جزئیات پرداخت و هزینه ارسال */}
        <div className="card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>اطلاعات پرداخت</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            <div>
              <p><strong>روش ارسال:</strong> {shippingMethod || "—"}</p>
              <p><strong>هزینه ارسال:</strong> {shippingCost.toLocaleString("fa-IR")} تومان</p>
            </div>
            <div>
              <p><strong>روش پرداخت:</strong> {paymentMethod === "online" ? "پرداخت آنلاین" : paymentMethod === "cash" ? "پرداخت در محل" : paymentMethod || "—"}</p>
              <p><strong>جزئیات پرداخت:</strong></p>
              <pre style={{ background: "var(--bg-surface)", padding: "12px", borderRadius: "var(--radius-md)", fontSize: "12px", overflowX: "auto" }}>
                {JSON.stringify(paymentDetails, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}