// src/app/dashboard/products/ProductsTable.jsx
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

export default function ProductsTable({ products }) {
  console.log("ProductsTable products:", products );
  return (
    <TableContainer component={Paper}>
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
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell component="th" scope="row">
                {product.name}
              </TableCell>
              <TableCell align="right">${product.price}</TableCell>
              <TableCell align="right">{product.stock}</TableCell>
              <TableCell align="right">
                {product.category?.data?.attributes?.name || "N/A"}
              </TableCell>
              <TableCell align="right">
                <Button
                  component={Link}
                  href={`/dashboard/products/${product.id}`}
                >
                  ویرایش
                </Button>
                {/* Delete functionality will require another API call */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
