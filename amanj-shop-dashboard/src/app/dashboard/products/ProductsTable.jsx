// src/app/dashboard/products/ProductsTable.jsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BulkExcelControls from "./BulkExcelControls";

export default function ProductsTable({ products }) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
    setDeleting(false);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${productToDelete.documentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh(); // بازبارگذاری صفحه برای به‌روزرسانی لیست
        closeDeleteModal();
      } else {
        const error = await res.json();
        alert(`خطا در حذف محصول: ${error?.message || "مشخص نیست"}`);
        closeDeleteModal();
      }
    } catch (err) {
      console.error(err);
      alert("خطا در ارتباط با سرور");
      closeDeleteModal();
    }
  };

  return (
    <div>
      {/* Excel Controls */}
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "16px 20px",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap"
      }}>
        <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>عملیات دسته‌جمعی:</span>
        <BulkExcelControls products={products} />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: "40%" }}>نام محصول</th>
              <th>قیمت</th>
              <th>موجودی</th>
              <th>دسته‌بندی</th>
              <th style={{ textAlign: "center" }}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>📦</div>
                  محصولی یافت نشد
                </td>
              </tr>
            ) : products.map((productItem) => {
              const id = productItem.documentId;
              const attrs = productItem.attributes ?? productItem;
              const name = attrs?.name ?? "محصول بدون نام";
              const price = attrs?.price;
              const stock = attrs?.stock;
              const categoryName =
                attrs?.category?.data?.attributes?.name ||
                attrs?.category?.name ||
                null;

              const stockNum = parseInt(stock, 10);
              const stockBadge = isNaN(stockNum) ? null :
                stockNum === 0 ? "red" :
                stockNum <= 5 ? "amber" : "green";

              return (
                <tr key={id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{name}</div>
                  </td>
                  <td>
                    {price != null ? (
                      <span style={{ fontWeight: 600, color: "var(--accent)" }}>
                        {Number(price).toLocaleString("fa-IR")} تومان
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>قیمت ثبت نشده</span>
                    )}
                  </td>
                  <td>
                    {stockBadge ? (
                      <span className={`badge badge-${stockBadge}`}>
                        {stock}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>—</span>
                    )}
                   </td>
                  <td>
                    {categoryName ? (
                      <span className="badge badge-blue">{categoryName}</span>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>—</span>
                    )}
                   </td>
                  <td style={{ textAlign: "center", display: "flex", gap: "8px", justifyContent: "center" }}>
                    <Link href={`/dashboard/products/${id}`} style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      padding: "7px 14px", borderRadius: "var(--radius-sm)",
                      background: "var(--bg-hover)", border: "1px solid var(--border)",
                      color: "var(--text-secondary)", fontSize: "13px", fontWeight: 500,
                      textDecoration: "none", transition: "all 0.15s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      ویرایش
                    </Link>
                    <button
                      onClick={() => openDeleteModal({ documentId: id, name })}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        padding: "7px 14px", borderRadius: "var(--radius-sm)",
                        background: "var(--bg-hover)", border: "1px solid var(--border)",
                        color: "var(--danger)", fontSize: "13px", fontWeight: 500,
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--danger)"; e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.background = "var(--danger-dim)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.background = "var(--bg-hover)"; }}
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 002 2h8a2 2 0 002-2l1-13M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                      </svg>
                      حذف
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div
          onClick={closeDeleteModal}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, backdropFilter: "blur(4px)", padding: "20px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card"
            style={{
              maxWidth: "420px", width: "100%",
              padding: 0, overflow: "hidden"
            }}
          >
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "var(--danger-dim)", color: "var(--danger)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 700 }}>حذف محصول</h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                  آیا از حذف این محصول اطمینان دارید؟
                </p>
              </div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <p style={{ marginBottom: "16px" }}>
                محصول <strong>{productToDelete.name}</strong> به طور کامل از سیستم حذف خواهد شد.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  onClick={closeDeleteModal}
                  className="btn-ghost"
                  style={{ padding: "8px 16px" }}
                  disabled={deleting}
                >
                  انصراف
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-primary"
                  style={{
                    background: "var(--danger)", color: "white",
                    padding: "8px 20px", opacity: deleting ? 0.7 : 1
                  }}
                  disabled={deleting}
                >
                  {deleting ? "در حال حذف..." : "حذف محصول"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}