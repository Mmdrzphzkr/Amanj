// src/app/dashboard/products/ProductForm.jsx
"use client";

import { useState, useEffect } from "react"; // Import useEffect
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const persianSlugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FF0-9-]/g, "")
    .replace(/--+/g, "-");
};

// The component now accepts 'initialData'
export default function ProductForm({ categories, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const router = useRouter();
  // Check if we are in "edit" mode
  const isEditMode = Boolean(initialData);

  // Use useEffect to pre-fill the form if initialData exists
  useEffect(() => {
    if (isEditMode) {
      console.log("categories", categories);
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        price: initialData.price || "",
        stock: initialData.stock || "",
        category: initialData.category?.id || "",
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "name") {
        newState.slug = persianSlugify(value);
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      alert("لطفاً یک دسته‌بندی انتخاب کنید.");
      return;
    }

    // Switch URL and Method based on edit mode
    const url = isEditMode
      ? `/api/products/${initialData.id}`
      : "/api/products";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert(`محصول با موفقیت ${isEditMode ? "به‌روزرسانی" : "ایجاد"} شد!`);
        router.refresh();
        router.push("/dashboard/products");
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Submission error", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    // ... The JSX remains the same, but we add a dynamic button text ...
    <Paper sx={{ p: 4 }}>
           {" "}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* All your TextFields and Selects go here as before... */}
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
          InputProps={{ readOnly: true, style: { direction: "rtl" } }}
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
                {cat.name}
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
               {" "}
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
          {isEditMode ? "به‌روزرسانی محصول" : "ایجاد محصول"}       {" "}
        </Button>
             {" "}
      </Box>
         {" "}
    </Paper>
  );
}
