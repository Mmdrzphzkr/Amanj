"use client";

import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import Link from "next/link";
// MUI Components
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Divider,
  Avatar,
  Stack,
  IconButton,
  Container,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import EditIcon from "@mui/icons-material/Edit";

import Loading from "@/components/Loading/Loading";
import OrdersList from "@/components/orderList/OrderList";
import Header from "@/components/Header/Header";

export default function ProfilePage() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) return <Loading />;

  if (!isAuthenticated) {
    redirect("/login?callbackUrl=/profile");
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 12, mb: 6 }}>
        {/* سربرگ صفحه با دکمه‌های عملیاتی */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 6 }}
        >
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            پروفایل کاربری {user.username}
          </Typography>

          <Stack direction="row" spacing={2}>
            {/* دکمه بازگشت به صفحه اصلی */}
            <Button
              component={Link}
              href="/"
              variant="outlined"
              startIcon={<HomeIcon />}
              sx={{
                borderColor: "#EDE9DE",
                color: "#333",
                "&:hover": {
                  borderColor: "#D4CFC2",
                  backgroundColor: "#F9F8F5",
                },
              }}
            >
              صفحه اصلی
            </Button>

            {/* دکمه خروج */}
            <Button
              variant="contained"
              color="error"
              onClick={logout}
              startIcon={<ExitToAppIcon />}
              sx={{ px: 3, py: 1.5 }}
            >
              خروج از حساب
            </Button>
          </Stack>
        </Stack>

        {/* اطلاعات کاربری */}
        <Card
          sx={{
            mb: 4,
            backgroundColor: "#F9F8F5",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid #EDE9DE",
          }}
        >
          <CardHeader
            avatar={
              <Avatar
                sx={{
                  bgcolor: "#EDE9DE",
                  color: "#333",
                  width: 64,
                  height: 64,
                  fontSize: 28,
                  fontWeight: "bold",
                }}
              >
                {user.username?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
            }
            title={
              <Typography variant="h5" fontWeight="600" color="text.primary">
                اطلاعات کاربری
              </Typography>
            }
            action={
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{
                  borderColor: "#EDE9DE",
                  color: "#333",
                  "&:hover": {
                    borderColor: "#D4CFC2",
                    backgroundColor: "#F9F8F5",
                  },
                }}
              >
                ویرایش اطلاعات
              </Button>
            }
          />

          <Divider sx={{ borderColor: "#EDE9DE", mx: 3 }} />

          <CardContent sx={{ pt: 3 }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  نام کاربری
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {user.username}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  ایمیل
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {user.email}
                </Typography>
              </Box>

              {/* می‌توانید فیلدهای بیشتری اضافه کنید */}
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  تاریخ عضویت
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("fa-IR")
                    : "نامشخص"}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* لیست سفارشات */}
        <Card
          sx={{
            backgroundColor: "#F9F8F5",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid #EDE9DE",
          }}
        >
          <CardHeader
            title={
              <Typography variant="h5" fontWeight="600" color="text.primary">
                تاریخچه سفارشات
              </Typography>
            }
            subheader={
              <Typography variant="body2" color="text.secondary">
                تمام سفارشات شما در یک نگاه
              </Typography>
            }
          />

          <Divider sx={{ borderColor: "#EDE9DE", mx: 3 }} />

          <CardContent sx={{ pt: 3 }}>
            <OrdersList />

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mt: 3,
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              لیست سفارشات به زودی با جزئیات کامل نمایش داده خواهد شد.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
