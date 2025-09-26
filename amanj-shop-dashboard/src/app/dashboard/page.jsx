// Filename: src/app/dashboard/page.jsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { Button, Typography, Container, CircularProgress } from "@mui/material";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  console.log("DashboardPage user:", user);
  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    // This message will briefly appear before the layout's server-side redirect kicks in.
    return <Typography>Not authorized. Redirecting...</Typography>;
  }

  return (
    <Container>
           {" "}
      <Typography variant="h4" sx={{ mt: 4 }}>
                به داشبورد مدیریت فروشگاه آمانج خوش آمدید      {" "}
      </Typography>
           {" "}
      <Typography sx={{ mt: 2 }}>سلام، {user?.username || "Admin"}!</Typography>
           {" "}
      <Button variant="contained" onClick={logout} sx={{ mt: 4 }}>
                خروج      {" "}
      </Button>
         {" "}
    </Container>
  );
}
