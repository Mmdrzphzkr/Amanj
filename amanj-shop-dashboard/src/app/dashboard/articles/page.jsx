import { getStrapiData } from "@/lib/strapi";
import Link from "next/link";
import ArticlesTable from "./ArticlesTable";

export default async function ArticlesPage() {
  const { data: articles } = await getStrapiData("/api/articles?populate=*");

  if (!articles) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "80px 20px", gap: "12px"
      }}>
        <div style={{ fontSize: "48px" }}>⚠️</div>
        <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--danger)" }}>خطا در بارگذاری مقالات</div>
        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>لطفاً اتصال به سرور را بررسی کنید.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">مقالات</h1>
          <p className="page-subtitle">{articles.length} مقاله ثبت شده</p>
        </div>
        <Link href="/dashboard/articles/new" className="btn-primary" style={{ textDecoration: "none" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M12 5v14M5 12h14"/>
          </svg>
          افزودن مقاله جدید
        </Link>
      </div>
      <ArticlesTable articles={articles} />
    </div>
  );
}
