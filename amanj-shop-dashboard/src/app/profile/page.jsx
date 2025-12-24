"use client";

import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import Link from "next/link";

// MUI Components - تمام قطعات مورد نیاز از اینجا فراخوانی شده‌اند
import {
  Box,
  Typography,
  Button,
  Divider,
  Avatar,
  Stack,
  Container,
  Paper,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";

// MUI Icons
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import EditIcon from "@mui/icons-material/Edit";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ShoppingBagOutlineIcon from "@mui/icons-material/ShoppingBagOutlined";

// Project Components
import MobileNav from "@/components/MobileNav/MobileNav";
import Footer from "@/components/Footer/Footer";
import Loading from "@/components/Loading/Loading";
import OrdersList from "@/components/orderList/OrderList";
import Header from "@/components/Header/Header";

export default function ProfilePage() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) return <Loading />;

  if (!isAuthenticated) {
    redirect("/login?callbackUrl=/profile");
  }

  // پالت رنگی استخراج شده از تصویر برند آمانج
  const colors = {
    bg: "#F9F8F5",
    accent: "#EDE9DE",
    textMain: "#3F3F3F",
    gold: "#C5A35C",
    white: "#FFFFFF",
  };

  return (
    <>
      <Box sx={{ bgcolor: colors.bg, minHeight: "100vh" }}>
        <Header />

        <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 18 }, pb: 8 }}>
          {/* بخش خوش‌آمدگویی و دکمه خروج */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 6 }}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: colors.accent,
                  color: colors.textMain,
                  width: { xs: 70, md: 90 },
                  height: { xs: 70, md: 90 },
                  fontSize: 36,
                  fontWeight: "800",
                  border: `3px solid ${colors.white}`,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                }}
              >
                {user.username?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="900"
                  sx={{ color: colors.textMain, mb: 0.5 }}
                >
                  سلام، {user.username}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  خوش آمدید. در اینجا می‌توانید سفارشات و اطلاعات خود را مدیریت
                  کنید.
                </Typography>
              </Box>
            </Stack>

            {/* استفاده از دکمه MUI با استایل برند آمانج */}
            <Button
              variant="contained"
              onClick={logout}
              startIcon={<ExitToAppIcon />}
              sx={{
                bgcolor: "#000", // دکمه مشکی مشابه عکس هدر
                color: "#fff",
                borderRadius: "50px", // لبه‌های کاملاً گرد مشابه دکمه‌های تصویر
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: colors.textMain,
                  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                },
              }}
            >
              خروج از حساب
            </Button>
          </Stack>

          <Grid container spacing={4}>
            {/* ستون راست: اطلاعات کاربری */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: "28px",
                  border: `1px solid ${colors.accent}`,
                  bgcolor: colors.white,
                  position: "relative",
                  transition: "0.3s",
                  "&:hover": { boxShadow: "0 15px 35px rgba(0,0,0,0.03)" },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 4 }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="800"
                    sx={{ color: colors.textMain }}
                  >
                    اطلاعات کاربری
                  </Typography>
                  <Tooltip title="ویرایش پروفایل">
                    <IconButton
                      sx={{
                        bgcolor: colors.bg,
                        "&:hover": { bgcolor: colors.accent },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Stack spacing={4}>
                  <InfoRow
                    icon={<PersonOutlineIcon sx={{ color: colors.gold }} />}
                    label="نام کاربری"
                    value={user.username}
                    colors={colors}
                  />
                  <Divider sx={{ borderStyle: "dashed", opacity: 0.6 }} />
                  <InfoRow
                    icon={<MailOutlineIcon sx={{ color: colors.gold }} />}
                    label="پست الکترونیک"
                    value={user.email}
                    colors={colors}
                  />
                  <Divider sx={{ borderStyle: "dashed", opacity: 0.6 }} />
                  <InfoRow
                    icon={<CalendarMonthIcon sx={{ color: colors.gold }} />}
                    label="عضویت از تاریخ"
                    value={
                      user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("fa-IR")
                        : "---"
                    }
                    colors={colors}
                  />
                </Stack>
              </Paper>
            </Grid>

            {/* ستون چپ: لیست سفارشات */}
            <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: "28px",
                  border: `1px solid ${colors.accent}`,
                  bgcolor: colors.white,
                  minHeight: "500px",
                  transition: "0.3s",
                  "&:hover": { boxShadow: "0 15px 35px rgba(0,0,0,0.03)" },
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 4 }}
                >
                  <ShoppingBagOutlineIcon sx={{ color: colors.textMain }} />
                  <Typography
                    variant="h6"
                    fontWeight="800"
                    sx={{ color: colors.textMain }}
                  >
                    تاریخچه سفارشات
                  </Typography>
                </Stack>

                <OrdersList />

                {/* باکس راهنمای پایین لیست */}
                <Box
                  sx={{
                    mt: 6,
                    p: 3,
                    bgcolor: colors.bg,
                    borderRadius: "20px",
                    border: `1px dashed ${colors.gold}`,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic", lineHeight: 1.8 }}
                  >
                    کاربر گرامی، در این بخش می‌توانید جزئیات سفارشات اخیر و
                    وضعیت ارسال آن‌ها را به صورت لحظه‌ای دنبال کنید.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <MobileNav />
      </Box>
      <Footer />
    </>
  );
}

// کامپوننت کمکی برای نمایش ردیف‌های اطلاعات با استایل MUI
function InfoRow({ icon, label, value, colors }) {
  return (
    <Stack direction="row" spacing={2.5} alignItems="center">
      <Box
        sx={{
          width: 48,
          height: 48,
          bgcolor: colors.bg,
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: "text.disabled",
            display: "block",
            mb: 0.5,
            fontWeight: "bold",
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body1"
          fontWeight="700"
          sx={{ color: colors.textMain }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}
