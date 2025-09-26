// src/app/dashboard/products/[id]/page.jsx
import { getStrapiData } from "@/lib/strapi";
import { Typography, Box, ProductForm } from "@mui/material";
import ProductForm from "../ProductForm";
export default async function EditProductPage() {
  const { id } = params;
  const { data: product } = await getStrapiData(`/api/products/${id}`);

  if (!product) {
    return <Typography> محصول مورد نظر یافت نشد !! </Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        ویرایش محصول
      </Typography>
      <ProductForm initialData={product} />
    </Box>
  );
}
