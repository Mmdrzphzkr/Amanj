// src/app/dashboard/products/page.jsx
import { getStrapiData } from "@/lib/strapi";
import Link from "next/link";
import ProductsTable from "./ProductsTable";

export default async function ProductPage() {
  const { data: products } = await getStrapiData("/api/products?populate=*");

  if (!products) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "80px 20px", gap: "12px"
      }}>
        <div style={{ fontSize: "48px" }}>⚠️</div>
        <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--danger)" }}>خطا در بارگذاری محصولات</div>
        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>لطفاً اتصال به سرور را بررسی کنید.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">محصولات</h1>
          <p className="page-subtitle">{products.length} محصول ثبت شده</p>
        </div>
        <Link href="/dashboard/products/new" className="btn-primary" style={{ textDecoration: "none" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M12 5v14M5 12h14"/>
          </svg>
          افزودن محصول جدید
        </Link>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
