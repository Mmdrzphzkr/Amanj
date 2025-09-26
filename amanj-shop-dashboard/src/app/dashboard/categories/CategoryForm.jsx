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

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

// The component now accepts initialData
export default function CategoryForm({ allCategories, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parent: "",
  });
  const router = useRouter();
  const isEditMode = Boolean(initialData);

  // Use useEffect to pre-fill the form when in edit mode
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: initialData.attributes.name || "",
        slug: initialData.attributes.slug || "",
        // The parent is a relation, so its ID is nested in the data object
        parent: initialData.attributes.parent?.data?.id || "",
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "name") {
        newState.slug = slugify(value);
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      slug: formData.slug,
      parent: formData.parent || null,
    };

    // Switch URL and Method based on edit mode
    const url = isEditMode
      ? `/api/product-categories/${initialData.id}`
      : "/api/product-categories";
    const method = isEditMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

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
          InputProps={{ readOnly: true }}
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
                // Prevent a category from being its own parent
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
