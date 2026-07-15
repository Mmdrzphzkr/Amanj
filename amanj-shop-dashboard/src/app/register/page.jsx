// src/app/register/page.jsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { isSafeRedirect } from "@/lib/security";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress, // اضافه شد
} from "@mui/material";
import MobileNav from "@/components/MobileNav/MobileNav";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackurl") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate redirect URL
    if (!isSafeRedirect(callbackUrl)) {
      toast.error("Invalid redirect URL");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("رمز عبور مطابقت ندارد");
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      toast.error("رمز عبور باید حداقل 8 کاراکتر باشد");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("ثبت‌نام موفق! در حال انتقال...");
        await auth.login(data.jwt, data.user, callbackUrl);
      } else {
        // اگر خطای مشخصی از Strapi دریافت شد
        const errorMessage = data.error?.message || "خطا در ثبت‌نام";
        toast.error(errorMessage);
      }
    } catch (error) {
      // خطاهای شبکه یا خطاهای غیرمنتظره
      console.error("Registration error:", error);
      toast.error("خطای شبکه یا خطای غیرمنتظره");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="xs" sx={{ my: 10 }}>
        <Paper sx={{ p: 4, borderRadius: "20px", background: "#EDE9DE" }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
            ثبت‌نام در آمانج
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
            <TextField
              fullWidth
              label="نام کاربری"
              margin="normal"
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading} // غیرفعال کردن فیلدها در زمان لودینگ
              dir="ltr" // برای ورودی‌های انگلیسی مثل نام کاربری
            />
            <TextField
              fullWidth
              label="ایمیل"
              type="email"
              margin="normal"
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              dir="ltr"
            />
            <TextField
              fullWidth
              label="رمز عبور"
              type="password"
              margin="normal"
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              dir="ltr"
            />
            <TextField
              fullWidth
              label="تکرار رمز عبور"
              type="password"
              margin="normal"
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              dir="ltr"
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ mt: 3, py: 1.5, background: "#3F3F3F" }}
              startIcon={
                loading ? <CircularProgress size={18} color="inherit" /> : null
              }
            >
              {loading ? "در حال ثبت‌نام..." : "تایید و عضویت"}
            </Button>
          </Box>
          <Typography variant="body2" textAlign="center" mt={2}>
            حساب دارید؟{" "}
            <Link
              href={`/login?callbackurl=${callbackUrl}`}
              // className="text-[#C5A35C] font-bold" // این کلاس CSS را می توان به صورت inline style یا در sx button اضافه کرد
              style={{ color: "#C5A35C", fontWeight: "bold" }}
            >
              وارد شوید
            </Link>
          </Typography>
        </Paper>
        <MobileNav />
      </Container>
      <Footer />
    </>
  );
}
