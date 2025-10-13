import { Box, Typography } from "@mui/material";
import BrandForm from "../BrandForm";

export default function NewBrandPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        ایجاد برند جدید
      </Typography>
      <BrandForm />
    </Box>
  );
}
