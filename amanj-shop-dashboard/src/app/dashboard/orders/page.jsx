// src/app/dashboard/orders/page.jsx
import { getStrapiData } from "@/lib/strapi";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import Link from "next/link";

export default async function OrdersPage() {
  const { data: orders } = await getStrapiData("/api/orders?populate=*");

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        سفارشات
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>شماره سفارش</TableCell>
              <TableCell>نام مشتری</TableCell>
              <TableCell>وضعیت</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell align="right">
                  <Button
                    component={Link}
                    href={`/dashboard/orders/${order.id}`}
                  >
                    مشاهده جزئیات
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
