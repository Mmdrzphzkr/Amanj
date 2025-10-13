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
} from "@mui/material";

// Assume persianSlugify function is here...

export default function ProductForm({ categories, brands, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    specifications: [{ attribute: "", value: "" }],
    seo: { metaTitle: "", metaDescription: "" },
  });
  const [thumbnail, setThumbnail] = useState(null);
  const router = useRouter();
  const isEditMode = Boolean(initialData);

  // ... (useEffect and handleChange logic would need to be updated for all fields)

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let thumbnailId = null;

    // 1. Upload the thumbnail image first
    if (thumbnail) {
      const uploadFormData = new FormData();
      uploadFormData.append("files", thumbnail);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const uploadData = await uploadRes.json();

      if (uploadData && uploadData.length > 0) {
        thumbnailId = uploadData[0].id;
      } else {
        alert("Failed to upload thumbnail.");
        return;
      }
    }

    // 2. Prepare the final product payload
    const productPayload = { ...formData, thumbnail: thumbnailId };

    // 3. Create the product
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productPayload),
    });

    if (res.ok) {
      alert("Product created successfully!");
      router.refresh();
      router.push("/dashboard/products");
    } else {
      alert("Error creating product.");
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* All your existing fields for name, slug, category, etc. */}

        {/* Short Description */}
        <TextField
          margin="normal"
          fullWidth
          name="short_description"
          label="توضیحات کوتاه"
        />

        {/* Brand Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel>برند</InputLabel>
          <Select name="brand" label="برند">
            {brands?.map((brand) => (
              <MenuItem key={brand.id} value={brand.id}>
                {brand.attributes.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Thumbnail Upload */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          تصویر شاخص
        </Typography>
        <Input type="file" onChange={handleFileChange} sx={{ mt: 1, mb: 2 }} />

        {/* Add sections for Specifications and SEO here */}
        {/* For Specifications, you would map over the state and render TextFields for attribute/value */}
        {/* For SEO, you would have TextFields for metaTitle and metaDescription */}

        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
          {isEditMode ? "به‌روزرسانی محصول" : "ایجاد محصول"}
        </Button>
      </Box>
    </Paper>
  );
}
