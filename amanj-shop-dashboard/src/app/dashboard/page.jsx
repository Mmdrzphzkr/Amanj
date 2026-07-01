// src/app/dashboard/page.jsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const StatCard = ({ icon, value, label, color = "amber", loading = false }) => (
  <div className={`stat-card stat-card--${color}`} style={{ opacity: loading ? 0.7 : 1 }}>
    <div className="stat-icon">
      {loading ? (
        <div className="stat-skeleton" />
      ) : (
        icon
      )}
    </div>
    <div className="stat-value">
      {loading ? <div className="stat-skeleton stat-skeleton--value" /> : value}
    </div>
    <div className="stat-label">{label}</div>
  </div>
);

const QuickLink = ({ href, icon, title, desc }) => (
  <Link href={href} className="quick-link-card">
    <div className="quick-link-card__icon">{icon}</div>
    <div className="quick-link-card__body">
      <div className="quick-link-card__title">{title}</div>
      <div className="quick-link-card__desc">{desc}</div>
    </div>
    <div className="quick-link-card__arrow">
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </div>
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
      const [productsRes, ordersRes, categoriesRes, reservationsRes] = await Promise.all([
        fetch(`${strapiUrl}/api/products?pagination[pageSize]=1&fields[0]=id`, { credentials: "include" }),
        fetch(`${strapiUrl}/api/orders?pagination[pageSize]=1&fields[0]=id`, { credentials: "include" }),
        fetch(`${strapiUrl}/api/product-categories?pagination[pageSize]=1&fields[0]=id`, { credentials: "include" }),
        fetch(`${strapiUrl}/api/technical-reservations?pagination[pageSize]=1&fields[0]=id`, { credentials: "include" }),
      ]);

      const [productsData, ordersData, categoriesData, reservationsData] = await Promise.all([
        productsRes.json(),
        ordersRes.json(),
        categoriesRes.json(),
        reservationsRes.json(),
      ]);

      setStats({
        products: (productsData.meta?.pagination?.total ?? 0).toLocaleString("fa-IR"),
        orders: (ordersData.meta?.pagination?.total ?? 0).toLocaleString("fa-IR"),
        categories: (categoriesData.meta?.pagination?.total ?? 0).toLocaleString("fa-IR"),
        reservations: (reservationsData.meta?.pagination?.total ?? 0).toLocaleString("fa-IR"),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({ products: "❌", orders: "❌", categories: "❌", reservations: "❌" });
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner" />
      </div>
    );
  }

  const isAdmin = user?.role?.type === "admin";
  if (!user || !isAdmin) {
    return (
      <div className="dashboard-empty-state">
        <div className="dashboard-empty-state__icon">⛔</div>
        <div className="dashboard-empty-state__title">دسترسی غیرمجاز</div>
      </div>
    );
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("fa-IR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero__content">
          <div className="dashboard-kicker">پنل مدیریت • ERP</div>
          <h1>
            خوش آمدید، <span>{user?.username || "Admin"}</span>
          </h1>
          <p>از اینجا می‌توانید سفارشات، محصولات، مشتریان، فاکتورهای فروش و حقوق کارگران را مدیریت کنید.</p>
          <div className="dashboard-actions">
            <Link href="/dashboard/erp" className="btn-primary">
              ورود به ماژول ERP
            </Link>
            <Link href="/dashboard/orders" className="btn-ghost">
              مشاهده سفارشات
            </Link>
          </div>
        </div>

        <div className="dashboard-hero__status">
          <div className="dashboard-status-pill">● سیستم آنلاین</div>
          <div className="dashboard-status-card">
            <span>{dateStr}</span>
            <strong>{timeStr}</strong>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title">آمار کلی</h2>
        <div className="stats-grid">
          <StatCard value={stats.products} label="محصولات" color="amber" loading={statsLoading} icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 7H4a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>} />
          <StatCard value={stats.orders} label="سفارشات" color="blue" loading={statsLoading} icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg>} />
          <StatCard value={stats.categories} label="دسته‌بندی‌ها" color="green" loading={statsLoading} icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 6h16M4 12h16M4 18h7" /></svg>} />
          <StatCard value={stats.reservations} label="درخواست‌های سرویس" color="red" loading={statsLoading} icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>} />
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel-card">
          <div className="panel-card__header">دسترسی سریع</div>
          <div className="quick-grid">
            <QuickLink href="/dashboard/products/new" title="افزودن محصول جدید" desc="ایجاد و انتشار محصول" icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 5v14M5 12h14" /></svg>} />
            <QuickLink href="/dashboard/orders" title="مدیریت سفارشات" desc="مشاهده و پیگیری سفارشات" icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg>} />
            <QuickLink href="/dashboard/reservations" title="درخواست‌های سرویس" desc="پاسخ به درخواست‌های مشتریان" icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>} />
            <QuickLink href="/dashboard/erp" title="ERP و فاکتورها" desc="فروش، تعمیر و حقوق کارگران" icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 5h14v14H5z" /><path d="M8 9h8M8 13h5" /></svg>} />
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-card__header">ماژول‌های ERP</div>
          <div className="module-list">
            <Link href="/dashboard/erp" className="module-item">
              <strong>فاکتور فروش و خرید</strong>
              <span>تولید فاکتور برای دستگاه‌های قهوه‌ساز و ثبت جزئیات مشتری</span>
            </Link>
            <Link href="/dashboard/erp" className="module-item">
              <strong>فاکتور تعمیر و خدمات</strong>
              <span>ثبت خدمات ارائه‌شده با قیمت‌گذاری و چاپ PDF</span>
            </Link>
            <Link href="/dashboard/erp" className="module-item">
              <strong>حقوق و فیش کارگران</strong>
              <span>ثبت کارهای انجام‌شده و محاسبه حقوق</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
