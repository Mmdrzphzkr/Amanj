// src/app/dashboard/categories/CategoryForm.jsx
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
} from "@mui/material";

// 1. REMOVED the 'slugify' library import
// 2. ADDED our new custom function for Farsi slugs
const persianSlugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\u0600-\u06FF0-9-]/g, "") // Remove all non-Farsi, non-numeric, non-dash characters
    .replace(/--+/g, "-"); // Replace multiple - with single -
};

export default function CategoryForm({ allCategories, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parent: "",
  });
  const router = useRouter();
  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        parent: initialData.parent?.data?.id || "",
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "name") {
        // 3. USE our new custom function
        newState.slug = persianSlugify(value);
      }
      return newState;
    });
  };

  // ... the rest of your component (handleSubmit, JSX) remains exactly the same ...
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      slug: formData.slug,
      parent: formData.parent || null,
    };
    const url = isEditMode
      ? `/api/product-categories/${initialData.id}`
      : "/api/product-categories";
    const method = isEditMode ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("Response:", res);
    if (res.ok) {
      alert(`دسته بندی با موفقیت ${isEditMode ? "به‌روزرسانی" : "ایجاد"} شد`);
      router.refresh();
      router.push("/dashboard/categories");
    } else {
      alert(`خطا در ${isEditMode ? "به‌روزرسانی" : "ایجاد"} دسته بندی`);
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="name"
          label="نام دسته بندی"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="slug"
          label="اسلاگ (آدرس)"
          value={formData.slug}
          InputProps={{ readOnly: true, style: { direction: "rtl" } }} // Ensure slug is LTR
          helperText="این فیلد به صورت خودکار ساخته می‌شود."
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="parent-category-select-label">
            دسته بندی مادر
          </InputLabel>
          <Select
            labelId="parent-category-select-label"
            name="parent"
            value={formData.parent}
            label="دسته بندی مادر"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>هیچکدام (دسته بندی اصلی)</em>
            </MenuItem>
            {allCategories?.map(
              (cat) =>
                initialData?.id !== cat.id && (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                )
            )}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          {isEditMode ? "به‌روزرسانی" : "ذخیره"}
        </Button>
      </Box>
    </Paper>
  );
}
