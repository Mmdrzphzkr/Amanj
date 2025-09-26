// src/app/dashboard/categories/new/page.jsx
import { Box, Typography } from "@mui/material";
import CategoryForm from "../CategoryForm";
import { getStrapiData } from "@/lib/strapi"; // Import the data fetcher

export default async function NewCategoryPage() {
  // Fetch all existing categories on the server
  const { data: categories } = await getStrapiData("/api/product-categories");

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        ایجاد دسته بندی جدید
      </Typography>
      {/* Pass the list of categories to the form */}
      <CategoryForm allCategories={categories} />
    </Box>
  );
}
