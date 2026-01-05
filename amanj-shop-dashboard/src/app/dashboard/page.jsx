"use client";

import { useAuth } from "@/context/AuthContext";
import { Button, Typography, Container, CircularProgress, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  console.log(user);
  useEffect(() => {
    if (!loading && user) {
      const isAdmin = user.role?.type === "admin";
      if (!isAdmin) {
        router.push("/login");
      }
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  const isAdmin = user?.role?.type === "admin";
  if (!user || !isAdmin) {
    return <Typography>دسترسی غیرمجاز.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>
        به داشبورد مدیریت فروشگاه آمانج خوش آمدید
      </Typography>
      <Typography sx={{ mt: 2 }}>سلام، {user?.username || "Admin"}!</Typography>
      
      <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button 
          variant="contained" 
          onClick={() => router.push("/dashboard/reservations")}
          sx={{ bgcolor: "#696969", "&:hover": { bgcolor: "#B4B4B4" } }}
        >
          مشاهده درخواست‌های سرویس
        </Button>
        <Button variant="contained" onClick={logout}>
          خروج
        </Button>
      </Box>
    </Container>
  );
}
