import Cookies from "js-cookie";

export const cartMiddleware = (store) => (next) => (action) => {
  // اجازه می‌دهیم اکشن در ریداکس اجرا شود
  const result = next(action);

  // اگر اکشن مربوط به سبد خرید بود
  if (action.type.startsWith("cart/")) {
    // وضعیت جدید سبد خرید را از استور می‌گیریم
    const cartState = store.getState().cart;
    
    // ذخیره در کوکی (به صورت JSON). این کوکی در سمت کلاینت خوانده می‌شود.
    // expires: 7 روز انقضا
    Cookies.set("amanj_shop_cart", JSON.stringify(cartState), { expires: 7 });
  }

  return result;
};