// src/app/guarantee/search/page.jsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import MobileNav from "@/components/MobileNav/MobileNav";

// MUI Components
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Fade,
  Stack,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// تم مدرن با حفظ رنگ‌های قبلی و بهینه‌سازی برای موبایل
const theme = createTheme({
  palette: {
    primary: {
      main: "#EDE9DE", // پس‌زمینه اصلی
    },
    secondary: {
      main: "#3A4D39", // سبز تیره برای متن‌های برجسته و دکمه
    },
    accent: {
      main: "#7C9A92", // سبز مات برای جزئیات
      light: "#A3C0B8",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2A3D45",
      secondary: "#6A7D85",
    },
  },
  typography: {
    fontFamily: '"IRANSans", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: "1.75rem",
      "@media (max-width:600px)": {
        fontSize: "1.5rem",
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.35rem",
      "@media (max-width:600px)": {
        fontSize: "1.2rem",
      },
    },
    body1: {
      fontSize: "1rem",
      "@media (max-width:600px)": {
        fontSize: "0.9rem",
      },
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 16,
            transition: "all 0.2s ease",
            "& fieldset": {
              borderColor: "#C7C7C7", // حاشیه خاکستری در حالت عادی
            },
            "&:hover fieldset": {
              borderColor: "#1976d2", // آبی در حالت هاور
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1976d2", // آبی استاندارد در حالت فوکوس
              borderWidth: 2,
            },
          }, '& .MuiInputLabel-root': {
            color: '#666666', // رنگ لیبل در حالت عادی
            '&.Mui-focused': {
              color: '#1976d2', // رنگ لیبل هنگام فوکوس (آبی)
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 40,
          padding: "12px 24px",
          fontWeight: 600,
          fontSize: "1rem",
          textTransform: "none",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
          },
        },
      },
    },
  },
});

function GuaranteeSearchContent() {
  const [serialNumber, setSerialNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    if (!serialNumber.trim() || !phone.trim()) {
      setError("لطفاً شماره سریال و شماره موبایل را وارد کنید.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/guarantees/search?serialNumber=${encodeURIComponent(
          serialNumber
        )}&phone=${encodeURIComponent(phone)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || `خطا در جستجو (کد: ${res.status})`);
        return;
      }

      if (data.data) {
        setResult(data.data);
      } else {
        setError(data.message || "گارانتی یافت نشد.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("خطای پیش‌بینی نشده‌ای رخ داده است.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          // bgcolor: "primary.main",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />

        {/* محتوای اصلی با فاصله 70-80 پیکسل از بالا و پایین */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 2, sm: 3 },
            py: { xs: "70px", md: "80px" }, // ✅ فاصله عمودی خواسته شده
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "540px", md: "620px" },
              bgcolor: "background.paper",
              borderRadius: { xs: "28px", md: "36px" },
              boxShadow: "0 20px 35px -12px rgba(0,0,0,0.08)",
              overflow: "hidden",
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.01)",
              },
            }}
          >
            <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  color: "secondary.main",
                  textAlign: "center",
                  mb: 1,
                }}
              >
                استعلام وضعیت گارانتی
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  textAlign: "center",
                  mb: 4,
                }}
              >
                با وارد کردن شماره سریال و شماره موبایل از وضعیت گارانتی خود مطلع شوید
              </Typography>

              <Box component="form" onSubmit={handleSearch}>
                <Stack spacing={3}>
                  <TextField
                    label="شماره سریال دستگاه"
                    variant="outlined"
                    fullWidth
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="مثال: SN-123456789"

                  />
                  <TextField
                    label="شماره موبایل"
                    variant="outlined"
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: 09123456789"

                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    disabled={loading}
                    sx={{
                      mt: 1,
                      background: "linear-gradient(135deg, #3A4D39 0%, #5B7A68 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #2E3D2D 0%, #3A4D39 100%)",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={26} color="inherit" />
                    ) : (
                      "جستجو"
                    )}
                  </Button>
                </Stack>
              </Box>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mt: 4,
                    borderRadius: "16px",
                    alignItems: "center",
                  }}
                >
                  {error}
                </Alert>
              )}

              <Fade in={!!result && !loading} timeout={500}>
                <Box>
                  {result && !loading && (
                    <Box
                      sx={{
                        mt: 5,
                        p: 3,
                        bgcolor: "#F9F9F7",
                        borderRadius: "24px",
                        border: "1px solid",
                        borderColor: "accent.light",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          color: "secondary.main",
                          mb: 3,
                          pb: 1,
                          borderBottom: "2px solid",
                          borderColor: "accent.light",
                        }}
                      >
                        نتیجه استعلام
                      </Typography>
                      <Stack spacing={2}>
                        <InfoRow label="نام دستگاه" value={result.deviceName || "نامشخص"} />
                        <InfoRow label="شماره سریال" value={result.serialNumber || "نامشخص"} />
                        <InfoRow label="نوع گارانتی" value={result.warrantyType || "نامشخص"} />
                        <InfoRow
                          label="مدت گارانتی"
                          value={result.warrantyDuration ? `${result.warrantyDuration} ماه` : "نامشخص"}
                        />
                        <InfoRow
                          label="تاریخ شروع"
                          value={
                            result.startDate
                              ? new Date(result.startDate).toLocaleDateString("fa-IR")
                              : "نامشخص"
                          }
                        />
                        <InfoRow
                          label="تاریخ پایان"
                          value={
                            result.endDate
                              ? new Date(result.endDate).toLocaleDateString("fa-IR")
                              : "نامشخص"
                          }
                        />
                        <InfoRow
                          label="وضعیت"
                          value={result.isExpired ? "منقضی شده" : "فعال"}
                          valueColor={result.isExpired ? "#B33A3A" : "#4CAF50"}
                          isBold
                        />
                        <InfoRow
                          label="روزهای باقی‌مانده"
                          value={result.remainingDays ? `${result.remainingDays} روز` : "نامشخص"}
                          valueColor={result.remainingDays < 30 ? "#E67E22" : "inherit"}
                          isBold
                        />
                      </Stack>
                    </Box>
                  )}
                </Box>
              </Fade>
            </Box>
          </Paper>
        </Box>

        <MobileNav />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

// کامپوننت کوچک برای نمایش یک ردیف اطلاعات (برای تمیزی کد)
function InfoRow({ label, value, valueColor = "text.primary", isBold = false }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1,
        borderBottom: "1px dashed #E0E0E0",
        pb: 1,
      }}
    >
      <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 500 }}>
        {label}:
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: valueColor,
          fontWeight: isBold ? 700 : 500,
          textAlign: "left",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

// سنجش نقش‌های مجاز (مطابق نیاز شما)
export default function GuaranteeSearchPage() {
  return (
    <GuaranteeSearchContent />
  );
}