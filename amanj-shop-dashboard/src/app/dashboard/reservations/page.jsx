"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";

export default function ReservationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      const isAdmin = user.role?.type === "admin";
      if (!isAdmin) {
        router.push("/login");
      }
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const isAdmin = user?.role?.type === "admin";
    if (user && isAdmin) {
      loadReservations();
    }
  }, [user]);

  const loadReservations = async () => {
    try {
      const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
      const res = await fetch(`${STRAPI}/api/technical-reservations?pagination[pageSize]=100&sort=createdAt:desc`);
      if (!res.ok) throw new Error("Failed to load reservations");
      const json = await res.json();
      const items = (json.data || []).map((d) => ({
        id: d.id,
        ...d,
      }));
      setReservations(items);
    } catch (err) {
      console.error("Error loading reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (reservation) => {
    setSelectedReservation(reservation);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReservation(null);
  };

  if (authLoading) {
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
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          درخواست‌های سرویس فنی
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/dashboard")}
          sx={{ bgcolor: "#696969", "&:hover": { bgcolor: "#B4B4B4" } }}
        >
          بازگشت به داشبورد
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : reservations.length === 0 ? (
        <Typography>درخواستی موجود نیست.</Typography>
      ) : (
        <>
          {/* Desktop / Tablet: show table on md+ */}
          <TableContainer component={Paper} sx={{ direction: "rtl", display: { xs: 'none', md: 'block' }, overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell align="right">نام</TableCell>
                  <TableCell align="right">نام خانوادگی</TableCell>
                  <TableCell align="right">موبایل</TableCell>
                  <TableCell align="right">تاریخ</TableCell>
                  <TableCell align="center">عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((res) => (
                  <TableRow key={res.id} hover>
                    <TableCell align="right" sx={{ fontSize: { xs: '0.85rem', md: '0.95rem' } }}>{res.name}</TableCell>
                    <TableCell align="right" sx={{ fontSize: { xs: '0.85rem', md: '0.95rem' } }}>{res.lastname}</TableCell>
                    <TableCell align="right" sx={{ fontSize: { xs: '0.85rem', md: '0.95rem' } }}>{res.phone}</TableCell>
                    <TableCell align="right" sx={{ fontSize: { xs: '0.85rem', md: '0.95rem' } }}>{new Date(res.createdAt).toLocaleDateString("fa-IR")}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenDialog(res)}
                        sx={{ bgcolor: "#696969", "&:hover": { bgcolor: "#B4B4B4" }, fontSize: { xs: '0.75rem', md: '0.85rem' } }}
                      >
                        جزئیات
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Mobile: show compact cards list */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            {reservations.map((res) => (
              <Paper key={res.id} sx={{ p: 2, mb: 2, borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{res.name} {res.lastname}</Typography>
                    <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>{res.phone}</Typography>
                  </Box>
                  <Button size="small" variant="contained" onClick={() => handleOpenDialog(res)} sx={{ bgcolor: '#696969', '&:hover': { bgcolor: '#B4B4B4' }, minWidth: 80 }}>
                    جزئیات
                  </Button>
                </Box>
                <Typography sx={{ color: 'gray', fontSize: '0.85rem' }}>{new Date(res.createdAt).toLocaleDateString('fa-IR')}</Typography>
              </Paper>
            ))}
          </Box>
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "right" }}>جزئیات درخواست</DialogTitle>
        <DialogContent sx={{ direction: "rtl" }}>
          {selectedReservation && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>نام:</strong> {selectedReservation.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>نام خانوادگی:</strong> {selectedReservation.lastname}
              </Typography>
              <Link  sx={{ mb: 1 }} href={`tel:${selectedReservation.phone}`}><strong>موبایل:</strong> {selectedReservation.phone}</Link>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>سرویس‌های انتخاب شده:</strong>
              </Typography>
              {Array.isArray(selectedReservation.services) && selectedReservation.services.length > 0 ? (
                <Box sx={{ ml: 2, mb: 2 }}>
                  {selectedReservation.services?.map((svc, idx) => (
                    <Typography key={idx} variant="body2">
                      • {typeof svc === 'object' ? svc.name : svc}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ ml: 2, mb: 2 }}>
                  هیچ سرویسی انتخاب نشده
                </Typography>
              )}
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>توضیحات:</strong>
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", ml: 2, mb: 2, p: 1, backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
                {selectedReservation.description}
              </Typography>
              <Typography variant="caption" sx={{ color: "gray" }}>
                <strong>تاریخ:</strong> {new Date(selectedReservation.createdAt).toLocaleString("fa-IR")}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained">
            بستن
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
