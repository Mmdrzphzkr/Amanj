// src/app/dashboard/products/ProductForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm({ categories = [], brands = [], initialData }) {
  const router = useRouter();
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: "", slug: "", description: "", short_description: "",
    price: "", stock: "", category: "", brand: "", specifications: [], SEO: {},
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailId, setThumbnailId] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]); // Array of File objects for new uploads
  const [galleryPreviews, setGalleryPreviews] = useState([]); // URLs for preview
  const [existingGallery, setExistingGallery] = useState([]); // Array of {id, url} from Strapi
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [galleryDragOver, setGalleryDragOver] = useState(false);

  useEffect(() => {
    if (isEditMode && initialData) {
      const attrs = initialData.attributes ?? initialData;
      const extractRelId = (rel) => {
        const id = rel?.data?.id ?? rel?.id ?? rel ?? null;
        return id == null ? "" : String(id);
      };
      setFormData({
        name: attrs.name ?? "",
        slug: attrs.slug ?? "",
        description: JSON.stringify(attrs.description ?? []) ?? "",
        short_description: attrs.short_description ?? "",
        price: attrs.price ?? "",
        stock: attrs.stock ?? "",
        category: extractRelId(attrs.category),
        brand: extractRelId(attrs.brand),
        specifications: attrs.specifications ?? [],
        SEO: attrs.SEO ?? {},
      });

      // Thumbnail
      const thumb = attrs.thumbnail?.data ?? attrs.thumbnail ?? null;
      const existingThumbId = thumb?.id ?? null;
      if (existingThumbId) setThumbnailId(existingThumbId);
      const getMediaUrl = (m) => {
        if (!m) return null;
        const attrsFormats = m?.attributes?.formats ?? m?.formats ?? null;
        const urlFromFormats = attrsFormats?.thumbnail?.url ?? null;
        const urlFromAttrs = m?.attributes?.url ?? m?.url ?? null;
        const base = process.env.NEXT_PUBLIC_STRAPI_URL ?? "";
        const url = urlFromFormats || urlFromAttrs;
        if (!url) return null;
        return url.startsWith("/") ? `${base}${url}` : url;
      };
      setThumbnailPreview(getMediaUrl(thumb));

      // Gallery
      const galleryData = attrs.gallery?.data ?? attrs.gallery ?? [];
      const galleryItems = Array.isArray(galleryData) ? galleryData : [];
      const existing = galleryItems.map((item) => ({
        id: item.id,
        url: getMediaUrl(item),
        mime: item.attributes?.mime || item.mime,
      })).filter(item => item.url);
      setExistingGallery(existing);
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  // Thumbnail handlers
  const handleThumbnailFile = (file) => {
    if (!file) return;
    setThumbnailFile(file);
    try { setThumbnailPreview(URL.createObjectURL(file)); } catch {}
  };
  const handleThumbnailChange = (e) => handleThumbnailFile(e.target.files?.[0]);
  const handleThumbnailDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleThumbnailFile(e.dataTransfer.files?.[0]);
  };

  // Gallery handlers
  const handleGalleryFiles = (files) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    setGalleryFiles(prev => [...prev, ...fileArray]);
    const newPreviews = fileArray.map(file => URL.createObjectURL(file));
    setGalleryPreviews(prev => [...prev, ...newPreviews]);
  };
  const handleGalleryChange = (e) => handleGalleryFiles(e.target.files);
  const handleGalleryDrop = (e) => {
    e.preventDefault();
    setGalleryDragOver(false);
    handleGalleryFiles(e.dataTransfer.files);
  };
  const removeNewGalleryItem = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };
  const removeExistingGalleryItem = (index) => {
    setExistingGallery(prev => prev.filter((_, i) => i !== index));
  };

  const uploadThumbnail = async () => {
    if (!thumbnailFile) return thumbnailId;
    const fd = new FormData();
    fd.append("files", thumbnailFile);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data[0].id;
    return null;
  };

  const uploadGallery = async () => {
    if (galleryFiles.length === 0) return [];
    const fd = new FormData();
    galleryFiles.forEach(file => fd.append("files", file));
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (Array.isArray(data) && data.length) return data.map(item => item.id);
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const [uploadedThumbId, uploadedGalleryIds] = await Promise.all([
        uploadThumbnail(),
        uploadGallery(),
      ]);

      // جمع‌آوری آیدی‌های نهایی گالری: قبلی + جدید
      const existingIds = existingGallery.map(item => item.id);
      const finalGalleryIds = [...existingIds, ...uploadedGalleryIds];

      const payloadData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        short_description: formData.short_description,
        price: formData.price,
        stock: formData.stock,
        category: formData.category || null,
        brand: formData.brand || null,
      };
      if (uploadedThumbId) payloadData.thumbnail = uploadedThumbId;
      if (finalGalleryIds.length) payloadData.gallery = finalGalleryIds;

      let url, method;
      if (isEditMode) {
        url = `/api/products/${initialData.documentId}`;
        method = "PUT";
      } else {
        url = "/api/products";
        method = "POST";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payloadData }),
      });

      if (!res.ok) throw new Error("Failed to save product");
      router.push("/dashboard/products");
    } catch (err) {
      console.error(err);
      alert("خطا در ذخیره محصول");
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
          <h1 className="page-title">{isEditMode ? "ویرایش محصول" : "محصول جدید"}</h1>
          <p className="page-subtitle">{isEditMode ? "اطلاعات محصول را ویرایش کنید" : "اطلاعات محصول جدید را وارد کنید"}</p>
        </div>
        <button onClick={() => router.back()} className="btn-ghost">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          بازگشت
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>
          {/* Main Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "20px", color: "var(--text-primary)" }}>اطلاعات اصلی</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ gridColumn: "1/-1" }}>
                  <label className="label">نام محصول <span style={{ color: "var(--danger)" }}>*</span></label>
                  <input name="name" value={formData.name} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} required style={inputStyle} placeholder="نام محصول را وارد کنید" />
                </div>
                <div>
                  <label className="label">اسلاگ (URL)</label>
                  <input name="slug" value={formData.slug} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} style={{ ...inputStyle, direction: "ltr" }} placeholder="product-slug" />
                </div>
                <div>
                  <label className="label">قیمت (تومان)</label>
                  <input name="price" value={formData.price} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} style={inputStyle} placeholder="۰" type="number" />
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
                  <label className="label">برند</label>
                  <select name="brand" value={formData.brand} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="">انتخاب برند</option>
                    {(Array.isArray(brands) ? brands : brands?.data ?? []).map((b) => {
                      const item = b.attributes ?? b;
                      const id = b.id ?? item?.id ?? item?.documentId ?? "";
                      const label = item?.name ?? item?.title ?? String(id);
                      return <option key={id} value={String(id)}>{label}</option>;
                    })}
                  </select>
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label className="label">توضیح کوتاه</label>
                  <input name="short_description" value={formData.short_description} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} style={inputStyle} placeholder="یک خط توضیح" />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label className="label">توضیحات کامل</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} onFocus={onFocus} onBlur={onBlur}
                    style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }} placeholder="توضیحات محصول را وارد کنید..." />
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px", color: "var(--text-primary)" }}>گالری تصاویر و ویدیوها</h3>
              {/* Existing Gallery Items */}
              {existingGallery.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <label className="label">رسانه‌های موجود</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "8px" }}>
                    {existingGallery.map((item, idx) => (
                      <div key={item.id} style={{ position: "relative", width: "100px", height: "100px", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border)" }}>
                        {item.mime?.startsWith("video") ? (
                          <video src={item.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <img src={item.url} alt="gallery" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                        <button type="button" onClick={() => removeExistingGalleryItem(idx)}
                          style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.7)", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Gallery Previews */}
              {galleryPreviews.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <label className="label">رسانه‌های جدید</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "8px" }}>
                    {galleryPreviews.map((url, idx) => (
                      <div key={idx} style={{ position: "relative", width: "100px", height: "100px", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border)" }}>
                        <img src={url} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button type="button" onClick={() => removeNewGalleryItem(idx)}
                          style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.7)", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Drop Zone for Gallery */}
              <label
                onDragOver={(e) => { e.preventDefault(); setGalleryDragOver(true); }}
                onDragLeave={() => setGalleryDragOver(false)}
                onDrop={handleGalleryDrop}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  border: `2px dashed ${galleryDragOver ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "var(--radius-md)", padding: "24px 16px", cursor: "pointer",
                  background: galleryDragOver ? "var(--accent-dim)" : "transparent",
                  transition: "all 0.15s", marginBottom: "12px"
                }}
              >
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke={galleryDragOver ? "var(--accent)" : "var(--text-muted)"} strokeWidth={1.5} style={{ marginBottom: "8px" }}>
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>
                  فایل‌های گالری را اینجا بکشید (چندتایی)<br/>یا کلیک کنید
                </span>
                <input type="file" accept="image/*,video/*" multiple onChange={handleGalleryChange} style={{ display: "none" }} />
              </label>
              <div className="btn-ghost" style={{ width: "100%", justifyContent: "center", cursor: "pointer" }} onClick={() => document.getElementById("gallery-input").click()}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                انتخاب فایل‌های گالری
              </div>
              <input id="gallery-input" type="file" accept="image/*,video/*" multiple onChange={handleGalleryChange} style={{ display: "none" }} />
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Stock */}
            <div className="card" style={{ padding: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", color: "var(--text-primary)" }}>موجودی انبار</h3>
              <label className="label">تعداد موجود</label>
              <input name="stock" value={formData.stock} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} style={inputStyle} placeholder="۰" type="number" />
            </div>

            {/* Thumbnail */}
            <div className="card" style={{ padding: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", color: "var(--text-primary)" }}>تصویر شاخص</h3>
              {thumbnailPreview ? (
                <div style={{ marginBottom: "12px", position: "relative" }}>
                  <img src={thumbnailPreview} alt="پیش‌نمایش" style={{ width: "100%", borderRadius: "var(--radius-md)", maxHeight: "180px", objectFit: "cover" }} />
                  <button type="button" onClick={() => { setThumbnailPreview(null); setThumbnailFile(null); }}
                    style={{ position: "absolute", top: "8px", left: "8px", background: "rgba(0,0,0,0.7)", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              ) : (
                <label
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleThumbnailDrop}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    border: `2px dashed ${dragOver ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: "var(--radius-md)", padding: "28px 16px", cursor: "pointer",
                    background: dragOver ? "var(--accent-dim)" : "transparent",
                    transition: "all 0.15s", marginBottom: "12px"
                  }}
                >
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke={dragOver ? "var(--accent)" : "var(--text-muted)"} strokeWidth={1.5} style={{ marginBottom: "8px" }}>
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>
                    فایل را اینجا بکشید<br/>یا کلیک کنید
                  </span>
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} style={{ display: "none" }} />
                </label>
              )}
              {!thumbnailPreview && (
                <label style={{ display: "block" }}>
                  <div className="btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: "13px", cursor: "pointer" }} onClick={() => document.getElementById("thumb-input").click()}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                    انتخاب فایل
                  </div>
                  <input id="thumb-input" type="file" accept="image/*" onChange={handleThumbnailChange} style={{ display: "none" }} />
                </label>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary" disabled={saving} style={{ width: "100%", justifyContent: "center", padding: "13px", opacity: saving ? 0.7 : 1 }}>
              {saving ? (
                <>
                  <div style={{ width: "16px", height: "16px", border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#0d0f14", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7"/></svg>
                  {isEditMode ? "به‌روزرسانی محصول" : "ایجاد محصول"}
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