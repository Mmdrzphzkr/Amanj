"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/redux/slices/cartSlice";
import { toast } from "react-hot-toast";
import Header from "@/components/Header/Header";
import Loading from "@/components/Loading/Loading";
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
} from "@mui/material";
import {
  LocalShippingOutlined,
  AddLocationAltOutlined,
} from "@mui/icons-material";

export default function CheckoutPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingMethod] = useState("پست پیشتاز");
  const [paymentMethod] = useState("card_to_card");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // استیت مطابق با تصویر دیتابیس استرپی
  const [newAddress, setNewAddress] = useState({
    title: "",
    province: "",
    city: "",
    postal_code: "",
    full_address: "",
    phone: "",
  });
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  const SHIPPING_COST = 30000;

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
    }
  }, [isAuthenticated]);

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
      <Container maxWidth="lg" sx={{ py: 6, paddingTop: "90px" }}>
        <Grid container spacing={4}>
          {/* ستون راست: آدرس */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{ p: 4, borderRadius: "24px", border: "1px solid #eee" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <LocalShippingOutlined /> ۱. اطلاعات ارسال
                </Typography>
                {!showAddressForm && (
                  <Button
                    startIcon={<AddLocationAltOutlined />}
                    onClick={() => setShowAddressForm(true)}
                    sx={{ color: "#C5A35C" }}
                  >
                    افزودن آدرس جدید
                  </Button>
                )}
              </Box>

              {!showAddressForm ? (
                <Grid container spacing={2}>
                  {addresses?.map((addr) => (
                    <Grid item xs={12} key={addr.id}>
                      <Paper
                        onClick={() => setSelectedAddress(addr)}
                        sx={{
                          p: 3,
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
                        <Typography fontWeight="bold">{addr.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {addr.province}، {addr.city}، {addr.full_address}
                        </Typography>
                        <Typography variant="caption">
                          تلفن: {addr.phone}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box component="form">
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
                        required
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
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="شهر"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        required
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
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="شماره تماس"
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="آدرس دقیق"
                        value={newAddress.full_address}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            full_address: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ display: "flex", gap: 2, mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleAddNewAddress}
                        disabled={isSubmittingAddress}
                        sx={{ bgcolor: "#3F3F3F" }}
                      >
                        {isSubmittingAddress
                          ? "در حال ثبت..."
                          : "ذخیره و انتخاب آدرس"}
                      </Button>
                      {addresses?.length > 0 && (
                        <Button onClick={() => setShowAddressForm(false)}>
                          انصراف
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* ستون چپ: خلاصه فاکتور */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "24px",
                border: "1px solid #DED9CC",
                bgcolor: "#F9F8F5",
                position: "sticky",
                top: "100px",
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
                  {totalAmount.toLocaleString()} تومان
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography color="textSecondary">هزینه ارسال:</Typography>
                <Typography fontWeight="bold">
                  {SHIPPING_COST.toLocaleString()} تومان
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}
              >
                <Typography variant="h6" fontWeight="bold">
                  مبلغ قابل پرداخت:
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="#C5A35C">
                  {(totalAmount + SHIPPING_COST).toLocaleString()} تومان
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !selectedAddress}
                sx={{
                  bgcolor: "#3F3F3F",
                  py: 2,
                  borderRadius: "15px",
                  fontWeight: "bold",
                }}
              >
                {isPlacingOrder ? "در حال ثبت..." : "ثبت و پرداخت نهایی"}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
