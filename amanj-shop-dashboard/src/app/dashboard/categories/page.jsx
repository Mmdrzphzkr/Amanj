// src/app/dashboard/categories/page.jsx
import { getStrapiData } from "@/lib/strapi";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Link from "next/link";

export default async function CategoriesPage() {
  const { data: categories } = await getStrapiData("/api/product-categories");
  console.log(categories);
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
        <Typography variant="h4">دسته بندی ها</Typography>
        <Button
          variant="contained"
          component={Link}
          href="/dashboard/categories/new"
        >
          افزودن دسته بندی جدید
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>نام دسته بندی</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category.documentId}>
                <TableCell>{category.name}</TableCell>
                <TableCell align="right">
                  <Button
                    component={Link}
                    href={`/dashboard/categories/${category.documentId}`}
                  >
                    ویرایش
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
