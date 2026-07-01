"use client";

import Link from "next/link";

const modules = [
  {
    title: "فاکتور فروش",
    description: "ثبت سفارش‌های فروش، مشتریان و آیتم‌های فاکتور",
    href: "/dashboard/erp/invoices",
  },
  {
    title: "فاکتور تعمیر و خدمات",
    description: "ثبت خدمات ارائه‌شده، قطعات و هزینه‌های مربوطه",
    href: "/dashboard/erp/services",
  },
  {
    title: "حقوق و فیش کارگران",
    description: "محاسبه و مدیریت حقوق روزانه و ماهانه",
    href: "/dashboard/erp/payroll",
  },
];

export default function ErpDashboardPage() {
  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero__content">
          <div className="dashboard-kicker">ماژول ERP • نسخه اولیه</div>
          <h1>مرکز مدیریت فاکتورها و امور اداری</h1>
          <p>از اینجا می‌توانید فروش، خدمات، مشتریان و حقوق کارگران را در یکجا مدیریت کنید.</p>
        </div>
      </section>

      <section>
        <h2 className="section-title">ماژول‌های در دست ساخت</h2>
        <div className="stats-grid">
          {modules.map((item) => (
            <Link key={item.href} href={item.href} className="panel-card" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="panel-card__header">{item.title}</div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: 14 }}>{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
