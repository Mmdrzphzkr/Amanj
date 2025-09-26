// src/app/dashboard/categories/[id]/page.jsx
import { Box, Typography } from "@mui/material";
import CategoryForm from "../CategoryForm";
import { getStrapiData } from "@/lib/strapi";

export default async function EditCategoryPage({ params }) {
  const { id } = params;

  // 1. Fetch the specific category we want to edit
  const { data: categoryToEdit } = await getStrapiData(
    `/api/product-categories/${id}`
  );

  // 2. Fetch all categories to populate the 'parent' dropdown
  const { data: allCategories } = await getStrapiData(
    "/api/product-categories"
  );

  if (!categoryToEdit) {
    return <Typography>Category not found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        ویرایش دسته بندی
      </Typography>
      {/* 3. Pass both sets of data to the form */}
      <CategoryForm
        initialData={categoryToEdit}
        allCategories={allCategories}
      />
    </Box>
  );
}
