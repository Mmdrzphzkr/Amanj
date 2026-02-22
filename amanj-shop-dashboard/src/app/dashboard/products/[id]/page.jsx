// src/app/dashboard/products/[id]/page.jsx
import { getStrapiData } from "@/lib/strapi";
import { Typography, Box, Button } from "@mui/material";
import ProductForm from "../ProductForm";
import Link from "next/link";

export default async function EditProductPage(params) {
  const { id } = params.params;

  console.log("params:", id);

  const { data: product } = await getStrapiData(`/api/products/${id}?populate=*`);

  if (!product) {
    return <Typography> محصول مورد نظر یافت نشد !! </Typography>;
  }

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

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">
          ویرایش محصول
        </Typography>
        <Button
          variant="contained"
          component={Link}
          href="/dashboard/products"
        >
          برگشت
        </Button>
      </Box>
      <ProductForm initialData={product} categories={categories} brands={brands} />
    </Box>
  );
}
