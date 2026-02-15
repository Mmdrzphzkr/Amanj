"use client";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Link,
  Autocomplete,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { toast } from "react-hot-toast";

export default function TechnicalServiceReservation() {
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    phone: "",
    description: "",
    services: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    lastname: "",
    phone: "",
    description: "",
  });
  const [serviceOptions, setServiceOptions] = useState([]);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    // fetch services from Strapi
    const STRAPI =
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const load = async () => {
      try {
        const res = await fetch(
          `${STRAPI}/api/services?pagination[pageSize]=100&sort=order:asc`
        );
        if (!res.ok) return;
        const json = await res.json();
        // Strapi v5: json.data is array of { id, attributes }
        const items = (json.data || []).map((d) => ({
          id: d.id,
          name: d.name || "",
        }));
        setServiceOptions(items);
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    };
    load();
  }, []);

  // Load logo image from Strapi public-gallery (look for item named 'teknicaservice')
  const [logoUrl, setLogoUrl] = useState(null);
  useEffect(() => {
    const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const loadLogo = async () => {
      try {
        const res = await fetch(`${STRAPI}/api/public-galleries?pagination[pageSize]=100`);
        if (!res.ok) return;
        const json = await res.json();
        const items = json.data || [];
        for (const d of items) {
          const attrs = d || {};
          const name = (attrs.name || attrs.title || "").toString().toLowerCase();
          if (name === "teknicaservice") {
            const imgData = attrs.image?.data;
            let url = null;
            if (imgData) {
              const imgAttrs = imgData.attributes || {};
              url = imgAttrs.url || null;
              if (!url && imgAttrs.formats) {
                const f = imgAttrs.formats.small || imgAttrs.formats.thumbnail || Object.values(imgAttrs.formats)[0];
                url = f?.url || null;
              }
            }
            if (url) {
              setLogoUrl(url.startsWith("http") ? url : STRAPI + url);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Failed to load logo:", err);
      }
    };
    loadLogo();
  }, []);

  const validate = (values) => {
    const next = { name: "", lastname: "", phone: "", description: "" };
    const phoneRe = /^09\d{9}$/;

    if (!values.name || !values.name.trim()) next.name = "نام الزامی است";
    if (!values.lastname || !values.lastname.trim())
      next.lastname = "نام خانوادگی الزامی است";
    if (!values.phone || !values.phone.trim())
      next.phone = "شماره موبایل الزامی است";
    else if (!phoneRe.test(values.phone.trim()))
      next.phone = "شماره موبایل معتبر نیست (مثال: 09123456789)";
    if (!values.description || !values.description.trim())
      next.description = "توضیحات لازم است";

    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = {
      name: form.name.trim(),
      lastname: form.lastname.trim(),
      phone: form.phone.trim(),
      description: form.description.trim(),
      services: form.services,
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
      const res = await fetch(
        process.env.NEXT_PUBLIC_STRAPI_URL + "/api/technical-reservations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: trimmed }),
        }
      );
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const message =
          errBody?.error?.message ||
          "خطا در ارسال درخواست. لطفا دوباره تلاش کنید.";
        toast.error(message);
        throw new Error(message);
      }

      toast.success("درخواست شما با موفقیت ارسال شد. متشکریم.");
      setForm({ name: "", lastname: "", phone: "", description: "" });
      setErrors({ name: "", lastname: "", phone: "", description: "" });
    } catch (err) {
      console.error(err);
      if (!err.message)
        toast.error("خطا در ارسال درخواست. لطفا دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: "70px", mb: 6 }}>
        <Paper
          elevation={3}
          sx={{ p: { xs: 3, sm: 4 }, backgroundColor: "#EDE9DE" }}
        >
          {/* Styled header: logo in elevated Paper, bold title, subtitle and divider */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              mb: 3,
            }}
          >
            <Paper
              elevation={6}
              sx={{
                p: 1.25,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.paper",
              }}
            >
              <Box
                component="img"
                src={logoUrl || "/uploads/teknicaservice.jpg"}
                alt="teknicaservice"
                fetchPriority="high"
                sx={{
                  width: { xs: 110, sm: 210, md: 300 },
                  height: "auto",
                  borderRadius: 1,
                  display: "block",
                }}
              />
            </Paper>

            <Typography
              variant="h6"
              component="h1"
              sx={{ fontWeight: 700, textAlign: "center" }}
            >
              Teknica Service
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", textAlign: "center" }}
            >
              ثبت آنلاین درخواست تعمیرات و خدمات — سریع و قابل پیگیری
            </Typography>

            <Link  sx={{ color: "text.secondary", textAlign: "center" }} href="tel:+989105739084">شماره تماس: 09105739084</Link>

            <Box
              sx={{
                width: 64,
                height: 4,
                bgcolor: "#696969",
                borderRadius: 2,
                mt: 1,
              }}
            />
          </Box>


          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {/* Services multi-select (multiple choices) - switched to Autocomplete to show chips with delete and checkboxes in the list */}
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={serviceOptions}
              getOptionLabel={(option) => option.name || ""}
              value={form.services || []}
              onChange={(event, newValue) => setForm({ ...form, services: newValue })}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    checked={selected}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <ListItemText primary={option.name} />
                </li>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    key={option.id}
                    size="small"
                    color="primary"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="انتخاب سرویس‌ها"
                  placeholder="سرویس‌ها را انتخاب کنید"
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
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
              sx={{ mb: 2, "& input": { textAlign: "right" } }}
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

            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth={false}
                disabled={submitting}
                sx={{
                  px: 3,
                  mt: 3,
                  py: 1.2,
                  bgcolor: "#696969",
                  "&:hover": { bgcolor: "#B4B4B4" },
                  transition: "all 0.3s",
                }}
              >
                {submitting ? (
                  <CircularProgress size={22} sx={{ color: "white" }} />
                ) : (
                  "ارسال درخواست"
                )}
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
