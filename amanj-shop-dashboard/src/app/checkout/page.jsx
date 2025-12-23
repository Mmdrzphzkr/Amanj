"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/redux/slices/cartSlice";
import { toast } from "react-hot-toast";
import Header from "@/components/Header/Header";
import Loading from "@/components/Loading/Loading";
import { useRef } from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Container,
  Radio,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  LocalShippingOutlined,
  AddLocationAltOutlined,
} from "@mui/icons-material";

const steps = ["آدرس ارسال", "روش ارسال", "اطلاعات پرداخت"];

export default function CheckoutPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const paymentFormRef = useRef(null);
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const [activeStep, setActiveStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // استیت‌های جدید برای سیستم ارسال و پرداخت هوشمند
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [calculatedShippingCost, setCalculatedShippingCost] = useState(0);
  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    lastFourDigits: "",
    trackingCode: "",
  });
  const [newAddress, setNewAddress] = useState({
    title: "",
    province: "",
    city: "",
    postal_code: "",
    full_address: "",
    phone: "",
  });
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  // ۱. بررسی وضعیت سبد خرید
  useEffect(() => {
    if (!authLoading && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [authLoading, cartItems.length, router]);

  // ۲. دریافت آدرس‌های کاربر از API
  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
      fetchShippingMethods();
      fetchPaymentSettings();
    }
  }, [isAuthenticated]);

  // ۲. محاسبه هزینه ارسال بر اساس شهر آدرس انتخاب شده
  useEffect(() => {
    if (selectedAddress && selectedShipping) {
      const city = selectedAddress.city;
      // استرپی داده‌ها را در attributes برمی‌گرداند
      const attrs = selectedShipping;
      const customCosts = attrs.cityCosts || {};

      const finalCost = customCosts[city] || attrs.baseCost || 0;
      setCalculatedShippingCost(finalCost);
    }
  }, [selectedAddress, selectedShipping]);

  // داخل src/app/checkout/page.jsx

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/user/addresses");
      const data = await res.json(); // حتما await res.json را بنویسید

      console.log("Addresses received:", data); // اینجا باید لیست آدرس‌ها (آرایه) را ببینید

      if (res.ok && Array.isArray(data)) {
        setAddresses(data);
        console.log(data[0]);
        if (data.length > 0) {
          setSelectedAddress(data[0]);
          setShowAddressForm(false);
        } else {
          setShowAddressForm(true);
        }
      } else {
        setAddresses([]);
        setShowAddressForm(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setAddresses([]);
    }
  };

  const fetchShippingMethods = async () => {
    try {
      // توجه: آدرس API را مطابق با Strapi تنظیم کنید (مثلاً /api/shippings)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/shippings`
      );
      const data = await res.json();
      console.log("data: ", data);
      if (data.data) {
        setShippingMethods(data.data);
        setSelectedShipping(data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      // توجه: آدرس API را مطابق با Strapi تنظیم کنید (مثلاً /api/shippings)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/payment-settings`
      );
      const data = await res.json();
      console.log("data: ", data);
      if (data.data) {
        setPaymentSettings(data.data);
      }
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedAddress) {
      toast.error("لطفاً ابتدا آدرس را انتخاب کنید");
      return;
    }
    if (activeStep === 1 && !selectedShipping) {
      toast.error("لطفاً روش ارسال را انتخاب کنید");
      return;
    }

    // اگر مرحله آخر بود، تابع اصلی ثبت سفارش صدا زده شود
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // تابعی برای رندر کردن محتوای هر مرحله
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            {/* کدهای مربوط به بخش آدرس که قبلاً داشتیم */}
            <Typography variant="h6" mb={2}>
              انتخاب آدرس تحویل
            </Typography>
            {/* ... محتوای آدرس‌ها ... */}
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" mb={2}>
              انتخاب شیوه ارسال
            </Typography>
            {/* ... کدهای مربوط به Grid روش‌های ارسال ... */}
          </Box>
        );
      case 2:
        return (
          <Box ref={paymentFormRef}>
            <Typography variant="h6" mb={2}>
              تایید نهایی و پرداخت
            </Typography>
            {/* ... کدهای مربوط به فرم کارت به کارت و فیش ... */}
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  // ۳. ثبت آدرس جدید
  const handleAddNewAddress = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (
      !newAddress.title ||
      !newAddress.full_address ||
      !newAddress.phone ||
      !newAddress.province ||
      !newAddress.city
    ) {
      toast.error("لطفاً تمام فیلدهای اجباری را پر کنید");
      return;
    }

    setIsSubmittingAddress(true);
    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newAddress }),
      });

      const result = await res.json();
      if (res.ok) {
        setAddresses((prev) =>
          Array.isArray(prev) ? [...prev, result] : [result]
        );
        setSelectedAddress(result);
        setShowAddressForm(false);
        setNewAddress({
          title: "",
          province: "",
          city: "",
          postal_code: "",
          full_address: "",
          phone: "",
        });
        toast.success("آدرس با موفقیت ثبت شد");
      } else {
        toast.error(result.error || "خطا در ثبت آدرس");
      }
    } catch (error) {
      toast.error("ارتباط با سرور برقرار نشد");
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  // ۴. ثبت نهایی سفارش
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("لطفاً یک آدرس انتخاب کنید");
      return;
    }

    // مرحله اول کلیک: نمایش فرم پرداخت کارت به کارت
    if (!showReceiptForm) {
      setShowReceiptForm(true);
      toast.info("لطفاً اطلاعات واریز را وارد کنید");

      return;
    }

    setTimeout(() => {
      paymentFormRef.current?.scrollIntoView({
        behavior: "smooth", // اسکرول نرم
        block: "start", // قرار گرفتن ابتدای فرم در بالای صفحه
      });
    }, 100);

    // مرحله دوم کلیک: اعتبارسنجی فیش و ثبت نهایی
    if (!paymentInfo.lastFourDigits || !paymentInfo.trackingCode) {
      toast.error("تکمیل فیلدهای پرداخت الزامی است");
      return;
    }

    setIsPlacingOrder(true);

    // ۱. آماده‌سازی آیتم‌ها مطابق فیلد items در دیتابیس (JSON)
    const itemsArray = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      title: item.title,
    }));

    const finalOrderData = {
      data: {
        // مقدار فیلد order_id اگر در استرپی Auto-generate نیست باید اینجا تولید شود
        order_id: `ORD-${Date.now()}`,

        // مطابق نام فیلد در عکس (statuses)
        statuses: "pending",

        // مطابق نام فیلد در عکس (items) - ارسال به صورت آرایه/آبجکت برای فیلد JSON
        items: itemsArray,

        // ایجاد رابطه با آدرس انتخاب شده (ارسال فقط ID)
        order_address: selectedAddress.id,
        shipping_cost: calculatedShippingCost,
        payment_details: {
          ...paymentInfo,
          total_paid: totalAmount + calculatedShippingCost,
        },
        shipping_method_name: selectedShipping.title,
      },
    };

    try {
      const res = await fetch("/api/user/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalOrderData),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result?.message || "خطا در ثبت سفارش");
        return;
      }

      toast.success("سفارش شما با موفقیت ثبت شد ✅");
      dispatch(clearCart());
      // در استرپی معمولاً آیدی در result.data.id است
      router.push(`/profile/orders/${result.id || result.data?.id}`);
    } catch (error) {
      toast.error("خطای سیستمی در ثبت سفارش");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (authLoading) return <Loading />;

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: "32px",
            border: "1px solid #DED9CC",
            bgcolor: "#EDE9DE",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={2}>
            نیاز به ورود به حساب
          </Typography>
          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}
          >
            <Button
              variant="contained"
              onClick={() => router.push("/login?callbackUrl=/checkout")}
              sx={{ bgcolor: "#3F3F3F" }}
            >
              ورود
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push("/register?callbackUrl=/checkout")}
              sx={{ color: "#3F3F3F", borderColor: "#3F3F3F" }}
            >
              ثبت نام
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 6, paddingTop: "120px" }}>
        {/* ۱. نوار وضعیت مراحل (Stepper) */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: 6,
            "& .MuiStepIcon-root.Mui-active": { color: "#C5A35C" },
            "& .MuiStepIcon-root.Mui-completed": { color: "#C5A35C" },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4} sx={{ justifyContent: "center" }}>
          {/* ستون سمت راست: محتوای مراحل */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 4 },
                borderRadius: "24px",
                border: "1px solid #eee",
                minHeight: "350px",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                {activeStep === 0 && (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        ۱. انتخاب آدرس تحویل
                      </Typography>
                      {!showAddressForm && (
                        <Button
                          startIcon={<AddLocationAltOutlined />}
                          onClick={() => setShowAddressForm(true)}
                          sx={{ color: "#C5A35C" }}
                        >
                          آدرس جدید
                        </Button>
                      )}
                    </Box>

                    {!showAddressForm ? (
                      <Grid container spacing={2}>
                        {addresses.map((addr) => (
                          <Grid item xs={12} key={addr.id}>
                            <Paper
                              onClick={() => setSelectedAddress(addr)}
                              sx={{
                                p: 2,
                                cursor: "pointer",
                                borderRadius: "16px",
                                border:
                                  selectedAddress?.id === addr.id
                                    ? "2px solid #C5A35C"
                                    : "1px solid #eee",
                                bgcolor:
                                  selectedAddress?.id === addr.id
                                    ? "#FFFAEE"
                                    : "white",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Radio
                                  checked={selectedAddress?.id === addr.id}
                                  color="warning"
                                />
                                <Box>
                                  <Typography fontWeight="bold">
                                    {addr.title}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    {addr.province}، {addr.city}،{" "}
                                    {addr.full_address}
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="عنوان آدرس"
                            value={newAddress.title}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                title: e.target.value,
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="استان"
                            value={newAddress.province}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                province: e.target.value,
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="شهر"
                            value={newAddress.city}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                city: e.target.value,
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="آدرس کامل"
                            value={newAddress.full_address}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                full_address: e.target.value,
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="کد پستی"
                            value={newAddress.postal_code}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                postal_code: e.target.value,
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="تلفن"
                            value={newAddress.phone}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                phone: e.target.value,
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            onClick={handleAddNewAddress}
                            sx={{ bgcolor: "#3F3F3F" }}
                          >
                            ذخیره
                          </Button>
                          <Button onClick={() => setShowAddressForm(false)}>
                            انصراف
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                  </Box>
                )}

                {activeStep === 1 && (
                  <Box>
                    <Typography variant="h6" fontWeight="bold" mb={3}>
                      ۲. انتخاب روش ارسال
                    </Typography>
                    <Grid container spacing={2}>
                      {shippingMethods.map((method) => {
                        const cost =
                          method.cityCosts?.[selectedAddress?.city] ||
                          method.baseCost;
                        return (
                          <Grid item xs={12} sm={6} key={method.id}>
                            <Paper
                              onClick={() => setSelectedShipping(method)}
                              sx={{
                                p: 3,
                                cursor: "pointer",
                                borderRadius: "16px",
                                border:
                                  selectedShipping?.id === method.id
                                    ? "2px solid #C5A35C"
                                    : "1px solid #eee",
                                bgcolor:
                                  selectedShipping?.id === method.id
                                    ? "#FFFAEE"
                                    : "white",
                              }}
                            >
                              <Typography fontWeight="bold">
                                {method.title}
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: "#C5A35C",
                                  mt: 1,
                                  display: "flex",
                                  justifyContent: "start",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                {cost === 0 ? (
                                  "رایگان"
                                ) : (
                                  <span
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                    }}
                                  >
                                    {cost?.toLocaleString()}
                                    {/* SVG شما اینجا قرار می‌گیره */}
                                    <svg
                                      width="24"
                                      height="22"
                                      viewBox="0 0 24 22"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      {/* ... (SVG paths) ... */}
                                      <path
                                        d="M3.2 9.12C2.752 9.12 2.33067 9.03467 1.936 8.864C1.552 8.704 1.216 8.48 0.928 8.192C0.64 7.904 0.410667 7.56267 0.24 7.168C0.08 6.784 0 6.368 0 5.92V1.648H1.104V5.744C1.104 6.032 1.15733 6.29867 1.264 6.544C1.37067 6.8 1.51467 7.01867 1.696 7.2C1.888 7.392 2.112 7.54133 2.368 7.648C2.624 7.75467 2.896 7.808 3.184 7.808H5.952C6.19733 7.808 6.42667 7.76 6.64 7.664C6.85333 7.57867 7.04 7.456 7.2 7.296C7.36 7.14667 7.48267 6.96533 7.568 6.752C7.664 6.54933 7.712 6.32533 7.712 6.08V1.376H8.816V6.272C8.816 6.66667 8.74133 7.03467 8.592 7.376C8.44267 7.728 8.23467 8.032 7.968 8.288C7.712 8.544 7.408 8.74667 7.056 8.896C6.71467 9.04533 6.34667 9.12 5.952 9.12H3.2ZM3.728 0H5.088V1.36H3.728V0Z"
                                        fill="#B4B4B4"
                                      />
                                      <path
                                        d="M3.70977 17.04C3.70977 17.1893 3.63511 17.264 3.48577 17.264H2.89377C2.56311 17.264 2.24844 17.2 1.94977 17.072C1.65111 16.944 1.38977 16.768 1.16577 16.544C0.941773 16.32 0.765773 16.0587 0.637773 15.76C0.509773 15.4613 0.445773 15.1467 0.445773 14.816V10.006H1.54977V14.8C1.54977 15.12 1.66177 15.392 1.88577 15.616C2.12044 15.84 2.39244 15.952 2.70177 15.952H3.48577C3.54977 15.952 3.60311 15.9787 3.64577 16.032C3.68844 16.0747 3.70977 16.128 3.70977 16.192V17.04Z"
                                        fill="#B4B4B4"
                                      />
                                      <path
                                        d="M7.22415 15.952H9.65616V13.808C9.65616 13.5307 9.55482 13.296 9.35215 13.104C9.16015 12.9013 8.92016 12.8 8.63216 12.8H7.59215C7.34682 12.8 7.13348 12.88 6.95215 13.04C6.77082 13.1893 6.65348 13.3813 6.60015 13.616L6.36015 14.912C6.30682 15.1893 6.36548 15.4347 6.53615 15.648C6.71748 15.8507 6.94682 15.952 7.22415 15.952ZM5.22415 14.944L5.56015 13.296C5.60281 13.0507 5.68815 12.8213 5.81615 12.608C5.94415 12.3947 6.09881 12.2133 6.28015 12.064C6.46148 11.9147 6.66415 11.7973 6.88815 11.712C7.12282 11.6266 7.36815 11.584 7.62415 11.584H8.52016C8.82949 11.584 9.11749 11.6427 9.38416 11.76C9.66149 11.8773 9.90149 12.0373 10.1042 12.24C10.3068 12.4426 10.4668 12.6773 10.5842 12.944C10.7015 13.2107 10.7602 13.4987 10.7602 13.808V15.824C10.7602 16.2507 10.6268 16.5973 10.3602 16.864C10.1042 17.1307 9.75215 17.264 9.30415 17.264H7.35215C7.01082 17.264 6.69615 17.184 6.40815 17.024C6.13082 16.8533 5.90148 16.5813 5.72015 16.208C5.52815 16.5813 5.27215 16.8533 4.95215 17.024C4.63215 17.184 4.29615 17.264 3.94415 17.264H3.48015C3.33081 17.264 3.25615 17.1893 3.25615 17.04V16.176C3.25615 16.1227 3.27748 16.0747 3.32015 16.032C3.36281 15.9787 3.41615 15.952 3.48015 15.952H3.99215C4.30148 15.952 4.56815 15.856 4.79215 15.664C5.02681 15.472 5.17081 15.232 5.22415 14.944Z"
                                        fill="#B4B4B4"
                                      />
                                      <path
                                        d="M14.8666 17.264C14.5359 17.264 14.2319 17.1947 13.9546 17.056C13.6772 16.9173 13.4426 16.7307 13.2506 16.496C13.0586 16.2613 12.9199 15.9947 12.8346 15.696C12.7492 15.3867 12.7386 15.072 12.8026 14.752L13.0746 13.296C13.1172 13.0507 13.2026 12.8267 13.3306 12.624C13.4586 12.4107 13.6132 12.2293 13.7946 12.08C13.9759 11.9306 14.1786 11.8133 14.4026 11.728C14.6372 11.6427 14.8826 11.6 15.1386 11.6H16.0346C16.3439 11.6 16.6319 11.6586 16.8986 11.776C17.1759 11.8933 17.4159 12.0533 17.6186 12.256C17.8212 12.448 17.9812 12.6827 18.0986 12.96C18.2159 13.2267 18.2746 13.5147 18.2746 13.824V15.952H19.5386C19.6026 15.952 19.6559 15.9787 19.6986 16.032C19.7412 16.0747 19.7626 16.1227 19.7626 16.176V17.04C19.7626 17.1893 19.6879 17.264 19.5386 17.264H18.2586V17.456C18.2372 18.1813 18.0079 18.832 17.5706 19.408C17.1439 19.9947 16.5786 20.4107 15.8746 20.656L14.0506 21.28L13.6986 20.176L15.6186 19.536C16.0772 19.376 16.4452 19.104 16.7226 18.72C17.0106 18.3467 17.1546 17.9147 17.1546 17.424V17.136C17.0692 17.1893 16.9679 17.2267 16.8506 17.248C16.7439 17.2587 16.6319 17.264 16.5146 17.264H14.8666ZM14.7546 15.952H17.1706V13.824C17.1706 13.5467 17.0692 13.312 16.8666 13.12C16.6746 12.9173 16.4399 12.816 16.1626 12.816H15.1066C14.8612 12.816 14.6479 12.8907 14.4666 13.04C14.2852 13.1893 14.1679 13.3867 14.1146 13.632L13.8746 14.912C13.8212 15.1893 13.8852 15.4347 14.0666 15.648C14.2479 15.8507 14.4772 15.952 14.7546 15.952Z"
                                        fill="#B4B4B4"
                                      />
                                      <path
                                        d="M21.4787 15.952C21.7987 15.952 22.0707 15.84 22.2947 15.616C22.5187 15.392 22.6307 15.1253 22.6307 14.816V11.872H23.7347V14.816C23.7347 15.1573 23.6707 15.4773 23.5427 15.776C23.4147 16.0747 23.2387 16.336 23.0147 16.56C22.7907 16.7733 22.5294 16.944 22.2307 17.072C21.9427 17.2 21.628 17.264 21.2867 17.264H19.5427C19.3934 17.264 19.3187 17.1893 19.3187 17.04V16.192C19.3187 16.128 19.34 16.0747 19.3827 16.032C19.4254 15.9787 19.4787 15.952 19.5427 15.952H21.4787ZM20.1667 9.99998H21.5267V8.64H20.1667V9.99998ZM22.3587 9.99998H23.7187V8.64H22.3587V9.99998Z"
                                        fill="#B4B4B4"
                                      />
                                    </svg>
                                  </span>
                                )}
                              </Typography>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}

                {activeStep === 2 && (
                  <Box>
                    <Typography variant="h6" fontWeight="bold" mb={3}>
                      ۳. اطلاعات پرداخت
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: "16px",
                        border: "1px solid #DED9CC",
                        bgcolor: "#FFFBF2",
                        mb: 3,
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom>
                        شماره کارت جهت واریز:
                      </Typography>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        textAlign="center"
                        sx={{ my: 2, letterSpacing: 2 }}
                      >
                        ۶۰۳۷ - ۹۹۷۷ - ۱۲۳۴ - ۵۶۷۸
                      </Typography>
                      <Typography
                        variant="body2"
                        textAlign="center"
                        color="textSecondary"
                      >
                        بنام مدیریت فروشگاه قهوه امانجی
                      </Typography>
                    </Paper>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="۴ رقم آخر کارت"
                          value={paymentInfo.lastFourDigits}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              lastFourDigits: e.target.value,
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="کد پیگیری"
                          value={paymentInfo.trackingCode}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              trackingCode: e.target.value,
                            })
                          }
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* ستون سمت چپ: خلاصه مالی (همیشه ثابت) */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "24px",
                border: "1px solid #DED9CC",
                bgcolor: "#F9F8F5",
                position: "sticky",
                top: "120px",
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={3}>
                خلاصه سفارش
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography color="textSecondary">جمع محصولات:</Typography>
                <Typography
                  fontWeight="bold"
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {totalAmount.toLocaleString()}{" "}
                  <svg
                    width="24"
                    height="22"
                    viewBox="0 0 24 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* ... (SVG paths) ... */}
                    <path
                      d="M3.2 9.12C2.752 9.12 2.33067 9.03467 1.936 8.864C1.552 8.704 1.216 8.48 0.928 8.192C0.64 7.904 0.410667 7.56267 0.24 7.168C0.08 6.784 0 6.368 0 5.92V1.648H1.104V5.744C1.104 6.032 1.15733 6.29867 1.264 6.544C1.37067 6.8 1.51467 7.01867 1.696 7.2C1.888 7.392 2.112 7.54133 2.368 7.648C2.624 7.75467 2.896 7.808 3.184 7.808H5.952C6.19733 7.808 6.42667 7.76 6.64 7.664C6.85333 7.57867 7.04 7.456 7.2 7.296C7.36 7.14667 7.48267 6.96533 7.568 6.752C7.664 6.54933 7.712 6.32533 7.712 6.08V1.376H8.816V6.272C8.816 6.66667 8.74133 7.03467 8.592 7.376C8.44267 7.728 8.23467 8.032 7.968 8.288C7.712 8.544 7.408 8.74667 7.056 8.896C6.71467 9.04533 6.34667 9.12 5.952 9.12H3.2ZM3.728 0H5.088V1.36H3.728V0Z"
                      fill="#B4B4B4"
                    />
                    <path
                      d="M3.70977 17.04C3.70977 17.1893 3.63511 17.264 3.48577 17.264H2.89377C2.56311 17.264 2.24844 17.2 1.94977 17.072C1.65111 16.944 1.38977 16.768 1.16577 16.544C0.941773 16.32 0.765773 16.0587 0.637773 15.76C0.509773 15.4613 0.445773 15.1467 0.445773 14.816V10.006H1.54977V14.8C1.54977 15.12 1.66177 15.392 1.88577 15.616C2.12044 15.84 2.39244 15.952 2.70177 15.952H3.48577C3.54977 15.952 3.60311 15.9787 3.64577 16.032C3.68844 16.0747 3.70977 16.128 3.70977 16.192V17.04Z"
                      fill="#B4B4B4"
                    />
                    <path
                      d="M7.22415 15.952H9.65616V13.808C9.65616 13.5307 9.55482 13.296 9.35215 13.104C9.16015 12.9013 8.92016 12.8 8.63216 12.8H7.59215C7.34682 12.8 7.13348 12.88 6.95215 13.04C6.77082 13.1893 6.65348 13.3813 6.60015 13.616L6.36015 14.912C6.30682 15.1893 6.36548 15.4347 6.53615 15.648C6.71748 15.8507 6.94682 15.952 7.22415 15.952ZM5.22415 14.944L5.56015 13.296C5.60281 13.0507 5.68815 12.8213 5.81615 12.608C5.94415 12.3947 6.09881 12.2133 6.28015 12.064C6.46148 11.9147 6.66415 11.7973 6.88815 11.712C7.12282 11.6266 7.36815 11.584 7.62415 11.584H8.52016C8.82949 11.584 9.11749 11.6427 9.38416 11.76C9.66149 11.8773 9.90149 12.0373 10.1042 12.24C10.3068 12.4426 10.4668 12.6773 10.5842 12.944C10.7015 13.2107 10.7602 13.4987 10.7602 13.808V15.824C10.7602 16.2507 10.6268 16.5973 10.3602 16.864C10.1042 17.1307 9.75215 17.264 9.30415 17.264H7.35215C7.01082 17.264 6.69615 17.184 6.40815 17.024C6.13082 16.8533 5.90148 16.5813 5.72015 16.208C5.52815 16.5813 5.27215 16.8533 4.95215 17.024C4.63215 17.184 4.29615 17.264 3.94415 17.264H3.48015C3.33081 17.264 3.25615 17.1893 3.25615 17.04V16.176C3.25615 16.1227 3.27748 16.0747 3.32015 16.032C3.36281 15.9787 3.41615 15.952 3.48015 15.952H3.99215C4.30148 15.952 4.56815 15.856 4.79215 15.664C5.02681 15.472 5.17081 15.232 5.22415 14.944Z"
                      fill="#B4B4B4"
                    />
                    <path
                      d="M14.8666 17.264C14.5359 17.264 14.2319 17.1947 13.9546 17.056C13.6772 16.9173 13.4426 16.7307 13.2506 16.496C13.0586 16.2613 12.9199 15.9947 12.8346 15.696C12.7492 15.3867 12.7386 15.072 12.8026 14.752L13.0746 13.296C13.1172 13.0507 13.2026 12.8267 13.3306 12.624C13.4586 12.4107 13.6132 12.2293 13.7946 12.08C13.9759 11.9306 14.1786 11.8133 14.4026 11.728C14.6372 11.6427 14.8826 11.6 15.1386 11.6H16.0346C16.3439 11.6 16.6319 11.6586 16.8986 11.776C17.1759 11.8933 17.4159 12.0533 17.6186 12.256C17.8212 12.448 17.9812 12.6827 18.0986 12.96C18.2159 13.2267 18.2746 13.5147 18.2746 13.824V15.952H19.5386C19.6026 15.952 19.6559 15.9787 19.6986 16.032C19.7412 16.0747 19.7626 16.1227 19.7626 16.176V17.04C19.7626 17.1893 19.6879 17.264 19.5386 17.264H18.2586V17.456C18.2372 18.1813 18.0079 18.832 17.5706 19.408C17.1439 19.9947 16.5786 20.4107 15.8746 20.656L14.0506 21.28L13.6986 20.176L15.6186 19.536C16.0772 19.376 16.4452 19.104 16.7226 18.72C17.0106 18.3467 17.1546 17.9147 17.1546 17.424V17.136C17.0692 17.1893 16.9679 17.2267 16.8506 17.248C16.7439 17.2587 16.6319 17.264 16.5146 17.264H14.8666ZM14.7546 15.952H17.1706V13.824C17.1706 13.5467 17.0692 13.312 16.8666 13.12C16.6746 12.9173 16.4399 12.816 16.1626 12.816H15.1066C14.8612 12.816 14.6479 12.8907 14.4666 13.04C14.2852 13.1893 14.1679 13.3867 14.1146 13.632L13.8746 14.912C13.8212 15.1893 13.8852 15.4347 14.0666 15.648C14.2479 15.8507 14.4772 15.952 14.7546 15.952Z"
                      fill="#B4B4B4"
                    />
                    <path
                      d="M21.4787 15.952C21.7987 15.952 22.0707 15.84 22.2947 15.616C22.5187 15.392 22.6307 15.1253 22.6307 14.816V11.872H23.7347V14.816C23.7347 15.1573 23.6707 15.4773 23.5427 15.776C23.4147 16.0747 23.2387 16.336 23.0147 16.56C22.7907 16.7733 22.5294 16.944 22.2307 17.072C21.9427 17.2 21.628 17.264 21.2867 17.264H19.5427C19.3934 17.264 19.3187 17.1893 19.3187 17.04V16.192C19.3187 16.128 19.34 16.0747 19.3827 16.032C19.4254 15.9787 19.4787 15.952 19.5427 15.952H21.4787ZM20.1667 9.99998H21.5267V8.64H20.1667V9.99998ZM22.3587 9.99998H23.7187V8.64H22.3587V9.99998Z"
                      fill="#B4B4B4"
                    />
                  </svg>
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography color="textSecondary">هزینه ارسال:</Typography>
                <Typography
                  fontWeight="bold"
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {calculatedShippingCost.toLocaleString()}{" "}
                  <svg
                    width="24"
                    height="22"
                    viewBox="0 0 24 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* ... (SVG paths) ... */}
                    <path
                      d="M3.2 9.12C2.752 9.12 2.33067 9.03467 1.936 8.864C1.552 8.704 1.216 8.48 0.928 8.192C0.64 7.904 0.410667 7.56267 0.24 7.168C0.08 6.784 0 6.368 0 5.92V1.648H1.104V5.744C1.104 6.032 1.15733 6.29867 1.264 6.544C1.37067 6.8 1.51467 7.01867 1.696 7.2C1.888 7.392 2.112 7.54133 2.368 7.648C2.624 7.75467 2.896 7.808 3.184 7.808H5.952C6.19733 7.808 6.42667 7.76 6.64 7.664C6.85333 7.57867 7.04 7.456 7.2 7.296C7.36 7.14667 7.48267 6.96533 7.568 6.752C7.664 6.54933 7.712 6.32533 7.712 6.08V1.376H8.816V6.272C8.816 6.66667 8.74133 7.03467 8.592 7.376C8.44267 7.728 8.23467 8.032 7.968 8.288C7.712 8.544 7.408 8.74667 7.056 8.896C6.71467 9.04533 6.34667 9.12 5.952 9.12H3.2ZM3.728 0H5.088V1.36H3.728V0Z"
                      fill="#B4B4B4"
                    />
                    <path
                      d="M3.70977 17.04C3.70977 17.1893 3.63511 17.264 3.48577 17.264H2.89377C2.56311 17.264 2.24844 17.2 1.94977 17.072C1.65111 16.944 1.38977 16.768 1.16577 16.544C0.941773 16.32 0.765773 16.0587 0.637773 15.76C0.509773 15.4613 0.445773 15.1467 0.445773 14.816V10.006H1.54977V14.8C1.54977 15.12 1.66177 15.392 1.88577 15.616C2.12044 15.84 2.39244 15.952 2.70177 15.952H3.48577C3.54977 15.952 3.60311 15.9787 3.64577 16.032C3.68844 16.0747 3.70977 16.128 3.70977 16.192V17.04Z"
                      fill="#B4B4B4"
                    />
                    <path
                      d="M7.22415 15.952H9.65616V13.808C9.65616 13.5307 9.55482 13.296 9.35215 13.104C9.16015 12.9013 8.92016 12.8 8.63216 12.8H7.59215C7.34682 12.8 7.13348 12.88 6.95215 13.04C6.77082 13.1893 6.65348 13.3813 6.60015 13.616L6.36015 14.912C6.30682 15.1893 6.36548 15.4347 6.53615 15.648C6.71748 15.8507 6.94682 15.952 7.22415 15.952ZM5.22415 14.944L5.56015 13.296C5.60281 13.0507 5.68815 12.8213 5.81615 12.608C5.94415 12.3947 6.09881 12.2133 6.28015 12.064C6.46148 11.9147 6.66415 11.7973 6.88815 11.712C7.12282 11.6266 7.36815 11.584 7.62415 11.584H8.52016C8.82949 11.584 9.11749 11.6427 9.38416 11.76C9.66149 11.8773 9.90149 12.0373 10.1042 12.24C10.3068 12.4426 10.4668 12.6773 10.5842 12.944C10.7015 13.2107 10.7602 13.4987 10.7602 13.808V15.824C10.7602 16.2507 10.6268 16.5973 10.3602 16.864C10.1042 17.1307 9.75215 17.264 9.30415 17.264H7.35215C7.01082 17.264 6.69615 17.184 6.40815 17.024C6.13082 16.8533 5.90148 16.5813 5.72015 16.208C5.52815 16.5813 5.27215 16.8533 4.95215 17.024C4.63215 17.184 4.29615 17.264 3.94415 17.264H3.48015C3.33081 17.264 3.25615 17.1893 3.25615 17.04V16.176C3.25615 16.1227 3.27748 16.0747 3.32015 16.032C3.36281 15.9787 3.41615 15.952 3.48015 15.952H3.99215C4.30148 15.952 4.56815 15.856 4.79215 15.664C5.02681 15.472 5.17081 15.232 5.22415 14.944Z"
                      fill="#B4B4B4"
                    />
                    <path
                      d="M14.8666 17.264C14.5359 17.264 14.2319 17.1947 13.9546 17.056C13.6772 16.9173 13.4426 16.7307 13.2506 16.496C13.0586 16.2613 12.9199 15.9947 12.8346 15.696C12.7492 15.3867 12.7386 15.072 12.8026 14.752L13.0746 13.296C13.1172 13.0507 13.2026 12.8267 13.3306 12.624C13.4586 12.4107 13.6132 12.2293 13.7946 12.08C13.9759 11.9306 14.1786 11.8133 14.4026 11.728C14.6372 11.6427 14.8826 11.6 15.1386 11.6H16.0346C16.3439 11.6 16.6319 11.6586 16.8986 11.776C17.1759 11.8933 17.4159 12.0533 17.6186 12.256C17.8212 12.448 17.9812 12.6827 18.0986 12.96C18.2159 13.2267 18.2746 13.5147 18.2746 13.824V15.952H19.5386C19.6026 15.952 19.6559 15.9787 19.6986 16.032C19.7412 16.0747 19.7626 16.1227 19.7626 16.176V17.04C19.7626 17.1893 19.6879 17.264 19.5386 17.264H18.2586V17.456C18.2372 18.1813 18.0079 18.832 17.5706 19.408C17.1439 19.9947 16.5786 20.4107 15.8746 20.656L14.0506 21.28L13.6986 20.176L15.6186 19.536C16.0772 19.376 16.4452 19.104 16.7226 18.72C17.0106 18.3467 17.1546 17.9147 17.1546 17.424V17.136C17.0692 17.1893 16.9679 17.2267 16.8506 17.248C16.7439 17.2587 16.6319 17.264 16.5146 17.264H14.8666ZM14.7546 15.952H17.1706V13.824C17.1706 13.5467 17.0692 13.312 16.8666 13.12C16.6746 12.9173 16.4399 12.816 16.1626 12.816H15.1066C14.8612 12.816 14.6479 12.8907 14.4666 13.04C14.2852 13.1893 14.1679 13.3867 14.1146 13.632L13.8746 14.912C13.8212 15.1893 13.8852 15.4347 14.0666 15.648C14.2479 15.8507 14.4772 15.952 14.7546 15.952Z"
                      fill="#B4B4B4"
                    />
                    <path
                      d="M21.4787 15.952C21.7987 15.952 22.0707 15.84 22.2947 15.616C22.5187 15.392 22.6307 15.1253 22.6307 14.816V11.872H23.7347V14.816C23.7347 15.1573 23.6707 15.4773 23.5427 15.776C23.4147 16.0747 23.2387 16.336 23.0147 16.56C22.7907 16.7733 22.5294 16.944 22.2307 17.072C21.9427 17.2 21.628 17.264 21.2867 17.264H19.5427C19.3934 17.264 19.3187 17.1893 19.3187 17.04V16.192C19.3187 16.128 19.34 16.0747 19.3827 16.032C19.4254 15.9787 19.4787 15.952 19.5427 15.952H21.4787ZM20.1667 9.99998H21.5267V8.64H20.1667V9.99998ZM22.3587 9.99998H23.7187V8.64H22.3587V9.99998Z"
                      fill="#B4B4B4"
                    />
                  </svg>
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="h6" fontWeight="bold">
                  مبلغ نهایی:
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#C5A35C"
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {(totalAmount + calculatedShippingCost).toLocaleString()}{" "}
                  <span>
                    <svg
                      width="24"
                      height="22"
                      viewBox="0 0 24 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* ... (SVG paths) ... */}
                      <path
                        d="M3.2 9.12C2.752 9.12 2.33067 9.03467 1.936 8.864C1.552 8.704 1.216 8.48 0.928 8.192C0.64 7.904 0.410667 7.56267 0.24 7.168C0.08 6.784 0 6.368 0 5.92V1.648H1.104V5.744C1.104 6.032 1.15733 6.29867 1.264 6.544C1.37067 6.8 1.51467 7.01867 1.696 7.2C1.888 7.392 2.112 7.54133 2.368 7.648C2.624 7.75467 2.896 7.808 3.184 7.808H5.952C6.19733 7.808 6.42667 7.76 6.64 7.664C6.85333 7.57867 7.04 7.456 7.2 7.296C7.36 7.14667 7.48267 6.96533 7.568 6.752C7.664 6.54933 7.712 6.32533 7.712 6.08V1.376H8.816V6.272C8.816 6.66667 8.74133 7.03467 8.592 7.376C8.44267 7.728 8.23467 8.032 7.968 8.288C7.712 8.544 7.408 8.74667 7.056 8.896C6.71467 9.04533 6.34667 9.12 5.952 9.12H3.2ZM3.728 0H5.088V1.36H3.728V0Z"
                        fill="#B4B4B4"
                      />
                      <path
                        d="M3.70977 17.04C3.70977 17.1893 3.63511 17.264 3.48577 17.264H2.89377C2.56311 17.264 2.24844 17.2 1.94977 17.072C1.65111 16.944 1.38977 16.768 1.16577 16.544C0.941773 16.32 0.765773 16.0587 0.637773 15.76C0.509773 15.4613 0.445773 15.1467 0.445773 14.816V10.006H1.54977V14.8C1.54977 15.12 1.66177 15.392 1.88577 15.616C2.12044 15.84 2.39244 15.952 2.70177 15.952H3.48577C3.54977 15.952 3.60311 15.9787 3.64577 16.032C3.68844 16.0747 3.70977 16.128 3.70977 16.192V17.04Z"
                        fill="#B4B4B4"
                      />
                      <path
                        d="M7.22415 15.952H9.65616V13.808C9.65616 13.5307 9.55482 13.296 9.35215 13.104C9.16015 12.9013 8.92016 12.8 8.63216 12.8H7.59215C7.34682 12.8 7.13348 12.88 6.95215 13.04C6.77082 13.1893 6.65348 13.3813 6.60015 13.616L6.36015 14.912C6.30682 15.1893 6.36548 15.4347 6.53615 15.648C6.71748 15.8507 6.94682 15.952 7.22415 15.952ZM5.22415 14.944L5.56015 13.296C5.60281 13.0507 5.68815 12.8213 5.81615 12.608C5.94415 12.3947 6.09881 12.2133 6.28015 12.064C6.46148 11.9147 6.66415 11.7973 6.88815 11.712C7.12282 11.6266 7.36815 11.584 7.62415 11.584H8.52016C8.82949 11.584 9.11749 11.6427 9.38416 11.76C9.66149 11.8773 9.90149 12.0373 10.1042 12.24C10.3068 12.4426 10.4668 12.6773 10.5842 12.944C10.7015 13.2107 10.7602 13.4987 10.7602 13.808V15.824C10.7602 16.2507 10.6268 16.5973 10.3602 16.864C10.1042 17.1307 9.75215 17.264 9.30415 17.264H7.35215C7.01082 17.264 6.69615 17.184 6.40815 17.024C6.13082 16.8533 5.90148 16.5813 5.72015 16.208C5.52815 16.5813 5.27215 16.8533 4.95215 17.024C4.63215 17.184 4.29615 17.264 3.94415 17.264H3.48015C3.33081 17.264 3.25615 17.1893 3.25615 17.04V16.176C3.25615 16.1227 3.27748 16.0747 3.32015 16.032C3.36281 15.9787 3.41615 15.952 3.48015 15.952H3.99215C4.30148 15.952 4.56815 15.856 4.79215 15.664C5.02681 15.472 5.17081 15.232 5.22415 14.944Z"
                        fill="#B4B4B4"
                      />
                      <path
                        d="M14.8666 17.264C14.5359 17.264 14.2319 17.1947 13.9546 17.056C13.6772 16.9173 13.4426 16.7307 13.2506 16.496C13.0586 16.2613 12.9199 15.9947 12.8346 15.696C12.7492 15.3867 12.7386 15.072 12.8026 14.752L13.0746 13.296C13.1172 13.0507 13.2026 12.8267 13.3306 12.624C13.4586 12.4107 13.6132 12.2293 13.7946 12.08C13.9759 11.9306 14.1786 11.8133 14.4026 11.728C14.6372 11.6427 14.8826 11.6 15.1386 11.6H16.0346C16.3439 11.6 16.6319 11.6586 16.8986 11.776C17.1759 11.8933 17.4159 12.0533 17.6186 12.256C17.8212 12.448 17.9812 12.6827 18.0986 12.96C18.2159 13.2267 18.2746 13.5147 18.2746 13.824V15.952H19.5386C19.6026 15.952 19.6559 15.9787 19.6986 16.032C19.7412 16.0747 19.7626 16.1227 19.7626 16.176V17.04C19.7626 17.1893 19.6879 17.264 19.5386 17.264H18.2586V17.456C18.2372 18.1813 18.0079 18.832 17.5706 19.408C17.1439 19.9947 16.5786 20.4107 15.8746 20.656L14.0506 21.28L13.6986 20.176L15.6186 19.536C16.0772 19.376 16.4452 19.104 16.7226 18.72C17.0106 18.3467 17.1546 17.9147 17.1546 17.424V17.136C17.0692 17.1893 16.9679 17.2267 16.8506 17.248C16.7439 17.2587 16.6319 17.264 16.5146 17.264H14.8666ZM14.7546 15.952H17.1706V13.824C17.1706 13.5467 17.0692 13.312 16.8666 13.12C16.6746 12.9173 16.4399 12.816 16.1626 12.816H15.1066C14.8612 12.816 14.6479 12.8907 14.4666 13.04C14.2852 13.1893 14.1679 13.3867 14.1146 13.632L13.8746 14.912C13.8212 15.1893 13.8852 15.4347 14.0666 15.648C14.2479 15.8507 14.4772 15.952 14.7546 15.952Z"
                        fill="#B4B4B4"
                      />
                      <path
                        d="M21.4787 15.952C21.7987 15.952 22.0707 15.84 22.2947 15.616C22.5187 15.392 22.6307 15.1253 22.6307 14.816V11.872H23.7347V14.816C23.7347 15.1573 23.6707 15.4773 23.5427 15.776C23.4147 16.0747 23.2387 16.336 23.0147 16.56C22.7907 16.7733 22.5294 16.944 22.2307 17.072C21.9427 17.2 21.628 17.264 21.2867 17.264H19.5427C19.3934 17.264 19.3187 17.1893 19.3187 17.04V16.192C19.3187 16.128 19.34 16.0747 19.3827 16.032C19.4254 15.9787 19.4787 15.952 19.5427 15.952H21.4787ZM20.1667 9.99998H21.5267V8.64H20.1667V9.99998ZM22.3587 9.99998H23.7187V8.64H22.3587V9.99998Z"
                        fill="#B4B4B4"
                      />
                    </svg>
                  </span>
                </Typography>
              </Box>

              {/* نمایش کوچک اطلاعات انتخاب شده برای اطمینان کاربر */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #eee",
                }}
              >
                <Typography
                  variant="caption"
                  color="textSecondary"
                  display="block"
                >
                  آدرس: {selectedAddress?.title || "---"}
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  display="block"
                >
                  ارسال: {selectedShipping?.title || "---"}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        {/* دکمه‌های ناوبری پایین پنل */}
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            disabled={activeStep === 0 || isPlacingOrder}
            onClick={handleBack}
            startIcon={<span>→</span>}
          >
            مرحله قبلی
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={isPlacingOrder}
            sx={{
              bgcolor: "#3F3F3F",
              px: 4,
              borderRadius: "12px",
              "&:hover": { bgcolor: "#000" },
            }}
          >
            {isPlacingOrder ? (
              <CircularProgress size={24} color="inherit" />
            ) : activeStep === steps.length - 1 ? (
              "ثبت نهایی سفارش"
            ) : (
              "مرحله بعدی"
            )}
          </Button>
        </Box>
      </Container>
    </>
  );
}
