// src/components/DashboardLayoutClient.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Products: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M20 7H4a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  ),
  Orders: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  ),
  Categories: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  ),
  Brands: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="8" r="5" />
      <path d="M3 21v-2a7 7 0 0114 0v2" />
    </svg>
  ),
  Reservations: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  Erp: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M5 5h14v14H5z" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Menu: () => (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: () => (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

const navLinks = [
  { href: "/dashboard", label: "داشبورد", icon: Icons.Dashboard },
  { href: "/dashboard/erp", label: "ERP", icon: Icons.Erp },
  { href: "/dashboard/products", label: "محصولات", icon: Icons.Products },
  { href: "/dashboard/orders", label: "سفارشات", icon: Icons.Orders },
  { href: "/dashboard/categories", label: "دسته‌بندی‌ها", icon: Icons.Categories },
  { href: "/dashboard/brands", label: "برندها", icon: Icons.Brands },
  { href: "/dashboard/reservations", label: "درخواست‌های سرویس", icon: Icons.Reservations },
];

export default function DashboardLayoutClient({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ padding: "0 6px 24px", borderBottom: "1px solid var(--border)", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "var(--accent)", display: "flex", alignItems: "center",
            justifyContent: "center", fontWeight: 800, fontSize: "18px", color: "#0d0f14"
          }}>آ</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "15px", color: "var(--text-primary)" }}>آمانج</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>پنل مدیریت</div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
        <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", padding: "0 6px", marginBottom: "6px", letterSpacing: "0.08em" }}>
          منو اصلی
        </div>
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item${isActive ? " active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "12px" }}>
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 6px", marginBottom: "8px" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), #d97706)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", fontWeight: 700, color: "#0d0f14", flexShrink: 0
            }}>
              {(user.username || "A")[0].toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.username || "Admin"}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>مدیر</div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="nav-item" style={{ color: "var(--danger)", width: "100%" }}>
          <Icons.Logout />
          خروج از حساب
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Desktop Sidebar (always visible on md+) */}
      <aside
        className="desktop-sidebar"
        style={{
          width: "240px",
          background: "var(--bg-surface)",
          borderLeft: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
          padding: "24px 16px",
          gap: "4px",
          flexShrink: 0,
        }}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Mobile Topbar */}
        <div className="mobile-topbar" style={{
          display: "none", // default hidden, will show via media query
          alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)",
          position: "sticky", top: 0, zIndex: 40
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px", background: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "16px", color: "#0d0f14"
            }}>آ</div>
            <span style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)" }}>آمانج</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", padding: "4px" }}
          >
            <Icons.Menu />
          </button>
        </div>

        {/* Mobile Drawer & Backdrop */}
        {sidebarOpen && (
          <div
            className="mobile-drawer-backdrop"
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
              zIndex: 1000, backdropFilter: "blur(3px)",
              transition: "opacity 0.2s"
            }}
          />
        )}
        <div
          className="mobile-drawer"
          style={{
            position: "fixed", top: 0, right: 0, bottom: 0,
            width: "280px", maxWidth: "85vw",
            background: "var(--bg-surface)", borderLeft: "1px solid var(--border)",
            zIndex: 1001, padding: "24px 16px",
            display: "flex", flexDirection: "column",
            transform: sidebarOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.25s ease",
            boxShadow: "var(--shadow-dropdown)",
            overflowY: "auto"
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "16px" }}>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "6px", cursor: "pointer", color: "var(--text-primary)" }}
            >
              <Icons.Close />
            </button>
          </div>
          <SidebarContent />
        </div>

        {/* Page Content */}
        <main style={{ flex: 1, padding: "32px 28px", maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
          <div className="fade-up">
            {children}
          </div>
        </main>
      </div>

      <style jsx>{`
        @media (max-width: 767px) {
          .desktop-sidebar {
            display: none !important;
          }
          .mobile-topbar {
            display: flex !important;
          }
          main {
            padding: 20px 16px !important;
          }
        }
        @media (min-width: 768px) {
          .mobile-drawer,
          .mobile-drawer-backdrop {
            display: none !important;
          }
          .mobile-topbar {
            display: none !important;
          }
        }
        /* انیمیشن fade-up قبلی */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}