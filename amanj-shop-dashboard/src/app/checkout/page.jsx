// src/app/checkout/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/redux/slices/cartSlice"; // برای خالی کردن سبد بعد از خرید

export default function CheckoutPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  
  // اطلاعات سبد خرید از Redux
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  
  // وضعیت‌های لوکال برای Checkout
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingMethod, setShippingMethod] = useState("پست پیشتاز");
  const [paymentMethod, setPaymentMethod] = useState("card_to_card");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const SHIPPING_COST = 30000; // هزینه ارسال ثابت (به ریال/تومان)

  // 1. بررسی لاگین و سبد خرید (Auth Guard & Cart Guard)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // اگر لاگین نیست، به صفحه لاگین ریدایرکت شود (آدرس فعلی برای بازگشت ذخیره می‌شود)
      router.push(`/login?callbackUrl=/checkout`);
    }

    if (!authLoading && isAuthenticated && cartItems.length === 0) {
        // اگر سبد خرید خالی است
        router.push('/cart');
    }
  }, [isAuthenticated, authLoading, router, cartItems.length]);

  // 2. فچ کردن آدرس‌های کاربر
  useEffect(() => {
    if (isAuthenticated) {
      const fetchAddresses = async () => {
        try {
          // استفاده از API Route محلی که توکن را از کوکی می‌خواند
          const res = await fetch("/api/user/addresses"); 
          if (res.ok) {
            const data = await res.json();
            setAddresses(data);
            // انتخاب آدرس پیش‌فرض (مثلا اولین آدرس)
            if (data.length > 0) {
              setSelectedAddress(data[0]);
            }
          }
        } catch (error) {
          console.error("خطا در فچ کردن آدرس‌ها:", error);
        }
      };
      fetchAddresses();
    }
  }, [isAuthenticated]);
  
  // اگر در حال لودینگ احراز هویت هستیم، چیزی نشان نمی‌دهیم
  if (authLoading || !isAuthenticated || cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        در حال هدایت به صفحه لاگین/سبد خرید...
      </div>
    );
  }

  // 3. تابع نهایی ثبت سفارش
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("لطفاً یک آدرس برای ارسال انتخاب کنید.");
      return;
    }
    
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
    
    // تهیه اسنپ‌شات از محصولات سبد خرید برای ذخیره در سفارش
    const itemsSnapshot = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price_at_time_of_order: item.price,
        title: item.title
    }));

    const finalOrderData = {
      // داده‌های مورد نیاز مدل Order در Strapi
      data: {
        totalAmount: totalAmount + SHIPPING_COST,
        status: "pending_payment", // وضعیت اولیه
        paymentMethod: paymentMethod,
        shippingMethod: shippingMethod,
        shippingCost: SHIPPING_COST,
        // رابطه کاربری (userId): چون کاربر لاگین است، Strapi خودش می‌تواند کاربر را ست کند. 
        // اگر لازم است، می‌توانید user.id را هم بفرستید.
        user: user.id, 
        
        // اسنپ‌شات‌ها (مهم برای عدم تغییر آدرس و قیمت)
        AddressSnapshot: JSON.stringify(selectedAddress.attributes), 
        OrderItems: JSON.stringify(itemsSnapshot), 
      }
    };

    try {
        // این درخواست باید به Strapi ارسال شود.
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // باید توکن JWT کاربر را برای ثبت سفارش ارسال کنیم
                'Authorization': `Bearer ${user.jwt}` // از user.jwt موجود در AuthContext استفاده می‌کنیم
            },
            body: JSON.stringify(finalOrderData),
        });

        if (res.ok) {
            const order = await res.json();
            alert("سفارش شما با موفقیت ثبت شد.");
            dispatch(clearCart()); // خالی کردن سبد خرید
            router.push(`/profile/orders/${order.data.id}`); // هدایت به صفحه جزییات سفارش
        } else {
            alert("خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.");
        }

    } catch (error) {
        console.error("Checkout submission error:", error);
        alert("خطای سیستمی در ثبت سفارش.");
    } finally {
        setIsPlacingOrder(false);
    }
  };


  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-8">
      
      {/* ستون راست: اطلاعات سفارش و پرداخت */}
      <div className="lg:w-1/3 order-1 lg:order-2">
        <div className="sticky top-4 p-6 bg-gray-50 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">خلاصه سفارش</h2>
          
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>جمع اقلام ({cartItems.length} کالا):</span>
              <span className="font-semibold">{totalAmount.toLocaleString()} تومان</span>
            </div>
            <div className="flex justify-between">
              <span>هزینه ارسال:</span>
              <span className="font-semibold">{SHIPPING_COST.toLocaleString()} تومان</span>
            </div>
          </div>
          
          <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-dashed">
            <span>مبلغ قابل پرداخت:</span>
            <span className="text-green-600">{(totalAmount + SHIPPING_COST).toLocaleString()} تومان</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || !selectedAddress}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isPlacingOrder ? "در حال ثبت سفارش..." : "تأیید و ثبت نهایی سفارش"}
          </button>

          {paymentMethod === 'card_to_card' && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-sm text-yellow-800">
                <p className="font-bold">روش پرداخت: کارت به کارت</p>
                <p>پس از ثبت سفارش، لطفاً مبلغ را به شماره کارت زیر واریز نمایید:</p>
                <p className="ltr text-center font-mono mt-1 select-all">**6037-99XX-XXXX-XXXX**</p>
                <p className="text-xs mt-1">پس از واریز، وضعیت سفارش شما توسط ادمین تایید خواهد شد.</p>
            </div>
          )}
          {paymentMethod === 'online' && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded text-sm text-red-800">
                <p className="font-bold">روش پرداخت: درگاه اینترنتی (غیرفعال)</p>
                <p>درگاه پرداخت فعال نیست. لطفاً از روش کارت به کارت استفاده کنید.</p>
            </div>
          )}

        </div>
      </div>

      {/* ستون چپ: آدرس و روش‌های ارسال */}
      <div className="lg:w-2/3 order-2 lg:order-1 space-y-8">
        
        {/* بخش ۱: انتخاب آدرس */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">۱. آدرس‌های ثبت‌شده</h2>
          {addresses.length === 0 ? (
            <div className="p-4 bg-yellow-50 rounded">
                شما هنوز آدرسی ثبت نکرده‌اید. لطفاً آدرس جدیدی اضافه کنید.
            </div>
            // اینجا باید یک Modal یا فرم برای افزودن آدرس جدید اضافه کنید
          ) : (
            <div className="grid gap-4">
              {addresses.map((addr) => (
                <div 
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAddress?.id === addr.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' : 'hover:border-gray-400 bg-white'
                  }`}
                >
                  <div className="font-bold">{addr.attributes.Title}</div>
                  <div className="text-sm text-gray-600">گیرنده: {addr.attributes.RecipientName} ({addr.attributes.RecipientPhone})</div>
                  <div className="text-sm mt-1">{addr.attributes.FullAddress}، {addr.attributes.City}</div>
                </div>
              ))}
              <button className="text-blue-500 hover:text-blue-600 text-sm mt-2">
                + افزودن آدرس جدید
              </button>
            </div>
          )}
        </div>

        {/* بخش ۲: روش ارسال */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">۲. روش ارسال</h2>
          {/* اینجا می‌توانید Radio Button برای روش‌های ارسال بگذارید */}
          <div className="p-4 border rounded-lg bg-white">
            <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
              <input
                type="radio"
                name="shipping"
                value="پست پیشتاز"
                checked={shippingMethod === "پست پیشتاز"}
                onChange={(e) => setShippingMethod(e.target.value)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="font-semibold">پست پیشتاز (۳ تا ۵ روز کاری) - {SHIPPING_COST.toLocaleString()} تومان</span>
            </label>
          </div>
        </div>

        {/* بخش ۳: روش پرداخت */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">۳. روش پرداخت</h2>
          <div className="space-y-3">
            <label className={`block p-4 border rounded-lg cursor-pointer ${paymentMethod === 'card_to_card' ? 'border-green-500 bg-green-50' : 'bg-white'}`}>
              <input
                type="radio"
                name="payment"
                value="card_to_card"
                checked={paymentMethod === "card_to_card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio h-4 w-4 text-green-600"
              />
              <span className="mr-3 font-semibold">کارت به کارت (پرداخت در خارج از سایت)</span>
            </label>
            
            <label className={`block p-4 border rounded-lg cursor-pointer ${paymentMethod === 'online' ? 'border-gray-300 bg-gray-100' : 'bg-white'}`}>
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                disabled // موقتاً غیرفعال
                className="form-radio h-4 w-4 text-gray-400"
              />
              <span className="mr-3 font-semibold text-gray-500">پرداخت اینترنتی (فعلاً غیرفعال)</span>
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}