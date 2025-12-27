// checkout/components/OrderSummary.jsx
import React from "react";
import { Paper, Typography, Divider, Box, Button } from "@mui/material";

export default function OrderSummary({
  total,
  shipping,
  onPlaceOrder,
  isPlacingOrder,
  isFormValid,
}) {
  const final = total + shipping;
  return (
    <Paper sx={{ p: 3, borderRadius: 3, position: "sticky", top: 120 }}>
      <Typography variant="h6" fontWeight={800} mb={1}>
        خلاصه سفارش
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography color="text.secondary">جمع محصولات</Typography>
        <Typography fontWeight={700}>{total.toLocaleString()}</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography color="text.secondary">هزینه ارسال</Typography>
        <Typography fontWeight={700}>{shipping.toLocaleString()}</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography fontWeight={800}>مبلغ نهایی</Typography>
        <Typography variant="h6" fontWeight={900} sx={{ color: "#C5A35C" }}>
          {final.toLocaleString()}
        </Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{
          bgcolor: "#C5A35C",
          color: "#fff",
          textTransform: "none",
          py: 1.5,
          borderRadius: 2,
          "&:hover": { bgcolor: "#b38f4a" },
        }}
        onClick={onPlaceOrder}
        disabled={!isFormValid || isPlacingOrder}
      >
        {isPlacingOrder ? "در حال ثبت..." : "ثبت نهایی و پرداخت"}
      </Button>
    </Paper>
  );
}
