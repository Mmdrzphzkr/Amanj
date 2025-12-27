// checkout/components/PaymentStep.jsx
import React from "react";
import { Grid, Paper, Typography, Box, TextField, Button } from "@mui/material";

export default function PaymentStep({
  paymentMethod,
  setPaymentMethod,
  paymentSettings = [],
  receiptData,
  setReceiptData,
}) {
  const account = paymentSettings?.[0] ?? {};

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        انتخاب روش پرداخت
      </Typography>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper
            onClick={() => setPaymentMethod("online")}
            sx={{
              p: 2.5,
              cursor: "pointer",
              border:
                paymentMethod === "online"
                  ? "2px solid #C5A35C"
                  : "1px solid #eee",
            }}
          >
            <Typography fontWeight={700}>پرداخت آنلاین</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              انتقال به درگاه بانکی
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            onClick={() => setPaymentMethod("receipt")}
            sx={{
              p: 2.5,
              cursor: "pointer",
              border:
                paymentMethod === "receipt"
                  ? "2px solid #C5A35C"
                  : "1px solid #eee",
            }}
          >
            <Typography fontWeight={700}>کارت به کارت</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              پرداخت از طریق کارت به کارت و ثبت اطلاعات
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* فرم کارت به کارت */}
      {paymentMethod === "receipt" && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography fontWeight={700} mb={2}>
            اطلاعات واریز
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={2}>
            لطفاً پس از واریز، اطلاعات زیر را وارد کنید
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>شماره کارت:</strong> {account.card_number ?? "—"}
            </Typography>
            <Typography variant="body2">
              <strong>به نام:</strong> {account.card_holder_name ?? "—"}
            </Typography>
            <Typography variant="body2">
              <strong>بانک:</strong> {account.bank_name ?? "—"}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="مبلغ واریزی"
                fullWidth
                value={receiptData.amount}
                onChange={(e) =>
                  setReceiptData((p) => ({
                    ...p,
                    amount: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="شماره پیگیری"
                fullWidth
                value={receiptData.trackingCode}
                onChange={(e) =>
                  setReceiptData((p) => ({
                    ...p,
                    trackingCode: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                type="date"
                label="تاریخ واریز"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={receiptData.date}
                onChange={(e) =>
                  setReceiptData((p) => ({
                    ...p,
                    date: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                آپلود تصویر فیش (اختیاری)
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    setReceiptData((p) => ({
                      ...p,
                      image: e.target.files?.[0] ?? null,
                    }))
                  }
                />
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}
