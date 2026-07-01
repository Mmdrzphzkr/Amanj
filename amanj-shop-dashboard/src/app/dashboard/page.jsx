// src/app/dashboard/page.jsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const StatCard = ({ icon, value, label, color = "amber", loading = false }) => (
  <div className="stat-card" style={{ opacity: loading ? 0.6 : 1 }}>
    <div className="stat-icon" style={
      color === "green" ? { background: "var(--success-dim)", color: "var(--success)" } :
        color === "blue" ? { background: "var(--info-dim)", color: "var(--info)" } :
          color === "red" ? { background: "var(--danger-dim)", color: "var(--danger)" } :
            {}
    }>
      {loading ? (
        <div style={{
          width: "20px", height: "20px", borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.3)",
          borderTopColor: "currentColor",
          animation: "spin 0.8s linear infinite"
        }} />
      ) : (
        icon
      )}
    </div>
    <div className="stat-value" style={{ minHeight: "32px", display: "flex", alignItems: "center" }}>
      {loading ? (
        <div style={{
          height: "24px", width: "60px",
          background: "var(--bg-input)", borderRadius: "4px",
          animation: "pulse 2s infinite"
        }} />
      ) : (
        value
      )}
    </div>
    <div className="stat-label">{label}</div>
  </div>
);

const QuickLink = ({ href, icon, title, desc }) => (
  <Link href={href} style={{ textDecoration: "none" }}>
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "16px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      cursor: "pointer",
      transition: "border-color .2s, background .2s, transform .15s",
    }}
      className="quick-link-card"
    >
      <div style={{
        width: "44px", height: "44px", borderRadius: "var(--radius-md)",
        background: "var(--accent-dim)", color: "var(--accent)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", marginBottom: "2px" }}>{title}</div>
        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{desc}</div>
      </div>
      <div style={{ marginLeft: "0", color: "var(--text-muted)", flexShrink: 0 }}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </div>
    </div>
    <style>{`.quick-link-card:hover { border-color: var(--accent) !important; background: var(--bg-hover) !important; transform: translateX(-2px); }`}</style>
  </Link>
);

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    products: "—",
    orders: "—",
    categories: "—",
    reservations: "—",
  });
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const isAdmin = user.role?.type === "admin";
      if (!isAdmin) router.push("/login");
      else fetchStats();
    }
  }, [loading, user, router]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

      // Fetch products count
      const productsRes = await fetch(`${strapiUrl}/api/products?pagination[pageSize]=1&fields[0]=id`, {
        credentials: "include",
      });
      const productsData = await productsRes.json();
      const productsCount = productsData.meta?.pagination?.total ?? 0;

      // Fetch orders count
      const ordersRes = await fetch(`${strapiUrl}/api/orders?pagination[pageSize]=1&fields[0]=id`, {
        credentials: "include",
      });
      const ordersData = await ordersRes.json();
      const ordersCount = ordersData.meta?.pagination?.total ?? 0;

      // Fetch categories count
      const categoriesRes = await fetch(`${strapiUrl}/api/product-categories?pagination[pageSize]=1&fields[0]=id`, {
        credentials: "include",
      });
      const categoriesData = await categoriesRes.json();
      const categoriesCount = categoriesData.meta?.pagination?.total ?? 0;

      // Fetch technical reservations count
      const reservationsRes = await fetch(`${strapiUrl}/api/technical-reservations?pagination[pageSize]=1&fields[0]=id`, {
        credentials: "include",
      });
      const reservationsData = await reservationsRes.json();
      const reservationsCount = reservationsData.meta?.pagination?.total ?? 0;

      setStats({
        products: productsCount.toLocaleString("fa-IR"),
        orders: ordersCount.toLocaleString("fa-IR"),
        categories: categoriesCount.toLocaleString("fa-IR"),
        reservations: reservationsCount.toLocaleString("fa-IR"),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        products: "❌",
        orders: "❌",
        categories: "❌",
        reservations: "❌",
      });
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
        <div style={{
          width: "36px", height: "36px", border: "3px solid var(--border)",
          borderTopColor: "var(--accent)", borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
      </div>
    );
  }

  const isAdmin = user?.role?.type === "admin";
  if (!user || !isAdmin) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--danger)" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>⛔</div>
        <div style={{ fontSize: "16px", fontWeight: 600 }}>دسترسی غیرمجاز</div>
      </div>
    );
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("fa-IR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Welcome Header */}
      <div style={{
        background: "linear-gradient(135deg, var(--bg-card) 0%, #1e2035 100%)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>{dateStr} • {timeStr}</div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "3px" }}>
            خوش آمدید، <span style={{ color: "var(--accent)" }}>{user?.username || "Admin"}</span> 👋
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            به پنل مدیریت فروشگاه آمانج خوش آمدید.
          </p>
        </div>
        <div style={{
          background: "var(--accent-dim)",
          border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: "var(--radius-md)",
          padding: "8px 14px",
          display: "flex", alignItems: "center", gap: "6px",
          whiteSpace: "nowrap", flexShrink: 0
        }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--success)", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)" }}>سیستم فعال</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div>
        <h2 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "12px", letterSpacing: "0.05em" }}>
          آمار کلی
        </h2>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
          <StatCard
            value={stats.products}
            label="محصولات"
            color="amber"
            loading={statsLoading}
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 7H4a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>}
          />
          <StatCard
            value={stats.orders}
            label="سفارشات"
            color="blue"
            loading={statsLoading}
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg>}
          />
          <StatCard
            value={stats.categories}
            label="دسته‌بندی‌ها"
            color="green"
            loading={statsLoading}
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 6h16M4 12h16M4 18h7" /></svg>}
          />
          <StatCard
            value={stats.reservations}
            label="درخواست‌های سرویس"
            color="red"
            loading={statsLoading}
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "12px", letterSpacing: "0.05em" }}>
          دسترسی سریع
        </h2>
        <div className="quick-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
          <QuickLink
            href="/dashboard/products/new"
            title="افزودن محصول جدید"
            desc="ایجاد و انتشار محصول"
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 5v14M5 12h14" /></svg>}
          />
          <QuickLink
            href="/dashboard/orders"
            title="مدیریت سفارشات"
            desc="مشاهده و پیگیری سفارشات"
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" /></svg>}
          />
          <QuickLink
            href="/dashboard/reservations"
            title="درخواست‌های سرویس"
            desc="پاسخ به درخواست‌های مشتریان"
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>}
          />
          <QuickLink
            href="/dashboard/brands/new"
            title="افزودن برند جدید"
            desc="ثبت برند در سیستم"
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="8" r="5" /><path d="M3 21v-2a7 7 0 0114 0v2" /></svg>}
          />
        </div>
      </div>
    </div>
  );
}
