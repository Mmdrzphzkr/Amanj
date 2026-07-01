// src/app/guarantee/details/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthHelper from "@/helpers/authHelper";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Loading from "@/components/Loading/Loading";

// MUI Components
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Define custom theme with specified colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#EDE9DE", // Background/Accent color
    },
    secondary: {
      main: "#3A4D39", // Dark Green for text/buttons
    },
    accent: {
      main: "#7C9A92", // Muted Green for secondary elements
    },
     text: {
        primary: "#2A3D45", // Dark text for readability
        secondary: "#6A7D85", // Lighter text for subtitles/less important info
    }
  },
  typography: {
    fontFamily: '"IRANSans", "Arial", sans-serif', // Make sure IRANSans is available or use a fallback
  },
});

function GuaranteeDetailsContent() {
  const { id } = useParams(); // Get serial number or ID from URL
  const router = useRouter();
  const [guarantee, setGuarantee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchGuaranteeDetails = async () => {
    setLoading(true);
    setError("");
    setGuarantee(null);

    try {
      // Adjust the API endpoint and parameters based on how you fetch details
      // If you pass serial number:
      const res = await fetch(`/api/guarantees/search?serialNumber=${id}`, {
        // If you have a dedicated API for details, use that.
        // For now, re-using search but it's not ideal.
        // Consider a GET /api/guarantees/[id] or similar if possible.
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || `خطا در دریافت جزئیات (کد: ${res.status})`);
        setLoading(false);
        return;
      }

      if (data.data) {
        setGuarantee(data.data);
      } else {
        setError(data.message || "جزئیات گارانتی یافت نشد.");
      }
    } catch (err) {
      console.error("Details fetch error:", err);
      setError("خطای پیش‌بینی نشده‌ای رخ داده است.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGuaranteeDetails();
    }
  }, [id]); // Re-fetch if ID changes

  const handleGoBack = () => {
    router.push("/guarantee/search"); // Navigate back to the search page
  };

  // --- Device Image Handling ---
  // Strapi image structure example:
  // {
  //   "data": {
  //     "attributes": {
  //       "url": "/uploads/your_image.jpg",
  //       "name": "your_image.jpg",
  //       "formats": { "thumbnail": { "url": "/uploads/thumbnail_your_image.jpg" } }
  //     }
  //   }
  // }
  const getImageUrl = (strapiImageData) => {
    if (!strapiImageData?.data?.attributes) return null;
    // Prefer a medium/large format if available, otherwise use the main url
    const attributes = strapiImageData.data.attributes;
    const formats = attributes.formats;
    if (formats && formats.medium) return `${process.env.NEXT_PUBLIC_STRAPI_URL}${formats.medium.url}`;
    if (formats && formats.thumbnail) return `${process.env.NEXT_PUBLIC_STRAPI_URL}${formats.thumbnail.url}`;
    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${attributes.url}`;
  };

  const imageUrl = guarantee ? getImageUrl(guarantee.deviceImage) : null;

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Loading />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'primary.main', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box
          sx={{
            margin: { xs: 2, md: 4 },
            padding: { xs: 3, md: 5 },
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 4, width: '100%', maxWidth: '600px', borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          {guarantee && (
            <Card sx={{
              maxWidth: 700,
              width: '100%',
              borderRadius: '16px',
              boxShadow: 6,
              bgcolor: 'white',
              border: '1px solid',
              borderColor: 'accent.main',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
            }}>
              {imageUrl && (
                <CardMedia
                  component="img"
                  image={imageUrl}
                  alt={guarantee.deviceName || "دستگاه"}
                  sx={{
                    width: { xs: '100%', md: '40%' },
                    height: { xs: 250, md: 'auto' },
                    objectFit: 'cover',
                    borderRadius: { xs: '16px 16px 0 0', md: '16px 0 0 16px' },
                  }}
                />
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', md: '60%' } }}>
                <CardContent sx={{ flex: '1 0 auto', padding: 4 }}>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ color: 'secondary.main', fontWeight: 'bold', mb: 3 }}
                  >
                    جزئیات گارانتی
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ color: 'text.primary', mb: 1 }}>
                        <strong >دستگاه:</strong> {guarantee.deviceName || 'نامشخص'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ color: 'text.primary', mb: 1 }}>
                        <strong >شماره سریال:</strong> {guarantee.serialNumber || 'نامشخص'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ color: 'text.primary', mb: 1 }}>
                        <strong >نوع گارانتی:</strong> {guarantee.warrantyType || 'نامشخص'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ color: 'text.primary', mb: 1 }}>
                        <strong >مدت:</strong> {guarantee.warrantyDuration || 'نامشخص'} ماه
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ color: 'text.primary', mb: 1 }}>
                        <strong >تاریخ شروع:</strong> {guarantee.startDate ? new Date(guarantee.startDate).toLocaleDateString('fa-IR') : 'نامشخص'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ color: 'text.primary', mb: 1 }}>
                        <strong >تاریخ پایان:</strong> {guarantee.endDate ? new Date(guarantee.endDate).toLocaleDateString('fa-IR') : 'نامشخص'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ color: 'text.primary', mb: 1, fontWeight: 'bold' }}>
                        وضعیت:
                        <Chip
                          label={guarantee.isExpired ? "منقضی شده" : "فعال"}
                          color={guarantee.isExpired ? "secondary" : "success"}
                          variant="filled"
                          size="small"
                          sx={{ ml: 2, px: 2, py: 0.5, fontSize: '0.9rem', color: 'white' }}
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ color: 'text.primary', mb: 1, fontWeight: 'bold' }}>
                        روزهای باقی‌مانده:
                        <Chip
                          label={`${guarantee.remainingDays} روز`}
                          color={guarantee.remainingDays < 30 ? "secondary" : "primary"}
                          variant="outlined"
                          size="small"
                          sx={{ ml: 2, px: 2, py: 0.5, fontSize: '0.9rem' }}
                        />
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleGoBack}
                    sx={{
                      borderRadius: '8px',
                      py: 1,
                      px: 3,
                      boxShadow: 3,
                      '&:hover': {
                        bgcolor: 'accent.main',
                      },
                    }}
                  >
                    بازگشت به جستجو
                  </Button>
                </Box>
              </Box>
            </Card>
          )}
           {!guarantee && !loading && !error && (
             <Typography variant="h6" sx={{ color: 'text.secondary', mt: 5 }}>
                هیچ اطلاعاتی برای نمایش وجود ندارد.
            </Typography>
          )}
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

// Wrapper for authentication check
export default function GuaranteeDetailsPage() {
  // Adjust allowedRoles based on your actual Strapi roles
  return (
    <AuthHelper allowedRoles={["customer", "admin", "guarantor"]}>
      <GuaranteeDetailsContent />
    </AuthHelper>
  );
}
