// components/OrderDetailsLink.jsx
"use client";
import Link from "next/link";

export default function OrderDetailsLink({ href }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "7px 14px", borderRadius: "var(--radius-sm)",
        background: "var(--bg-hover)", border: "1px solid var(--border)",
        color: "var(--text-secondary)", fontSize: "13px", fontWeight: 500,
        textDecoration: "none", transition: "all 0.15s"
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
    >
      مشاهده جزئیات
    </Link>
  );
}