// checkout/components/AddressStep.jsx
import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Radio,
  Box,
  Button,
  Avatar,
} from "@mui/material";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";

export default function AddressStep({
  addresses,
  selectedAddress,
  onSelect,
  onShowNewAddress, // optional
}) {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          انتخاب آدرس تحویل
        </Typography>
        {onShowNewAddress && (
          <Button
            startIcon={<AddLocationAltOutlinedIcon />}
            onClick={onShowNewAddress}
            sx={{
              textTransform: "none",
              bgcolor: "transparent",
              color: "#C5A35C",
              "&:hover": { bgcolor: "rgba(197,163,92,0.08)" },
            }}
          >
            آدرس جدید
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        {addresses.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
              <Typography variant="subtitle1" mb={1}>
                هنوز آدرسی ثبت نشده
              </Typography>
              <Typography variant="body2" color="text.secondary">
                برای ادامه لطفاً یک آدرس اضافه کنید.
              </Typography>
            </Paper>
          </Grid>
        )}

        {addresses.map((addr) => {
          const selected = selectedAddress?.id === addr.id;
          return (
            <Grid item xs={12} md={6} key={addr.id}>
              <Paper
                onClick={() => onSelect(addr)}
                elevation={selected ? 6 : 1}
                sx={{
                  p: 2.5,
                  cursor: "pointer",
                  borderRadius: 3,
                  transition: "transform .18s ease, box-shadow .18s ease",
                  transform: selected ? "translateY(-4px)" : "none",
                  boxShadow: selected
                    ? "0 8px 24px rgba(0,0,0,0.08)"
                    : undefined,
                  border: selected ? "2px solid #C5A35C" : "1px solid #eee",
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                }}
              >
                <Avatar sx={{ bgcolor: "#F5EBD8", color: "#C5A35C" }}>
                  {addr.title?.charAt(0) ?? "آ"}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <Typography fontWeight={700}>{addr.title}</Typography>
                    <Radio checked={selected} color="warning" />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {addr.province}، {addr.city}
                    <Box component="span" sx={{ display: "block", mt: 0.5 }}>
                      {addr.full_address}
                    </Box>
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    تلفن: {addr.phone}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
