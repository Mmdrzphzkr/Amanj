// src/app/register/page.jsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation"; // اضافه شد برای خواندن آدرس بازگشت
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
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
  const callbackUrl = searchParams.get("callbackUrl") || "/"; // اگر از جایی نیامده بود، برود صفحه اصلی

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("رمز عبور مطابقت ندارد");
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
        // لاگین خودکار و هدایت به آدرسی که از آن آمده بود (مثلاً /checkout)
        await auth.login(data.jwt, data.user, callbackUrl);
      } else {
        toast.error(data.error?.message || "خطا در ثبت‌نام");
      }
    } catch (error) {
      toast.error("خطای شبکه");
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
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="نام کاربری"
              margin="normal"
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              fullWidth
              label="ایمیل"
              type="email"
              margin="normal"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="رمز عبور"
              type="password"
              margin="normal"
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="تکرار رمز عبور"
              type="password"
              margin="normal"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ mt: 3, py: 1.5, background: "#3F3F3F" }}
            >
              {loading ? "در حال ثبت‌نام..." : "تایید و عضویت"}
            </Button>
          </form>
          <Typography variant="body2" textAlign="center" mt={2}>
            حساب دارید؟{" "}
            <Link
              href={`/login?callbackUrl=${callbackUrl}`}
              className="text-[#C5A35C] font-bold"
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
