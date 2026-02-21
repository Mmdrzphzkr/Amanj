// src/app/dashboard/products/ProductsTable.jsx
// need to npm install xlsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import Link from "next/link";
import BulkExcelControls from "./BulkExcelControls";

export default function ProductsTable({ products }) {
  console.log("ProductsTable products:", products);
  return (
    <TableContainer component={Paper}>
      <div style={{ padding: 12 }}>
        <BulkExcelControls products={products} />
      </div>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>نام محصول</TableCell>
            <TableCell align="right">قیمت</TableCell>
            <TableCell align="right">موجودی</TableCell>
            <TableCell align="right">دسته بندی</TableCell>
            <TableCell align="right">عملیات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((productItem) => {
            // Normalize Strapi response shape: productItem may be { id, attributes }
            const id = productItem.documentId;
            const attrs = productItem.attributes ?? productItem;
            const name = attrs?.name ?? "Unnamed Product";
            const price = attrs?.price ?? "No price found";
            const stock = attrs?.stock ?? "No stock information";
            const categoryName =
              attrs?.category?.data?.attributes?.name ||
              attrs?.category?.name ||
              "N/A";

            return (
              <TableRow key={id}>
                <TableCell component="th" scope="row">
                  {name}
                </TableCell>
                <TableCell align="right">{price}</TableCell>
                <TableCell align="right">{stock}</TableCell>
                <TableCell align="right">{categoryName}</TableCell>
                <TableCell align="right">
                  <Button component={Link} href={`/dashboard/products/${id}`}>
                    ویرایش
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
