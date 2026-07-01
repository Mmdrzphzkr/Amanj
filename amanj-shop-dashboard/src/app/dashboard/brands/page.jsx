// src/app/dashboard/brands/page.jsx
import { getStrapiData } from "@/lib/strapi";
import Link from "next/link";

export default async function BrandsPage() {
  const { data: brands } = await getStrapiData("/api/brands?populate=logo");

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
          <h1 className="page-title">برندها</h1>
          <p className="page-subtitle">{brands?.length ?? 0} برند ثبت شده</p>
        </div>
        <Link href="/dashboard/brands/new" className="btn-primary" style={{ textDecoration: "none" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M12 5v14M5 12h14"/>
          </svg>
          افزودن برند جدید
        </Link>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: "80px" }}>لوگو</th>
              <th>نام برند</th>
              <th style={{ textAlign: "center" }}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {!brands || brands.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏷️</div>
                  برندی یافت نشد
                </td>
              </tr>
            ) : brands.map((brand) => (
              <tr key={brand.id}>
                <td>
                  {brand.logo?.data ? (
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "var(--radius-sm)",
                      background: "var(--bg-input)", border: "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden"
                    }}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${brand.logo.data.url}`}
                        alt={brand.name}
                        width="36"
                        height="36"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "var(--radius-sm)",
                      background: "var(--bg-input)", border: "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--text-muted)", fontSize: "18px"
                    }}>
                      🏷️
                    </div>
                  )}
                </td>
                <td style={{ fontWeight: 600 }}>{brand.name}</td>
                <td style={{ textAlign: "center" }}>
                  <Link href={`/dashboard/brands/${brand.id}`} style={editLinkStyle}>
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
