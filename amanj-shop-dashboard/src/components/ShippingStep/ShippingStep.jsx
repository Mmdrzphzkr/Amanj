// checkout/components/ShippingStep.jsx
import React from "react";
import { Grid, Paper, Typography, Box, Chip } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

export default function ShippingStep({
  shippingMethods,
  selectedShipping,
  onSelect,
  city,
}) {
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          انتخاب روش ارسال
        </Typography>
        <Typography variant="body2" color="text.secondary">
          بر اساس شهر شما هزینه نمایش داده شده است.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {shippingMethods.map((method) => {
          const cost = method.cityCosts?.[city] ?? method.baseCost ?? 0;
          const selected = selectedShipping?.id === method.id;
          const free = cost === 0;

          return (
            <Grid item xs={12} sm={6} key={method.id}>
              <Paper
                onClick={() => onSelect(method)}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  p: 2.5,
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "transform .14s ease, box-shadow .14s ease",
                  transform: selected ? "translateY(-4px)" : "none",
                  boxShadow: selected
                    ? "0 10px 30px rgba(0,0,0,0.06)"
                    : undefined,
                  border: selected ? "2px solid #C5A35C" : "1px solid #eee",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#FFF7EC",
                    borderRadius: 2,
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 56,
                    height: 56,
                  }}
                >
                  <LocalShippingOutlinedIcon
                    sx={{ fontSize: 28, color: "#C5A35C" }}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography fontWeight={700}>{method.title}</Typography>
                    {method.recommended && (
                      <Chip label="پیشنهادی" size="small" color="warning" />
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    زمان تحویل: {method.eta ?? "–"}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  <Typography fontWeight={700} sx={{ color: "#C5A35C" }}>
                    {free ? "رایگان" : cost.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    شامل مالیات
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
