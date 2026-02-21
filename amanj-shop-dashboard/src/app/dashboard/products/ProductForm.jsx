// src/app/dashboard/products/ProductForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Input,
} from "@mui/material";

export default function ProductForm({ categories = [], brands = [], initialData }) {
  const router = useRouter();
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    specifications: [],
    SEO: {},
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailId, setThumbnailId] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode && initialData) {
      const attrs = initialData.attributes ?? initialData;
      // normalize relation ids (always use string values for Select control)
      const extractRelId = (rel) => {
        const id = rel?.data?.id ?? rel?.id ?? rel ?? null;
        return id == null ? "" : String(id);
      };
      const categoryId = extractRelId(attrs.category);
      const brandId = extractRelId(attrs.brand);

      setFormData({
        name: attrs.name ?? "",
        slug: attrs.slug ?? "",
        description: JSON.stringify(attrs.description ?? []) ?? "",
        short_description: attrs.short_description ?? "",
        price: attrs.price ?? "",
        stock: attrs.stock ?? "",
        category: categoryId,
        brand: brandId,
        specifications: attrs.specifications ?? [],
        SEO: attrs.SEO ?? {},
      });

      // existing thumbnail id and preview url
      const thumb = attrs.thumbnail?.data ?? attrs.thumbnail ?? null;
      const existingThumbId = thumb?.id ?? null;
      if (existingThumbId) setThumbnailId(existingThumbId);
      const getMediaUrl = (m) => {
        if (!m) return null;
        // Strapi v4 shape: m.attributes.url or m.url, or formats.thumbnail.url
        const attrsFormats = m?.attributes?.formats ?? m?.formats ?? null;
        const urlFromFormats = attrsFormats?.thumbnail?.url ?? null;
        const urlFromAttrs = m?.attributes?.url ?? m?.url ?? null;
        const base = process.env.NEXT_PUBLIC_STRAPI_URL ?? "";
        const url = urlFromFormats || urlFromAttrs;
        if (!url) return null;
        return url.startsWith("/") ? `${base}${url}` : url;
      };

      setThumbnailPreview(getMediaUrl(thumb));
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setThumbnailFile(file);
    if (file) {
      try {
        const url = URL.createObjectURL(file);
        setThumbnailPreview(url);
      } catch (e) {
        // ignore
      }
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const uploadedId = await uploadThumbnail();

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
      if (uploadedId) payloadData.thumbnail = uploadedId;

      if (isEditMode) {
        // initialData expected to contain id
        const id = initialData.id ?? initialData;
        const res = await fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: payloadData }),
        });
        if (!res.ok) throw new Error("Failed to update product");
        router.push("/dashboard/products");
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadData),
        });
        if (!res.ok) throw new Error("Failed to create product");
        router.push("/dashboard/products");
      }
    } catch (err) {
      console.error(err);
      alert("خطا در ذخیره محصول");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          fullWidth
          name="name"
          label="نام محصول"
          value={formData.name}
          onChange={handleChange}
        />

        <TextField
          margin="normal"
          fullWidth
          name="slug"
          label="اسلاگ"
          value={formData.slug}
          onChange={handleChange}
        />

        <TextField
          margin="normal"
          fullWidth
          name="short_description"
          label="توضیحات کوتاه"
          value={formData.short_description}
          onChange={handleChange}
        />

        <TextField
          margin="normal"
          fullWidth
          name="price"
          label="قیمت"
          value={formData.price}
          onChange={handleChange}
        />

        <TextField
          margin="normal"
          fullWidth
          name="stock"
          label="موجودی"
          value={formData.stock}
          onChange={handleChange}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>دسته‌بندی</InputLabel>
          <Select name="category" value={formData.category} label="دسته‌بندی" onChange={handleChange}>
            {(Array.isArray(categories) ? categories : categories?.data ?? []).map((c) => {
              const item = c.attributes ?? c;
              const id = c.id ?? item?.id ?? item?.documentId ?? "";
              const label = item?.name ?? item?.title ?? item?.slug ?? String(id);
              return (
                <MenuItem key={id} value={String(id)}>
                  {label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>برند</InputLabel>
          <Select name="brand" value={formData.brand} label="برند" onChange={handleChange}>
            {(Array.isArray(brands) ? brands : brands?.data ?? []).map((b) => {
              const item = b.attributes ?? b;
              const id = b.id ?? item?.id ?? item?.documentId ?? "";
              const label = item?.name ?? item?.title ?? item?.slug ?? String(id);
              return (
                <MenuItem key={id} value={String(id)}>
                  {label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <Typography variant="h6" sx={{ mt: 2 }}>
          تصویر شاخص
        </Typography>
        {thumbnailPreview && (
          <Box sx={{ mt: 1, mb: 2 }}>
            <img src={thumbnailPreview} alt="thumbnail preview" style={{ maxWidth: 240, maxHeight: 160, display: "block", marginBottom: 8 }} />
          </Box>
        )}
        <Input type="file" onChange={handleFileChange} sx={{ mt: 1, mb: 2 }} />

        <TextField
          margin="normal"
          fullWidth
          multiline
          rows={4}
          name="description"
          label="توضیحات"
          value={formData.description}
          onChange={handleChange}
        />

        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} disabled={saving}>
          {isEditMode ? "به‌روزرسانی محصول" : "ایجاد محصول"}
        </Button>
      </Box>
    </Paper>
  );
}
