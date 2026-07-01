// ═══════════════════════════════════════════════════════
// FILE: src/app/dashboard/brands/BrandForm.jsx
// ═══════════════════════════════════════════════════════
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BrandForm({ initialData }) {
  const [name, setName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isEditMode) {
      setName(initialData.attributes?.name || initialData.name || "");
      const logoData = initialData.attributes?.logo?.data ?? initialData.logo?.data ?? null;
      if (logoData) {
        const url = logoData.attributes?.url ?? logoData.url;
        if (url) setLogoPreview(`${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`);
      }
    }
  }, [initialData, isEditMode]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const inputStyle = {
    width: "100%", background: "var(--bg-input)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)", color: "var(--text-primary)",
    fontFamily: "inherit", fontSize: "14px", padding: "11px 14px", outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s"
  };
  const onFocus = (e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-dim)"; };
  const onBlur = (e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let logoId = isEditMode
        ? (initialData.attributes?.logo?.data?.id ?? initialData.logo?.data?.id ?? null)
        : null;

      if (logoFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("files", logoFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadFormData });
        const uploadData = await uploadRes.json();
        if (uploadData && uploadData.length > 0) {
          logoId = uploadData[0].id;
        } else {
          alert("خطا در آپلود لوگو");
          return;
        }
      }

      const payload = { name, logo: logoId };
      const url = isEditMode ? `/api/brands/${initialData.id}` : "/api/brands";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.refresh();
        router.push("/dashboard/brands");
      } else {
        alert(`خطا در ${isEditMode ? "به‌روزرسانی" : "ایجاد"} برند`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEditMode ? "ویرایش برند" : "برند جدید"}</h1>
          <p className="page-subtitle">{isEditMode ? "اطلاعات برند را ویرایش کنید" : "برند جدیدی به سیستم اضافه کنید"}</p>
        </div>
        <button onClick={() => router.back()} className="btn-ghost">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          بازگشت
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: "520px" }}>
        <div className="card" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label className="label">نام برند <span style={{ color: "var(--danger)" }}>*</span></label>
            <input
              required value={name} onChange={(e) => setName(e.target.value)}
              onFocus={onFocus} onBlur={onBlur}
              style={inputStyle} placeholder="نام برند را وارد کنید"
            />
          </div>

          <div>
            <label className="label">لوگو</label>
            {logoPreview ? (
              <div style={{ marginBottom: "12px", position: "relative", display: "inline-block" }}>
                <img src={logoPreview} alt="لوگو" style={{
                  width: "120px", height: "120px", objectFit: "contain",
                  borderRadius: "var(--radius-md)", border: "1px solid var(--border)",
                  background: "var(--bg-input)", padding: "8px"
                }} />
                <button type="button" onClick={() => { setLogoPreview(null); setLogoFile(null); }}
                  style={{ position: "absolute", top: "-8px", left: "-8px", background: "var(--danger)", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            ) : null}
            <label style={{ display: "block" }}>
              <div className="btn-ghost" style={{ display: "inline-flex", cursor: "pointer" }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                {logoPreview ? "تغییر لوگو" : "انتخاب لوگو"}
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            </label>
            {isEditMode && <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>برای تغییر لوگو، فایل جدیدی انتخاب کنید</p>}
          </div>

          <button type="submit" className="btn-primary" disabled={saving} style={{ justifyContent: "center", padding: "13px", opacity: saving ? 0.7 : 1 }}>
            {saving ? "در حال ذخیره..." : (isEditMode ? "به‌روزرسانی برند" : "ذخیره برند")}
          </button>
        </div>
      </form>
    </div>
  );
}
