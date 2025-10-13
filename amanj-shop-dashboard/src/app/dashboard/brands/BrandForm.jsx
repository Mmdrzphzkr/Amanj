"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Paper,
  Input,
  Typography,
} from "@mui/material";

export default function BrandForm({ initialData }) {
  const [name, setName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const router = useRouter();
  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isEditMode) {
      setName(initialData.attributes.name || "");
    }
  }, [initialData, isEditMode]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let logoId = isEditMode ? initialData.attributes.logo?.data?.id : null;

    // 1. If a new logo file is selected, upload it first
    if (logoFile) {
      const uploadFormData = new FormData();
      uploadFormData.append("files", logoFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const uploadData = await uploadRes.json();

      if (uploadData && uploadData.length > 0) {
        logoId = uploadData[0].id;
      } else {
        alert("Failed to upload logo.");
        return;
      }
    }

    // 2. Prepare the payload for Strapi
    const payload = { name, logo: logoId };

    // 3. Determine URL and Method
    const url = isEditMode ? `/api/brands/${initialData.id}` : "/api/brands";
    const method = isEditMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert(`برند با موفقیت ${isEditMode ? "به‌روزرسانی" : "ایجاد"} شد`);
      router.refresh();
      router.push("/dashboard/brands");
    } else {
      alert(`خطا در ${isEditMode ? "به‌روزرسانی" : "ایجاد"} برند`);
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
          label="نام برند"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Typography variant="h6" sx={{ mt: 2 }}>
          لوگو
        </Typography>
        {isEditMode && initialData.attributes.logo?.data && (
          <Box sx={{ my: 2 }}>
            <Typography variant="body2">لوگوی فعلی:</Typography>
            <img
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${initialData.attributes.logo.data.attributes.url}`}
              alt="Current Logo"
              width="100"
            />
          </Box>
        )}
        <Input type="file" onChange={handleFileChange} sx={{ mt: 1, mb: 2 }} />
        <Typography variant="caption" display="block">
          {isEditMode ? "برای تغییر، فایل جدیدی را انتخاب کنید." : ""}
        </Typography>

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          {isEditMode ? "به‌روزرسانی" : "ذخیره"}
        </Button>
      </Box>
    </Paper>
  );
}
