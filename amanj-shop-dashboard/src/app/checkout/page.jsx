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

        <Grid container spacing={4} sx={{justifyContent: 'center'}}>
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
                                sx={{ color: "#C5A35C", mt: 1 }}
                              >
                                {cost === 0
                                  ? "رایگان"
                                  : `${cost?.toLocaleString()} تومان`}
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
                <Typography fontWeight="bold">
                  {totalAmount.toLocaleString()} ت
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography color="textSecondary">هزینه ارسال:</Typography>
                <Typography fontWeight="bold">
                  {calculatedShippingCost.toLocaleString()} ت
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="h6" fontWeight="bold">
                  مبلغ نهایی:
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="#C5A35C">
                  {(totalAmount + calculatedShippingCost).toLocaleString()}{" "}
                  تومان
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
