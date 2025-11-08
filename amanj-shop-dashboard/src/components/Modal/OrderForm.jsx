// OrderForm.jsx (نسخه نهایی با react-hot-toast)
import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  // Alert ها دیگر استفاده نمی‌شوند
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { submitOrder } from "@/redux/slices/orderSlice";
// ✅ ۱. ایمپورت کردن 'toast'
import { toast } from "react-hot-toast";

const OrderForm = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.order || { status: "idle" });
  // 'error' دیگر برای نمایش Alert لازم نیست، اما برای catch خوب است
  // const error = useSelector((state) => state.order?.error);

  const [formData, setFormData] = useState({
    name: "",
    family: "",
    mobile: "",
    quantity: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      submitOrder({
        data: {
          name: formData.name,
          family: formData.family,
          quantity: formData.quantity,
          mobile: formData.mobile,
          description: formData.description,
          productId: product.id,
        },
      })
    )
      .unwrap()
      .then((successPayload) => {
        // ✅ ۲. نمایش توست موفقیت
        toast.success(
          "سفارش شما با موفقیت ثبت شد! به زودی با شما تماس می‌گیریم."
        );

        // بستن مودال پس از ۲ ثانیه
        setTimeout(onClose, 2000);
      })
      .catch((errorPayload) => {
        // ✅ ۳. نمایش توست خطا
        // ما پیام خطا را مستقیماً از 'errorPayload' که unwrap برمی‌گرداند می‌گیریم
        const message =
          errorPayload?.message || "خطا در ثبت سفارش. لطفاً مجددا تلاش کنید.";
        toast.error(message);

        console.error("Order submission failed:", errorPayload);
      });
  };

  const inputStyle = {
    "& label": { right: "1.25rem", left: "unset", transformOrigin: "right" },
    "& legend": { textAlign: "right" },
    "& input": { textAlign: "right" },
    "& textarea": { textAlign: "right" },
  };

  const isLoading = status === "loading";
  const isSucceeded = status === "succeeded";

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        padding: "30px",
      }}
    >
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{ color: "#333", mb: 3 }}
      >
        ثبت درخواست پیش‌سفارش
      </Typography>

      {/* ✅ ۴. کامپوننت‌های Alert از اینجا حذف شدند */}

      {/* ... (فیلدهای فرم: نام، نام خانوادگی، موبایل، تعداد، توضیحات) ... */}
      <TextField
        required
        name="name"
        label="نام"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled={isLoading || isSucceeded}
        sx={inputStyle}
      />
      <TextField
        required
        name="family"
        label="نام خانوادگی"
        value={formData.family}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled={isLoading || isSucceeded}
        sx={inputStyle}
      />
      <TextField
        required
        name="mobile"
        label="شماره موبایل"
        value={formData.mobile}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="tel"
        inputProps={{ maxLength: 11 }}
        disabled={isLoading || isSucceeded}
        sx={inputStyle}
      />
      <TextField
        required
        name="quantity"
        label="تعداد"
        value={formData.quantity}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
        disabled={isLoading || isSucceeded}
        sx={inputStyle}
      />
      <TextField
        name="description"
        label="توضیحات بیشتر (اختیاری)"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={3}
        fullWidth
        margin="normal"
        disabled={isLoading || isSucceeded}
        sx={inputStyle}
      />

      {/* دکمه ثبت سفارش */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isLoading || isSucceeded}
        sx={{
          mt: 3,
          py: 1.5,
          bgcolor: "#696969",
          "&:hover": { bgcolor: "#B4B4B4" },
          transition: "all 0.3s",
          fontSize: "1rem",
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "تایید و ثبت سفارش"
        )}
      </Button>

      {/* ... (بخش اطلاعات تماس) ... */}
      {!isLoading && !isSucceeded && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            یا با شماره{" "}
            <a
              href="tel:09111111111"
              style={{ color: "#696969", fontWeight: "bold" }}
            >
              09111111111
            </a>{" "}
            تماس بگیرید.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default OrderForm;
