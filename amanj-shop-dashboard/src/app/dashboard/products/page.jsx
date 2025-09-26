// src/app/dashboard/products/page.jsx
import { getStrapiData } from "@/lib/strapi";
import { Typography, Box, Button, Link } from "@mui/material";
import ProductsTable from "./ProductsTable";

export default async function ProductPage() {
  const { data: products } = await getStrapiData("/api/products?populate=*");

  if (!products) {
    return (
      <Typography variant="h6" color="error">
        خطا در بارگذاری محصولات
      </Typography>
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
        <Typography variant="h4">محصولات</Typography>
        <Button
          variant="contained"
          component={Link}
          href="/dashboard/products/new"
        >
          افزودن محصول جدید
        </Button>
      </Box>
      <ProductsTable products={products} />
    </Box>
  );
}
