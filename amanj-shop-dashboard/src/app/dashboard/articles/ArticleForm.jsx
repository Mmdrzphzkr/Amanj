"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toJalali, jalaliToGregorian, jalaliMonths, daysInJalaliMonth } from "@/components/erp/helpers";

const slugify = (text) => {
  if (!text) return "";
  return text.toString().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FF0-9a-zA-Z-]/g, "")
    .replace(/--+/g, "-")
    .toLowerCase();
};

const getTimeFromISO = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch { return ""; }
};

export default function ArticleForm({ categories = [], initialData }) {
  const router = useRouter();
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState({
    title: "", slug: "", content: "", excerpt: "",
    category: "", author: "", time: "",
    SEO: { metaTitle: "", metaDescription: "" },
  });
  const [jYear, setJYear] = useState(1400);
  const [jMonth, setJMonth] = useState(1);
  const [jDay, setJDay] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const setFromISO = (iso) => {
      if (!iso) {
        const today = new Date();
        const j = toJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
        setJYear(j.year);
        setJMonth(j.month);
        setJDay(j.day);
        setFormData((p) => ({ ...p, time: "" }));
        return;
      }
      const d = new Date(iso);
      if (isNaN(d.getTime())) return;
      const j = toJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
      setJYear(j.year);
      setJMonth(j.month);
      setJDay(Math.min(j.day, daysInJalaliMonth(j.year, j.month)));
      setFormData((p) => ({
        ...p,
        time: `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
      }));
    };

    if (isEditMode && initialData) {
      const attrs = initialData.attributes ?? initialData;
      const extractText = (blocks) => {
        if (!blocks) return "";
        if (typeof blocks === "string") return blocks;
        if (Array.isArray(blocks)) {
          return blocks.map((b) => b.children?.map((c) => c.text).join("") || "").join("\n");
        }
        return String(blocks);
      };

      setFormData({
        title: attrs.title ?? "",
        slug: attrs.slug ?? "",
        content: extractText(attrs.content),
        excerpt: attrs.excerpt ?? "",
        category: attrs.category?.data?.id ?? attrs.category?.id ?? "",
        author: attrs.author ?? "",
        time: getTimeFromISO(attrs.published_date),
        SEO: {
          metaTitle: attrs.SEO?.metaTitle ?? attrs.metaTitle ?? "",
          metaDescription: attrs.SEO?.metaDescription ?? attrs.metaDescription ?? "",
        },
      });
      setFromISO(attrs.published_date);

      const img = attrs.image?.data ?? attrs.image ?? null;
      if (img) {
        const base = process.env.NEXT_PUBLIC_STRAPI_URL ?? "";
        const url = img.url || img.attributes?.url || null;
        if (url) {
          setImagePreview(url.startsWith("/") ? `${base}${url}` : url);
        }
      }
    } else {
      const today = new Date();
      const j = toJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
      setJYear(j.year);
      setJMonth(j.month);
      setJDay(j.day);
      setFormData((p) => ({ ...p, time: `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}` }));
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

  const handleJalaliYear = (e) => {
    const y = parseInt(e.target.value);
    setJYear(y);
    setJDay((prev) => Math.min(prev, daysInJalaliMonth(y, jMonth)));
  };

  const handleJalaliMonth = (e) => {
    const m = parseInt(e.target.value);
    setJMonth(m);
    setJDay((prev) => Math.min(prev, daysInJalaliMonth(jYear, m)));
  };

  const handleJalaliDay = (e) => {
    setJDay(parseInt(e.target.value));
  };

  const handleImageFile = (file) => {
    if (!file) return;
    setImageFile(file);
    try { setImagePreview(URL.createObjectURL(file)); } catch {}
  };

  const authHeaders = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
    ? { Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}` }
    : {};

  const uploadImage = async () => {
    if (!imageFile) return null;
    const fd = new FormData();
    fd.append("files", imageFile);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: authHeaders,
      body: fd,
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data[0].id;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const uploadedImageId = await uploadImage();

      const greg = jalaliToGregorian(jYear, jMonth, jDay);
      const isoDate = formData.time
        ? `${greg.year}-${String(greg.month).padStart(2, "0")}-${String(greg.day).padStart(2, "0")}T${formData.time}:00.000Z`
        : `${greg.year}-${String(greg.month).padStart(2, "0")}-${String(greg.day).padStart(2, "0")}T00:00:00.000Z`;

      const payloadData = {
        title: formData.title,
        slug: formData.slug,
        content: [{ type: "paragraph", children: [{ type: "text", text: formData.content }] }],
        excerpt: formData.excerpt,
        category: formData.category ? { connect: [{ id: parseInt(formData.category) }] } : null,
        author: formData.author,
        published_date: isoDate,
        SEO: formData.SEO.metaTitle || formData.SEO.metaDescription
          ? [{ id: null, metaTitle: formData.SEO.metaTitle, metaDescription: formData.SEO.metaDescription }]
          : null,
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
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ data: payloadData }),
      });

      if (!res.ok) {
        let errorMsg = "خطا در ذخیره مقاله";
        try {
          const errorData = await res.json();
          errorMsg = errorData?.error?.message || JSON.stringify(errorData?.error?.details || errorData);
        } catch {}
        throw new Error(errorMsg);
      }
      router.push("/dashboard/articles");
    } catch (err) {
      console.error(err);
      alert(err.message || "خطا در ذخیره مقاله");
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
                      const id = item?.documentId ?? "";
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
                  <label className="label">تاریخ انتشار (شمسی)</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <select value={jYear} onChange={handleJalaliYear} style={{ ...inputStyle, flex: 1, cursor: "pointer", direction: "ltr" }}>
                      {(() => {
                        const today = new Date();
                        const tj = toJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
                        const opts = [];
                        for (let y = tj.year - 5; y <= tj.year + 5; y++) opts.push(y);
                        return opts.map((y) => <option key={y} value={y}>{y}</option>);
                      })()}
                    </select>
                    <select value={jMonth} onChange={handleJalaliMonth} style={{ ...inputStyle, flex: 1.5, cursor: "pointer" }}>
                      {jalaliMonths.map((name, idx) => (
                        <option key={idx + 1} value={idx + 1}>{name}</option>
                      ))}
                    </select>
                    <select value={jDay} onChange={handleJalaliDay} style={{ ...inputStyle, flex: 1, cursor: "pointer", direction: "ltr" }}>
                      {Array.from({ length: daysInJalaliMonth(jYear, jMonth) }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">ساعت انتشار</label>
                  <input name="time" type="time" value={formData.time} onChange={handleChange} onFocus={onFocus} onBlur={onBlur} style={{ ...inputStyle, direction: "ltr" }} />
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
