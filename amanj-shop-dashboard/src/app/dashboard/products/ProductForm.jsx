// src/app/dashboard/products/ProductForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// A simple utility to convert a string to a URL-friendly slug
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -

export default function ProductForm({ categories }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    category: "", // new field
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      // Auto-generate slug when the name changes
      if (name === "name") {
        newState.slug = slugify(value);
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.category) {
      alert("لطفاً یک دسته‌بندی انتخاب کنید.");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("محصول با موفقیت ایجاد شد!");
        router.refresh();
        router.push("/dashboard/products");
      } else {
        const errorData = await res.json();
        alert(`Error creating product: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Submission error", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          name="name"
          label="نام محصول"
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
          InputProps={{ readOnly: true }} // Make slug read-only
          helperText="این فیلد به صورت خودکار ساخته می‌شود."
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="category-select-label">دسته‌بندی</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            name="category"
            value={formData.category}
            label="دسته‌بندی"
            onChange={handleChange}
          >
            {categories?.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.attributes.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          fullWidth
          name="description"
          label="توضیحات"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="price"
          label="قیمت"
          type="number"
          value={formData.price}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="stock"
          label="موجودی"
          type="number"
          value={formData.stock}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
          ایجاد محصول
        </Button>
      </Box>
    </Paper>
  );
}
