"use client";
import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Container, Box, TextField, Button, Typography, Paper, CircularProgress } from "@mui/material";
import { toast } from "react-hot-toast";

export default function TechnicalServiceReservation() {
  const [form, setForm] = useState({ name: "", lastname: "", phone: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({ name: "", lastname: "", phone: "", description: "" });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = (values) => {
    const next = { name: "", lastname: "", phone: "", description: "" };
    const phoneRe = /^09\d{9}$/;

    if (!values.name || !values.name.trim()) next.name = "نام الزامی است";
    if (!values.lastname || !values.lastname.trim()) next.lastname = "نام خانوادگی الزامی است";
    if (!values.phone || !values.phone.trim()) next.phone = "شماره موبایل الزامی است";
    else if (!phoneRe.test(values.phone.trim())) next.phone = "شماره موبایل معتبر نیست (مثال: 09123456789)";
    if (!values.description || !values.description.trim()) next.description = "توضیحات لازم است";

    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = {
      name: form.name.trim(),
      lastname: form.lastname.trim(),
      phone: form.phone.trim(),
      description: form.description.trim(),
    };

    const nextErrors = validate(trimmed);
    const hasError = Object.values(nextErrors).some((v) => v);
    setErrors(nextErrors);
    if (hasError) {
      // Show first error as toast as well
      const first = Object.values(nextErrors).find((v) => v);
      if (first) toast.error(first);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_STRAPI_URL + "/api/technical-reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: trimmed }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const message = errBody?.error?.message || "خطا در ارسال درخواست. لطفا دوباره تلاش کنید.";
        toast.error(message);
        throw new Error(message);
      }

      toast.success("درخواست شما با موفقیت ارسال شد. متشکریم.");
      setForm({ name: "", lastname: "", phone: "", description: "" });
      setErrors({ name: "", lastname: "", phone: "", description: "" });
    } catch (err) {
      console.error(err);
      if (!err.message) toast.error("خطا در ارسال درخواست. لطفا دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: "70px", mb: 6 }}>
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, backgroundColor: "#EDE9DE" }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: "center", mb: 2 }}>
            ثبت درخواست خدمات فنی
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <TextField
                required
                name="name"
                label="نام"
                value={form.name}
                onChange={handleChange}
                fullWidth
                disabled={submitting}
              />
              <TextField
                required
                name="lastname"
                label="نام خانوادگی"
                value={form.lastname}
                onChange={handleChange}
                fullWidth
                disabled={submitting}
              />
            </Box>

            <TextField
              required
              name="phone"
              label="شماره موبایل"
              value={form.phone}
              onChange={handleChange}
              fullWidth
              disabled={submitting}
              inputProps={{ maxLength: 11 }}
              sx={{ mb: 2, '& input': { textAlign: 'right' } }}
            />

            <TextField
              name="description"
              label="توضیحات (مشکل یا سرویس مورد نیاز)"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={4}
              disabled={submitting}
            />

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'flex-start', flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth={false}
                disabled={submitting}
                sx={{
                  px: 3,
                  mt: 3,
                  py: 1.2,
                  bgcolor: '#696969',
                  '&:hover': { bgcolor: '#B4B4B4' },
                  transition: 'all 0.3s',
                }}
              >
                {submitting ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'ارسال درخواست'}
              </Button>
              <Box sx={{ flex: 1 }} />
            </Box>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
}
