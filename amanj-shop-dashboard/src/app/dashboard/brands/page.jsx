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

export default async function BrandsPage() {
  // Populate the logo to display it in the table
  const { data: brands } = await getStrapiData("/api/brands?populate=logo");

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
        <Typography variant="h4">برندها</Typography>
        <Button
          variant="contained"
          component={Link}
          href="/dashboard/brands/new"
        >
          افزودن برند جدید
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>لوگو</TableCell>
              <TableCell>نام برند</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands?.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>
                  {brand.logo?.data && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${brand.logo.data.url}`}
                      alt={brand.name}
                      width="50"
                      height="50"
                      style={{ objectFit: "contain" }}
                    />
                  )}
                </TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell align="right">
                  <Button
                    component={Link}
                    href={`/dashboard/brands/${brand.id}`}
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
