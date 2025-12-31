// checkout/page.jsx
"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  Container,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Typography,
} from "@mui/material";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Loading from "@/components/Loading/Loading";
import { useAuth } from "@/context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/redux/slices/cartSlice";
import { toast } from "react-hot-toast";
import { useCheckoutData } from "./hooks/useCheckoutData";
import { useCheckoutSteps } from "./hooks/useCheckoutSteps";

import AddressStep from "@/components/AddressStep/AddressStep";
import ShippingStep from "@/components/ShippingStep/ShippingStep";
import PaymentStep from "@/components/PaymentStep/PaymentStep";
import OrderSummary from "@/components/OrderSummary/OrderSummary";
import NewAddressForm from "@/components/NewAddressForm/NewAddressForm";

const steps = ["آدرس ارسال", "روش ارسال", "روش پرداخت", "اطلاعات نهایی"];

export default function CheckoutPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = require("next/navigation").useRouter();
  const dispatch = useDispatch();

  const cartItems = useSelector((s) => s.cart.items);
  const totalAmount = useSelector((s) => s.cart.totalAmount);

  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const paymentFormRef = useRef(null);
  const [receiptData, setReceiptData] = useState({
    amount: "",
    trackingCode: "",
    date: "",
    image: null,
  });
  const [newAddress, setNewAddress] = useState({
    title: "",
    province: "",
    city: "",
    full_address: "",
    phone: "",
    postal_code: "",
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const {
    addresses,
    setAddresses,
    selectedAddress,
    setSelectedAddress,
    shippingMethods,
    selectedShipping,
    setSelectedShipping,
    paymentSettings,
    calculatedShippingCost,
  } = useCheckoutData(isAuthenticated);

  const { handleNext, handleBack } = useCheckoutSteps({
    selectedAddress,
    selectedShipping,
    paymentMethod,
    paymentSettings,
    handlePlaceOrder: () => submitOrder(),
  });

  const isFormValid = useMemo(() => {
    if (activeStep < 3) return false;

    if (!selectedAddress) return false;
    if (!selectedShipping) return false;
    if (!paymentMethod) return false;

    if (paymentMethod === "receipt") {
      return receiptData.amount && receiptData.trackingCode && receiptData.date;
    }

    return true;
  }, [
    activeStep,
    selectedAddress,
    selectedShipping,
    paymentMethod,
    receiptData,
  ]);

  const handleAddressChange = (field, value) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveNewAddress = async (e) => {
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

    setIsSavingAddress(true);
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
      toast.error("ارتباط با سرور برقرار نشد: ", error);
    } finally {
      setIsSavingAddress(false);
    }
  };

  if (authLoading) return <Loading />;
  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <Container maxWidth="sm" sx={{ py: 10 }}>
          <Paper
            elevation={0}
            sx={{ p: 5, textAlign: "center", borderRadius: 3 }}
          >
            <Typography variant="h5" fontWeight={800} mb={2}>
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
              >
                ثبت نام
              </Button>
            </Box>
          </Paper>
        </Container>
        <Footer />
      </>
    );
  }

  const submitOrder = async () => {
    // همان منطق ثبت سفارش اصلی — بدون تغییر منطق
    if (!selectedAddress) return toast.error("لطفاً یک آدرس انتخاب کنید");

    // اگر پرداخت کارت به کارت انتخاب شده، اسکرول به فرم و نمایش فیلدها
    if (paymentMethod === "receipt") {
      if (
        !receiptData.amount ||
        !receiptData.trackingCode ||
        !receiptData.date
      ) {
        return toast.error("لطفاً اطلاعات کارت به کارت را کامل وارد کنید");
      }
    }

    setIsPlacingOrder(true);

    try {
      // ساخت آیتم‌ها بر اساس cartItems
      const itemsArray = cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        title: item.title,
      }));

      const finalOrderData = {
        data: {
          order_id: `ORD-${Date.now()}`,
          statuses: "pending",
          items: itemsArray,
          payment_method:
            paymentMethod === "online" ? "online" : "card_to_card",
          order_address: selectedAddress.id,
          shipping_cost: calculatedShippingCost,
          shipping_method_name: selectedShipping?.title ?? "",
          payment_details:
            paymentMethod === "receipt"
              ? {
                receipt_amount: receiptData.amount,
                receipt_tracking_code: receiptData.trackingCode,
                receipt_date: receiptData.date,
              }
              : {},
        },
      };

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
      router.push(`/profile/orders/${result.id || result.data?.id}`);
    } catch (e) {
      toast.error("خطای سیستمی در ثبت سفارش");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 6, paddingTop: "120px" }}>
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, mb: 4 }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              "& .MuiStepIcon-root.Mui-active": { color: "#C5A35C" },
              "& .MuiStepIcon-root.Mui-completed": { color: "#C5A35C" },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="caption">{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Grid
          container
          spacing={4}
          sx={{ justifyContent: "center", alignItems: "center" }}
        >
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              {activeStep === 0 && (
                <>
                  {/* فرم افزودن آدرس جدید */}
                  {showAddressForm && (
                    <NewAddressForm
                      values={newAddress}
                      onChange={handleAddressChange}
                      onSubmit={handleSaveNewAddress}
                      onCancel={() => setShowAddressForm(false)}
                      loading={isSavingAddress}
                    />
                  )}

                  {/* لیست آدرس‌ها */}
                  {!showAddressForm && (
                    <AddressStep
                      addresses={addresses}
                      selectedAddress={selectedAddress}
                      onSelect={(a) => {
                        setSelectedAddress(a);
                        setShowAddressForm(false);
                      }}
                      onShowNewAddress={() => setShowAddressForm(true)}
                    />
                  )}
                </>
              )}

              {activeStep === 1 && (
                <ShippingStep
                  shippingMethods={shippingMethods}
                  selectedShipping={selectedShipping}
                  onSelect={setSelectedShipping}
                  city={selectedAddress?.city}
                />
              )}

              {activeStep === 2 && (
                <div ref={paymentFormRef}>
                  <PaymentStep
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    paymentSettings={paymentSettings}
                    receiptData={receiptData}
                    setReceiptData={setReceiptData}
                  />
                </div>
              )}

              {activeStep === 3 && (
                <Box>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    تایید و ثبت سفارش
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    لطفاً اطلاعات را بررسی کنید و سپس ثبت نهایی را بزنید.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <OrderSummary
              total={totalAmount}
              shipping={calculatedShippingCost}
              onPlaceOrder={() => {
                // اگر مرحله هنوز کامل نشده کاربر را به مرحله نهایی می‌بریم
                if (activeStep < 3) return setActiveStep(3);
                submitOrder();
              }}
              isPlacingOrder={isPlacingOrder}
              isFormValid={isFormValid}
            />
          </Grid>
        </Grid>
        {/* Footer navigation */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => handleBack(activeStep, setActiveStep)}
            sx={{ textTransform: "none" }}
          >
            قبلی
          </Button>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() =>
                handleNext(activeStep, setActiveStep, setPaymentMethod)
              }
              sx={{
                bgcolor: "#C5A35C",
                textTransform: "none",
                "&:hover": { bgcolor: "#b38f4a" },
              }}
            >
              {activeStep < 3 ? "بعدی" : "ثبت نهایی"}
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
