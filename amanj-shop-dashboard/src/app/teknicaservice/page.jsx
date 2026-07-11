"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import MobileNav from "@/components/MobileNav/MobileNav";
import { fetchPublicGallery } from "@/redux/slices/publicGallerySlice";

export default function TechnicalServiceReservation() {
  const dispatch = useDispatch();
  const publicGallery = useSelector((s) => s.publicGallery.items || []);
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
  const [loadingServices, setLoadingServices] = useState(true);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    dispatch(fetchPublicGallery());
  }, [dispatch]);

  useEffect(() => {
    // fetch services from Strapi
    const STRAPI_URL =
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const load = async () => {
      setLoadingServices(true);
      try {
        const res = await fetch(
          `${STRAPI_URL}/api/services?pagination[pageSize]=100&sort=order:asc`,
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
      } finally {
        setLoadingServices(false);
      }
    };
    load();
  }, []);

  const getImageByFileName = useCallback(
    (fileName) => {
      // پیدا کردن آیتمی که نام فایل آن با fileName مطابقت داشته باشد
      const item = publicGallery.find((item) => {
        const imageName = item?.image?.name || "";
        // حذف پسوند و مقایسه
        const nameWithoutExt = imageName.replace(/\.[^.]+$/, "");
        return nameWithoutExt === fileName;
      });

      if (item?.image?.url) {
        return `${STRAPI_URL}${item.image.url}`;
      }

      // اگر عکسی پیدا نشد، یک placeholder برگردان
      return "";
    },
    [publicGallery, STRAPI_URL],
  );

  // Load logo image from Strapi public-gallery (look for item named 'teknicaservice')
  // const [logoUrl, setLogoUrl] = useState(null);
  useEffect(() => {
    const STRAPI_URL =
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const loadLogo = async () => {
      try {
        const res = await fetch(
          `${STRAPI_URL}/api/public-galleries?pagination[pageSize]=100`,
        );
        if (!res.ok) return;
        const json = await res.json();
        const items = json.data || [];
        for (const d of items) {
          const attrs = d || {};
          const name = (attrs.name || attrs.title || "")
            .toString()
            .toLowerCase();
          if (name === "teknicaservice") {
            const imgData = attrs.image?.data;
            let url = null;
            if (imgData) {
              const imgAttrs = imgData.attributes || {};
              url = imgAttrs.url || null;
              if (!url && imgAttrs.formats) {
                const f =
                  imgAttrs.formats.small ||
                  imgAttrs.formats.thumbnail ||
                  Object.values(imgAttrs.formats)[0];
                url = f?.url || null;
              }
            }
            // if (url) {
            //   setLogoUrl(url.startsWith("http") ? url : STRAPI_URL + url);
            //   return;
            // }
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
      const first = Object.values(nextErrors).find((v) => v);
      if (first) toast.error(first);
      return;
    }

    setSubmitting(true);
    try {
      // ۱. ثبت در استرپی
      const res = await fetch(
        process.env.NEXT_PUBLIC_STRAPI_URL + "/api/technical-reservations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: trimmed }),
        },
      );

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const message = errBody?.error?.message || "خطا در ارسال درخواست";
        toast.error(message);
        throw new Error(message);
      }

      // ۲. ارسال اس‌ام‌اس به مدیران با پترن
      const smsResponse = await fetch("/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmed.name,
          lastname: trimmed.lastname,
          phone: trimmed.phone,
          services: trimmed.services,
          description: trimmed.description,
        }),
      });

      const smsResult = await smsResponse.json();

      if (!smsResult.success) {
        console.warn("SMS warning:", smsResult.message);
      }

      // ۳. (اختیاری) ارسال پیام تایید به مشتری
      try {
        await fetch("/api/send-sms-customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmed.name,
            lastname: trimmed.lastname,
            phone: trimmed.phone,
          }),
        });
      } catch (customerSmsError) {
        console.warn(
          "Customer SMS failed but form submitted:",
          customerSmsError,
        );
      }

      toast.success(
        "درخواست شما با موفقیت ارسال شد. پیامک تایید برای شما ارسال گردید.",
      );
      setForm({
        name: "",
        lastname: "",
        phone: "",
        description: "",
        services: [],
      });
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

      <Container maxWidth="md" sx={{ mt: "90px", mb: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: "28px",
            background: "linear-gradient(145deg, #ffffff, #f9f9f9)",
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            backdropFilter: "blur(6px)",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
              mb: 4,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
              }}
            >
              <Box
                component="img"
                src={getImageByFileName("teknicaservice") || "/placeholder.jpg"}
                alt="teknicaservice"
                fetchPriority="high"
                sx={{
                  width: { xs: 120, sm: 220, md: 300 },
                  height: "auto",
                  borderRadius: "14px",
                  display: "block",
                }}
              />
            </Paper>

            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 800,
                textAlign: "center",
                color: "#fd4d00",
                letterSpacing: ".5px",
              }}
            >
              Teknica Service
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                textAlign: "center",
                maxWidth: 400,
              }}
            >
              ثبت آنلاین درخواست تعمیرات و خدمات — سریع و قابل پیگیری
            </Typography>

            <Link
              sx={{
                color: "#568f00",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all .3s",
                "&:hover": {
                  color: "#fd4d00",
                },
              }}
              href="tel:+989105739084"
            >
              شماره تماس: 09105739084
            </Link>

            <Box
              sx={{
                width: 80,
                height: 5,
                background: "linear-gradient(90deg, #fd4d00, #568f00)",
                borderRadius: 4,
                mt: 1.5,
              }}
            />
          </Box>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              mt: 1,
              "& .MuiTextField-root": {
                mb: 2,
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                transition: "all .3s",
                "&:hover fieldset": {
                  borderColor: "#fd4d00",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#fd4d00",
                  borderWidth: 2,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#fd4d00",
              },
            }}
          >
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={serviceOptions}
              getOptionLabel={(option) => option.name || ""}
              value={form.services || []}
              onChange={(event, newValue) =>
                setForm({ ...form, services: newValue })
              }
              loading={loadingServices}
              loadingText="در حال بارگذاری سرویس‌ها..."
              noOptionsText={loadingServices ? "..." : "سرویسی یافت نشد"}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    checked={selected}
                    size="small"
                    sx={{
                      mr: 1,
                      color: "#568f00",
                      "&.Mui-checked": {
                        color: "#fd4d00",
                      },
                    }}
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
                    sx={{
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #fd4d00, #568f00)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="انتخاب سرویس‌ها"
                  placeholder="سرویس‌ها را انتخاب کنید"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingServices ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            <Box
              sx={{
                display: "flex",
                gap: 2,
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
              sx={{ "& input": { textAlign: "right" } }}
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
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{
                  px: 5,
                  mt: 4,
                  py: 1.5,
                  borderRadius: "14px",
                  fontWeight: 700,
                  fontSize: "15px",
                  textTransform: "none",
                  background: "linear-gradient(135deg, #fd4d00, #568f00)",
                  boxShadow: "0 10px 25px rgba(253,77,0,.25)",
                  transition: "all .3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 15px 35px rgba(86,143,0,.3)",
                  },
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
      <MobileNav />
      <Footer />
    </>
  );
}
