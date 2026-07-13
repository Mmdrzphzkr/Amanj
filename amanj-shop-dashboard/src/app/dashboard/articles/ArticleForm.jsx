"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const slugify = (text) => {
  if (!text) return "";
  return text.toString().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FF0-9a-zA-Z-]/g, "")
    .replace(/--+/g, "-")
    .toLowerCase();
};

export default function ArticleForm({ categories = [], initialData }) {
  const router = useRouter();
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState({
    title: "", slug: "", content: "", excerpt: "",
    category: "", author: "", published_date: "",
    SEO: { metaTitle: "", metaDescription: "" },
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode && initialData) {
      const attrs = initialData.attributes ?? initialData;
      setFormData({
        title: attrs.title ?? "",
        slug: attrs.slug ?? "",
        content: JSON.stringify(attrs.content ?? []) ?? "",
        excerpt: attrs.excerpt ?? "",
        category: attrs.category?.data?.id ?? attrs.category?.id ?? "",
        author: attrs.author ?? "",
        published_date: attrs.published_date ? attrs.published_date.slice(0, 16) : "",
        SEO: {
          metaTitle: attrs.SEO?.metaTitle ?? attrs.metaTitle ?? "",
          metaDescription: attrs.SEO?.metaDescription ?? attrs.metaDescription ?? "",
        },
      });

      const img = attrs.image?.data ?? attrs.image ?? null;
      if (img) {
        const base = process.env.NEXT_PUBLIC_STRAPI_URL ?? "";
        const url = img.url || img.attributes?.url || null;
        if (url) {
          setImagePreview(url.startsWith("/") ? `${base}${url}` : url);
        }
      }
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "title") newState.slug = slugify(value);
      return newState;
    });
  };

  const handleSEOChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      SEO: { ...prev.SEO, [name]: value },
    }));
  };

  const handleImageFile = (file) => {
    if (!file) return;
    setImageFile(file);
    try { setImagePreview(URL.createObjectURL(file)); } catch {}
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    const fd = new FormData();
    fd.append("files", imageFile);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data[0].id;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const uploadedImageId = await uploadImage();

      const payloadData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category || null,
        author: formData.author,
        published_date: formData.published_date || null,
        SEO: {
          metaTitle: formData.SEO.metaTitle,
          metaDescription: formData.SEO.metaDescription,
        },
      };
      if (uploadedImageId) payloadData.image = uploadedImageId;

      let url, method;
      if (isEditMode) {
        url = `/api/articles/${initialData.documentId}`;
        method = "PUT";
      } else {
        url = "/api/articles";
        method = "POST";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payloadData }),
      });

      if (!res.ok) throw new Error("Failed to save article");
      router.push("/dashboard/articles");
    } catch (err) {
      console.error(err);
      alert("خطا در ذخیره مقاله");
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
          <h1 className="page-title">{isEditMode ? "ویرایش مقاله" : "مقاله جدید"}</h1>
          <p className="page-subtitle">{isEditMode ? "اطلاعات مقاله را ویرایش کنید" : "مقاله جدیدی بنویسید"}</p>
        </div>
        <button onClick={() => router.back()} className="btn-ghost">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          بازگشت
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "20px", color: "var(--text-primary)" }}>اطلاعات اصلی</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ gridColumn: "1/-1" }}>
                  <label className="label">عنوان مقاله <span style={{ color: "var(--danger)" }}>*</span></label>
                  <input name="title" value={formData.title} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} required style={inputStyle} placeholder="عنوان مقاله را وارد کنید" />
                </div>
                <div>
                  <label className="label">اسلاگ (URL)</label>
                  <input name="slug" value={formData.slug} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} style={{ ...inputStyle, direction: "ltr" }} placeholder="article-slug" />
                </div>
                <div>
                  <label className="label">دسته‌بندی</label>
                  <select name="category" value={formData.category} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="">انتخاب دسته‌بندی</option>
                    {(Array.isArray(categories) ? categories : categories?.data ?? []).map((c) => {
                      const item = c.attributes ?? c;
                      const id = c.id ?? item?.id ?? item?.documentId ?? "";
                      const label = item?.name ?? item?.title ?? String(id);
                      return <option key={id} value={String(id)}>{label}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="label">نویسنده</label>
                  <input name="author" value={formData.author} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} style={inputStyle} placeholder="نام نویسنده" />
                </div>
                <div>
                  <label className="label">تاریخ انتشار</label>
                  <input name="published_date" type="datetime-local" value={formData.published_date} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} style={{ ...inputStyle, direction: "ltr" }} />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label className="label">خلاصه مقاله</label>
                  <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} onFocus={onFocus} onBlur={onBlur}
                    style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} placeholder="خلاصه کوتاهی از مقاله..." />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label className="label">متن مقاله</label>
                  <textarea name="content" value={formData.content} onChange={handleChange} onFocus={onFocus} onBlur={onBlur}
                    style={{ ...inputStyle, minHeight: "300px", resize: "vertical" }} placeholder="محتوای مقاله را وارد کنید..." />
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "20px", color: "var(--text-primary)" }}>تنظیمات SEO</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                <div>
                  <label className="label">عنوان SEO (Meta Title)</label>
                  <input name="metaTitle" value={formData.SEO.metaTitle} onChange={handleSEOChange} onFocus={onFocus} onBlur={onBlur} style={inputStyle} placeholder="عنوان برای موتورهای جستجو" />
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>اگر خالی بماند، عنوان مقاله استفاده می‌شود</p>
                </div>
                <div>
                  <label className="label">توضیحات SEO (Meta Description)</label>
                  <textarea name="metaDescription" value={formData.SEO.metaDescription} onChange={handleSEOChange} onFocus={onFocus} onBlur={onBlur}
                    style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} placeholder="توضیح کوتاه برای نتایج جستجو" />
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>حداکثر ۱۶۰ کاراکتر توصیه می‌شود</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="card" style={{ padding: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", color: "var(--text-primary)" }}>تصویر شاخص</h3>
              {imagePreview ? (
                <div style={{ marginBottom: "12px", position: "relative" }}>
                  <img src={imagePreview} alt="پیش‌نمایش" style={{ width: "100%", borderRadius: "var(--radius-md)", maxHeight: "200px", objectFit: "cover" }} />
                  <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }}
                    style={{ position: "absolute", top: "8px", left: "8px", background: "rgba(0,0,0,0.7)", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              ) : (
                <label style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  border: "2px dashed var(--border)", borderRadius: "var(--radius-md)", padding: "28px 16px", cursor: "pointer",
                  background: "transparent", transition: "all 0.15s", marginBottom: "12px"
                }}>
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth={1.5} style={{ marginBottom: "8px" }}>
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>
                    تصویر را اینجا بکشید<br/>یا کلیک کنید
                  </span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageFile(e.target.files?.[0])} style={{ display: "none" }} />
                </label>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={saving} style={{ width: "100%", justifyContent: "center", padding: "13px", opacity: saving ? 0.7 : 1 }}>
              {saving ? (
                <>
                  <div style={{ width: "16px", height: "16px", border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#0d0f14", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7"/></svg>
                  {isEditMode ? "به‌روزرسانی مقاله" : "ایجاد مقاله"}
                </>
              )}
            </button>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } @media(max-width:768px){ form > div { grid-template-columns: 1fr !important; } }`}</style>
      </form>
    </div>
  );
}
