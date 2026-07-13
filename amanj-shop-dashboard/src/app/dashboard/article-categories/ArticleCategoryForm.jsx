"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const persianSlugify = (text) => {
  if (!text) return "";
  return text.toString().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FF0-9-]/g, "")
    .replace(/--+/g, "-");
};

export default function ArticleCategoryForm({ allCategories, initialData }) {
  const [formData, setFormData] = useState({ name: "", slug: "", description: "", parent: "" });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        parent: initialData.parent?.data?.id || "",
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "name") newState.slug = persianSlugify(value);
      return newState;
    });
  };

  const authHeaders = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
    ? { Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}` }
    : {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        parent: formData.parent || null,
      };
      const url = isEditMode
        ? `/api/article-categories/${initialData.documentId}`
        : "/api/article-categories";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ data: payload }),
      });

      if (res.ok) {
        router.refresh();
        router.push("/dashboard/article-categories");
      } else {
        alert(`خطا در ${isEditMode ? "به‌روزرسانی" : "ایجاد"} دسته‌بندی`);
      }
    } finally {
      setSaving(false);
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

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEditMode ? "ویرایش دسته‌بندی مقاله" : "دسته‌بندی جدید مقاله"}</h1>
          <p className="page-subtitle">{isEditMode ? "اطلاعات دسته‌بندی را ویرایش کنید" : "دسته‌بندی جدیدی اضافه کنید"}</p>
        </div>
        <button onClick={() => router.back()} className="btn-ghost">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          بازگشت
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
        <div className="card" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label className="label">نام دسته‌بندی <span style={{ color: "var(--danger)" }}>*</span></label>
            <input
              name="name" required value={formData.name}
              onChange={handleChange} onFocus={onFocus} onBlur={onBlur}
              style={inputStyle} placeholder="مثال: تعمیرات تخصصی"
            />
          </div>

          <div>
            <label className="label">اسلاگ (آدرس URL)</label>
            <input
              name="slug" value={formData.slug}
              readOnly onFocus={onFocus} onBlur={onBlur}
              style={{ ...inputStyle, direction: "ltr", background: "rgba(18,20,28,0.5)", cursor: "default" }}
            />
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "5px" }}>
              این فیلد به‌صورت خودکار از نام ساخته می‌شود
            </p>
          </div>

          <div>
            <label className="label">توضیحات</label>
            <textarea
              name="description" value={formData.description}
              onChange={handleChange} onFocus={onFocus} onBlur={onBlur}
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
              placeholder="توضیح کوتاهی درباره این دسته‌بندی..."
            />
          </div>

          <div>
            <label className="label">دسته‌بندی مادر</label>
            <select
              name="parent" value={formData.parent}
              onChange={handleChange} onFocus={onFocus} onBlur={onBlur}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">— دسته‌بندی اصلی (بدون والد)</option>
              {allCategories?.map((cat) =>
                initialData?.id !== cat.id && (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                )
              )}
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={saving} style={{ justifyContent: "center", padding: "13px", opacity: saving ? 0.7 : 1 }}>
            {saving ? "در حال ذخیره..." : (isEditMode ? "به‌روزرسانی دسته‌بندی" : "ذخیره دسته‌بندی")}
          </button>
        </div>
      </form>
    </div>
  );
}
