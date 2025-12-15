"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import Cookies from "js-cookie"; // برای خواندن کوکی سمت کلاینت
import { setCartFromCookie } from "./slices/cartSlice";

// این کامپوننت وظیفه دارد کوکی سبد خرید را بخواند و به ریداکس بفرستد
const CartInitializer = ({ children }) => {
  useEffect(() => {
    // کوکی سبد خرید را بخوان
    const cartData = Cookies.get("amanj_shop_cart");

    if (cartData) {
      try {
        const parsedData = JSON.parse(cartData);
        // Dispatch اکشن برای پر کردن استیت ریداکس
        store.dispatch(setCartFromCookie(parsedData));
      } catch (error) {
        console.error("خطا در بازخوانی سبد خرید از کوکی:", error);
      }
    }
  }, []);

  return children;
};

export default function StoreProvider({ children }) {
  return (
    <Provider store={store}>
      <CartInitializer>
        {children}
      </CartInitializer>
    </Provider>
  );
}