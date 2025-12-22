import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
} from "@mui/material";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

async function getOrderDetails(orderId) {
  const cookieStore = cookies();
  const token = cookieStore.get("strapi_jwt")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${STRAPI_URL}/api/orders/${orderId}?populate=*`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = await res.json();
    const order = data.data;

    const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const currentUser = await userRes.json();

    if (order.attributes.users_permissions_user?.data?.id !== currentUser.id) {
      return null;
    }
    return order;
  } catch (error) {
    return null;
  }
}

const getStatusChip = (status) => {
  const statusMap = {
    pending_payment: { label: "در انتظار پرداخت", color: "warning" },
    paid: { label: "پرداخت شده", color: "info" },
    processing: { label: "در حال آماده‌سازی", color: "primary" },
    shipped: { label: "ارسال شده", color: "secondary" },
    delivered: { label: "تحویل موفق", color: "success" },
    cancelled: { label: "لغو شده", color: "error" },
  };
  const current = statusMap[status] || { label: status, color: "default" };
  return (
    <Chip
      label={current.label}
      color={current.color}
      variant="outlined"
      size="small"
    />
  );
};

export default async function OrderDetailsPage({ params }) {
  const order = await getOrderDetails(params.orderId);
  if (!order) return notFound();

  const orderData = order.attributes;
  const orderItems = orderData.items || [];
  const addressData = orderData.order_address?.data?.attributes || {};
  const date = new Date(orderData.createdAt).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3, mt: 4 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ borderBottom: "2px solid #eee", pb: 2 }}
      >
        جزئیات سفارش #{orderData.order_id || order.id}
      </Typography>

      <Grid container spacing={4}>
        {/* بخش اصلی: جدول محصولات و اطلاعات کلی */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{ p: 3, mb: 3, border: "1px solid #eee", borderRadius: 4 }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              اطلاعات کلی
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  تاریخ ثبت:
                </Typography>{" "}
                <Typography variant="body1">{date}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  وضعیت:
                </Typography>{" "}
                {getStatusChip(orderData.statuses)}
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  روش پرداخت:
                </Typography>{" "}
                <Typography variant="body1">
                  {orderData.paymentMethod === "card_to_card"
                    ? "کارت به کارت"
                    : "آنلاین"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  هزینه ارسال:
                </Typography>{" "}
                <Typography variant="body1">
                  {orderData.shippingCost?.toLocaleString()} تومان
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h6" fontWeight="bold" mb={2}>
            اقلام سفارش
          </Typography>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ border: "1px solid #eee", borderRadius: 4 }}
          >
            <Table aria-label="order items table">
              <TableHead sx={{ backgroundColor: "#f9f9f9" }}>
                <TableRow>
                  <TableCell align="right">نام محصول</TableCell>
                  <TableCell align="center">تعداد</TableCell>
                  <TableCell align="center">قیمت واحد</TableCell>
                  <TableCell align="center">جمع کل</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderItems.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="right" component="th" scope="row">
                      {item.title}
                    </TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="center">
                      {item.price?.toLocaleString()} ت
                    </TableCell>
                    <TableCell align="center">
                      {(item.price * item.quantity)?.toLocaleString()} ت
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* بخش کناری: آدرس و خلاصه مالی */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: "#fcfaf5",
              border: "1px solid #ded9cc",
              borderRadius: 4,
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              خلاصه مالی
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">مجموع محصولات:</Typography>
              <Typography variant="body2">
                {(
                  orderData.totalAmount - (orderData.shippingCost || 0)
                ).toLocaleString()}{" "}
                ت
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="body2">هزینه ارسال:</Typography>
              <Typography variant="body2">
                {(orderData.shippingCost || 0).toLocaleString()} ت
              </Typography>
            </Box>
            <Divider sx={{ mb: 2, borderStyle: "dashed" }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography fontWeight="bold">مبلغ نهایی:</Typography>
              <Typography fontWeight="bold" color="success.main" variant="h6">
                {orderData.totalAmount?.toLocaleString()} تومان
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{ p: 3, border: "1px solid #eee", borderRadius: 4 }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              آدرس تحویل
            </Typography>
            <Typography variant="subtitle2" color="primary" fontWeight="bold">
              {addressData.title}
            </Typography>
            <Typography variant="body2" mt={1}>
              {addressData.province}، {addressData.city}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mt: 1, lineHeight: 1.8 }}
            >
              {addressData.full_address}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              mt={2}
              color="textSecondary"
            >
              کد پستی: {addressData.postal_code}
            </Typography>
            <Typography variant="caption" display="block" color="textSecondary">
              تلفن: {addressData.phone}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
