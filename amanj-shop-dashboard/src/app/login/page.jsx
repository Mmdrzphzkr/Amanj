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
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Get token from Strapi
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
        await auth.login(strapiData.jwt, strapiData.user);
      } else {
        alert(`Error: ${strapiData.error.message}`);
      }
    } catch (error) {
      console.error("An unexpected error occurred during login.", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
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
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, background: "#868686" }}
          >
            ورود
          </Button>
        </Box>
        <Button
          variant="outlined"
          onClick={() => router.push("/register?callbackUrl=/checkout")}
          sx={{ color: "#3F3F3F", borderColor: "#3F3F3F" }}
        >
          ثبت نام
        </Button>
      </Paper>
    </Container>
  );
}
