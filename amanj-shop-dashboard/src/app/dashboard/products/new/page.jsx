// src/app/dashboard/products/new/page.jsx
import { getStrapiData } from "@/lib/strapi";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  // 1. Fetch categories on the server before rendering
  const { data: categories } = await getStrapiData("/api/product-categories");
  const { data: brands } = await getStrapiData("/api/brands");
  // 2. Enforce the business rule: A product cannot be created without a category
  if (!categories || categories.length === 0) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          خطا: دسته‌بندی وجود ندارد
        </Typography>
        <Typography sx={{ mb: 4 }}>
          شما نمی‌توانید محصولی را بدون اختصاص دادن به یک دسته‌بندی ایجاد کنید.
          لطفاً ابتدا یک دسته‌بندی بسازید.
        </Typography>
        <Button
          variant="contained"
          component={Link}
          href="/dashboard/categories/new"
        >
          ایجاد دسته‌بندی جدید
        </Button>
      </Box>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          خطا: دسته‌بندی وجود ندارد
        </Typography>
        <Typography sx={{ mb: 4 }}>
          شما نمی‌توانید محصولی را بدون اختصاص دادن به یک دسته‌بندی ایجاد کنید.
          لطفاً ابتدا یک دسته‌بندی بسازید.
        </Typography>
        <Button
          variant="contained"
          component={Link}
          href="/dashboard/brands/new"
        >
          ایجاد دسته‌بندی جدید
        </Button>
      </Box>
    );
  }

  // 3. If categories exist, render the form and pass them as a prop
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        محصول جدید
      </Typography>
      <ProductForm categories={categories} brands={brands}/>
    </Box>
  );
}
