import { getStrapiData } from "@/lib/strapi";
import { Box, Typography } from "@mui/material";
import BrandForm from "../BrandForm";

export default async function EditBrandPage({ params }) {
  const { id } = params;
  const { data: brandToEdit } = await getStrapiData(
    `/api/brands/${id}?populate=logo`
  );

  if (!brandToEdit) {
    return <Typography>Brand not found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        ویرایش برند
      </Typography>
      <BrandForm initialData={brandToEdit} />
    </Box>
  );
}
