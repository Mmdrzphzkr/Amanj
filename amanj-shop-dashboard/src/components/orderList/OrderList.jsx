"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Skeleton,
  Stack,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { VisibilityOutlined, ShoppingBagOutlined } from "@mui/icons-material";

// تابع کمکی برای نمایش وضعیت با رنگ‌های MUI
const getStatusBadge = (status) => {
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
      size="small"
      variant="filled"
    />
  );
};

export default function OrdersList() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchOrders();
    } else if (!authLoading && !isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/orders");

      if (res.status === 401) {
        throw new Error("نشست کاربری شما منقضی شده است.");
      }

      if (!res.ok) {
        throw new Error("خطا در دریافت لیست سفارشات.");
      }

      const data = await res.json();
      // دیتای دریافتی از استرپی معمولاً به صورت آرایه مستقیم (از API Route شما) برمی‌گردد
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Stack spacing={2}>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={100}
            sx={{ borderRadius: 4 }}
          />
        ))}
      </Stack>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "#FFF5F5",
          borderRadius: 4,
          border: "1px solid #FED7D7",
        }}
      >
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchOrders} sx={{ mt: 2 }}>
          تلاش مجدد
        </Button>
      </Box>
    );
  }

  if (orders?.length === 0) {
    return (
      <Box
        sx={{
          p: 8,
          textAlign: "center",
          bgcolor: "#F9F8F5",
          borderRadius: 8,
          border: "1px dashed #DED9CC",
        }}
      >
        <ShoppingBagOutlined sx={{ fontSize: 48, color: "#DED9CC", mb: 2 }} />
        <Typography color="textSecondary">
          شما تاکنون هیچ سفارشی ثبت نکرده‌اید.
        </Typography>
        <Button component={Link} href="/shop" sx={{ mt: 2, color: "#C5A35C" }}>
          مشاهده محصولات
        </Button>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {orders.map((order) => {
        const orderData = order;
        const orderId = order.id;
        const date = new Date(orderData.createdAt).toLocaleDateString("fa-IR");
        const calculateTotal = (items) => {
          if (!items || !Array.isArray(items)) return 0;
          return items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
        };

        const totalProductsPrice = calculateTotal(orderData.items);
        const finalPayable = totalProductsPrice + (orderData.shippingCost || 0);
        return (
          <Card
            key={orderId}
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid #eee",
              transition: "0.3s",
              "&:hover": {
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                borderColor: "#C5A35C",
              },
            }}
          >
            <CardContent sx={{ p: "16px !important" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "flex-start" : "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    سفارش #{orderData.order_id || orderId}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    ثبت شده در تاریخ: {date}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    width: isMobile ? "100%" : "auto",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ textAlign: isMobile ? "right" : "left" }}>
                    <Typography variant="body2" color="textSecondary">
                      مبلغ کل
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="success.main"
                    >
                      {finalPayable.toLocaleString()} تومان
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 1,
                    }}
                  >
                    {getStatusBadge(orderData.statuses)}
                    <Button
                      component={Link}
                      href={`/profile/orders/${orderId}`}
                      variant="text"
                      size="small"
                      startIcon={<VisibilityOutlined />}
                      sx={{ color: "#3F3F3F", fontWeight: "bold" }}
                    >
                      جزئیات
                    </Button>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}
