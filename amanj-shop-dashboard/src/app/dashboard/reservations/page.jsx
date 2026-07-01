// src/app/dashboard/reservations/page.jsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReservationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    if (!authLoading && user) {
      const isAdmin = user.role?.type === "admin";
      if (!isAdmin) router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const isAdmin = user?.role?.type === "admin";
    if (user && isAdmin) loadReservations();
  }, [user]);

  const loadReservations = async () => {
    try {
      const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
      const res = await fetch(`${STRAPI}/api/technical-reservations?pagination[pageSize]=100&sort=createdAt:desc`);
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      const items = (json.data || []).map((d) => ({ id: d.id, ...d }));
      setReservations(items);
    } catch (err) {
      console.error("Error loading reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
        <div style={{
          width: "36px", height: "36px", border: "3px solid var(--border)",
          borderTopColor: "var(--accent)", borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const isAdmin = user?.role?.type === "admin";
  if (!user || !isAdmin) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--danger)" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>⛔</div>
        <div style={{ fontSize: "18px", fontWeight: 600 }}>دسترسی غیرمجاز</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">درخواست‌های سرویس فنی</h1>
          <p className="page-subtitle">{reservations.length} درخواست ثبت شده</p>
        </div>
      </div>

      {reservations.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 20px",
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📅</div>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>درخواستی موجود نیست</div>
          <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>هنوز هیچ درخواست سرویس فنی دریافت نشده است.</div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>نام و نام خانوادگی</th>
                <th>موبایل</th>
                <th>تاریخ ثبت</th>
                <th style={{ textAlign: "center" }}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{res.name} {res.lastname}</div>
                  </td>
                  <td>
                    <a href={`tel:${res.phone}`} style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500, fontFamily: "monospace" }}>
                      {res.phone}
                    </a>
                  </td>
                  <td style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                    {new Date(res.createdAt).toLocaleDateString("fa-IR", {
                      year: "numeric", month: "long", day: "numeric"
                    })}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => setSelectedReservation(res)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        padding: "7px 14px", borderRadius: "var(--radius-sm)",
                        background: "var(--bg-hover)", border: "1px solid var(--border)",
                        color: "var(--text-secondary)", fontSize: "13px", fontWeight: 500,
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      جزئیات
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedReservation && (
        <div
          onClick={() => setSelectedReservation(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            display: "flex", alignItems: "start", justifyContent: "center",
            zIndex: 50, padding: "20px", backdropFilter: "blur(4px)"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card fade-up"
            style={{
              maxWidth: "500px", width: "100%",
              maxHeight: "90vh", overflowY: "auto"
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px", borderBottom: "1px solid var(--border)"
            }}>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)" }}>جزئیات درخواست</h2>
              <button
                onClick={() => setSelectedReservation(null)}
                style={{
                  background: "var(--bg-hover)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)", width: "32px", height: "32px",
                  cursor: "pointer", color: "var(--text-secondary)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Name */}
              <div style={{
                background: "var(--bg-surface)", borderRadius: "var(--radius-md)",
                padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px"
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent), #d97706)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", flexShrink: 0
                }}>
                  {selectedReservation.name?.[0] || "?"}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)" }}>
                    {selectedReservation.name} {selectedReservation.lastname}
                  </div>
                  <a href={`tel:${selectedReservation.phone}`} style={{ fontSize: "14px", color: "var(--accent)", textDecoration: "none", fontFamily: "monospace" }}>
                    {selectedReservation.phone}
                  </a>
                </div>
              </div>

              {/* Services */}
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.05em" }}>سرویس‌های انتخاب شده</div>
                {Array.isArray(selectedReservation.services) && selectedReservation.services.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {selectedReservation.services.map((svc, idx) => (
                      <span key={idx} className="badge badge-amber" style={{ fontSize: "13px" }}>
                        {typeof svc === "object" ? svc.name : svc}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>هیچ سرویسی انتخاب نشده</div>
                )}
              </div>

              {/* Description */}
              {selectedReservation.description && (
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.05em" }}>توضیحات</div>
                  <div style={{
                    background: "var(--bg-input)", borderRadius: "var(--radius-md)",
                    padding: "14px", fontSize: "14px", color: "var(--text-secondary)",
                    lineHeight: "1.8", whiteSpace: "pre-wrap"
                  }}>
                    {selectedReservation.description}
                  </div>
                </div>
              )}

              {/* Date */}
              <div style={{ fontSize: "12px", color: "var(--text-primary)", paddingTop: "4px" }}>
                تاریخ ثبت: {new Date(selectedReservation.createdAt).toLocaleString("fa-IR")}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setSelectedReservation(null)} className="btn-ghost">بستن</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
