// ═══════════════════════════════════════════════════════
// FILE: src/app/dashboard/categories/page.jsx
// ═══════════════════════════════════════════════════════
import { getStrapiData } from "@/lib/strapi";
import Link from "next/link";

export default async function CategoriesPage() {
  const { data: categories } = await getStrapiData("/api/product-categories");

  const editLinkStyle = {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "7px 14px", borderRadius: "var(--radius-sm)",
    background: "var(--bg-hover)", border: "1px solid var(--border)",
    color: "var(--text-secondary)", fontSize: "13px", fontWeight: 500,
    textDecoration: "none"
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">دسته‌بندی‌ها</h1>
          <p className="page-subtitle">{categories?.length ?? 0} دسته‌بندی ثبت شده</p>
        </div>
        <Link href="/dashboard/categories/new" className="btn-primary" style={{ textDecoration: "none" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M12 5v14M5 12h14"/>
          </svg>
          افزودن دسته‌بندی جدید
        </Link>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>نام دسته‌بندی</th>
              <th>اسلاگ</th>
              <th style={{ textAlign: "center" }}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {!categories || categories.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>🗂️</div>
                  دسته‌بندی‌ای یافت نشد
                </td>
              </tr>
            ) : categories.map((category) => (
              <tr key={category.documentId}>
                <td style={{ fontWeight: 600 }}>{category.name}</td>
                <td>
                  {category.slug && (
                    <code style={{
                      fontSize: "12px", background: "var(--bg-input)",
                      padding: "3px 8px", borderRadius: "4px",
                      color: "var(--text-muted)", fontFamily: "monospace"
                    }}>
                      {category.slug}
                    </code>
                  )}
                </td>
                <td style={{ textAlign: "center" }}>
                  <Link href={`/dashboard/categories/${category.documentId}`} style={editLinkStyle}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    ویرایش
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
