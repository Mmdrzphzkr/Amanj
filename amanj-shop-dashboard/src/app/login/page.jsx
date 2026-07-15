// src/app/login/page.jsx
"use client";

import { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { isSafeRedirect } from "@/lib/security";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import MobileNav from "@/components/MobileNav/MobileNav";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackurl") || "/";
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate redirect URL
    if (!isSafeRedirect(callbackUrl)) {
      setError("Invalid redirect URL");
      return;
    }

    setLoading(true);
    try {
      const strapiRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        }
      );

      const strapiData = await strapiRes.json();

      if (strapiData.jwt) {
        await auth.login(strapiData.jwt, strapiData.user, callbackUrl);
      } else {
        setError(strapiData.error?.message || "Login failed");
      }
    } catch (error) {
      console.error("An unexpected error occurred during login.", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push("/register?callbackurl=/checkout");
  };

  return (
    <>
      <Header />
      <Container component="main" maxWidth="xs" sx={{ my: 10 }}>
        <Paper
          elevation={3}
          sx={{
            mt: 8,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#EDE9DE",
          }}
        >
          <Typography component="h1" variant="h5">
            ورود به حساب کاربری
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="نام کاربری"
              name="email"
              autoComplete="email"
              autoFocus
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="bg-[#F9F8F5]"
              dir="ltr"
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="رمز عبور"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#F9F8F5]"
              dir="ltr"
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, background: "#868686" }}
              startIcon={
                loading ? <CircularProgress size={18} color="inherit" /> : null
              }
            >
              {loading ? "در حال ورود..." : "ورود"}
            </Button>
          </Box>

          <Button
            variant="outlined"
            onClick={handleRegister}
            disabled={loading}
            sx={{ color: "#3F3F3F", borderColor: "#3F3F3F" }}
          >
            ثبت نام
          </Button>
        </Paper>
      </Container>
      <MobileNav />
      <Footer />
    </>
  );
}
