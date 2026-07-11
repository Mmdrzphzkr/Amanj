"use client";

import { useState } from "react";
import JalaliDatePicker from "@/components/JalaliDatePicker";
import AuthHelper from "@/helpers/authHelper";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import MobileNav from "@/components/MobileNav/MobileNav";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Fade,
  Stack,
} from "@mui/material";

// تم مدرن هماهنگ با صفحه استعلام گارانتی
const theme = createTheme({
  palette: {
    primary: { main: "#EDE9DE" },
    secondary: { main: "#3A4D39" },
    accent: { main: "#7C9A92", light: "#A3C0B8" },
    background: { default: "#FFFFFF", paper: "#FFFFFF" },
    text: { primary: "#2A3D45", secondary: "#6A7D85" },
  },
  typography: {
    fontFamily: '"IRANSans", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
      fontSize: "1.5rem",
      "@media (max-width:600px)": { fontSize: "1.3rem" },
    },
    body1: { fontSize: "1rem" },
  },
  shape: { borderRadius: 20 },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "100%", // تضمین عرض 100%
          "& .MuiOutlinedInput-root": {
            borderRadius: 16,
            transition: "all 0.2s ease",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 40,
          padding: "10px 24px",
          fontWeight: 600,
          textTransform: "none",
          transition: "all 0.2s ease",
          "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 12px rgba(0,0,0,0.1)" },
        },
      },
    },
  },
});

function AddGuaranteeContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    deviceName: "",
    serialNumber: "",
    warrantyType: "",
    warrantyDuration: "",
    startDate: "",
    endDate: "",        // ✅ تاریخ پایان اضافه شد
    customerPhoneNumber: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      if (imageFile) {
        formData.append("deviceImage", imageFile);
      }

      const res = await fetch("/api/guarantees", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "خطا در ثبت گارانتی");
      }

      setSuccess("گارانتی با موفقیت ثبت شد ✅");
      setForm({
        deviceName: "",
        serialNumber: "",
        warrantyType: "",
        warrantyDuration: "",
        startDate: "",
        endDate: "",
        customerPhoneNumber: "",
      });
      setImageFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />

        {/* فضای اصلی با فاصله 70-80 پیکسل از بالا و پایین */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 2, sm: 3 },
            py: { xs: "70px", md: "80px" },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "560px", md: "680px" },
              bgcolor: "background.paper",
              borderRadius: { xs: "28px", md: "36px" },
              boxShadow: "0 20px 35px -12px rgba(0,0,0,0.08)",
              overflow: "hidden",
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.01)" },
            }}
          >
            <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  color: "secondary.main",
                  textAlign: "center",
                  mb: 1,
                  fontWeight: 700,
                }}
              >
                افزودن گارانتی جدید
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  textAlign: "center",
                  mb: 4,
                }}
              >
                اطلاعات دستگاه و گارانتی را وارد کنید
              </Typography>

              {(error || success) && (
                <Fade in timeout={400}>
                  <Box sx={{ mb: 3 }}>
                    {error && (
                      <Alert severity="error" sx={{ borderRadius: "16px", alignItems: "center" }}>
                        {error}
                      </Alert>
                    )}
                    {success && (
                      <Alert severity="success" sx={{ borderRadius: "16px", alignItems: "center" }}>
                        {success}
                      </Alert>
                    )}
                  </Box>
                </Fade>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                {/* استفاده از Stack عمودی به جای Grid برای چیدمان 100% عرض و زیر هم */}
                <Stack spacing={3}>
                  <TextField
                    label="نام دستگاه"
                    name="deviceName"
                    value={form.deviceName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="مثال: لپ‌تاپ ایسوس"
                    fullWidth
                  />

                  <TextField
                    label="شماره سریال"
                    name="serialNumber"
                    value={form.serialNumber}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="مثال: SN-123456789"
                    fullWidth
                  />

                  <TextField
                    select
                    label="نوع گارانتی"
                    name="warrantyType"
                    value={form.warrantyType}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    fullWidth
                  >
                    <MenuItem value="VIP">VIP</MenuItem>
                    <MenuItem value="Normal">Normal</MenuItem>
                  </TextField>

                  <TextField
                    type="number"
                    label="مدت گارانتی (ماه)"
                    name="warrantyDuration"
                    value={form.warrantyDuration}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    InputProps={{ inputProps: { min: 0 } }}
                    fullWidth
                  />

                  <Box>
                    <Typography sx={{ mb: 0.5, fontSize: "0.85rem", color: "text.secondary" }}>تاریخ شروع</Typography>
                    <JalaliDatePicker
                      value={form.startDate}
                      onChange={(v) => setForm({ ...form, startDate: v })}
                      disabled={loading}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ mb: 0.5, fontSize: "0.85rem", color: "text.secondary" }}>تاریخ پایان</Typography>
                    <JalaliDatePicker
                      value={form.endDate}
                      onChange={(v) => setForm({ ...form, endDate: v })}
                      disabled={loading}
                    />
                  </Box>

                  <TextField
                    label="شماره موبایل مشتری"
                    name="customerPhoneNumber"
                    value={form.customerPhoneNumber}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="مثال: 09123456789"
                    fullWidth
                  />

                  <Button
                    variant="outlined"
                    component="label"
                    disabled={loading}
                    sx={{
                      borderColor: "rgba(0,0,0,0.25)",
                      color: "text.primary",
                      fontWeight: 500,
                      borderRadius: "40px",
                      py: 1,
                      width: "100%", // عرض کامل
                      "&:hover": {
                        borderColor: "accent.main",
                        backgroundColor: "rgba(124,154,146,0.04)",
                      },
                    }}
                  >
                    📸 انتخاب تصویر دستگاه
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </Button>
                  {imageFile && (
                    <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                      فایل انتخاب شده: {imageFile.name}
                    </Typography>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      mt: 1,
                      color: "#fff",
                      background: "linear-gradient(135deg, #3A4D39 0%, #5B7A68 100%)",
                      width: "100%",
                      "&:hover": {
                        background: "linear-gradient(135deg, #2E3D2D 0%, #3A4D39 100%)",
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={26} color="inherit" /> : "ثبت گارانتی"}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Box>
        <MobileNav />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default function AddGuaranteePage() {
  return (
    <AuthHelper allowedRoles={["guarantor", "admin"]}>
      <AddGuaranteeContent />
    </AuthHelper>
  );
}