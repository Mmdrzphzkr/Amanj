// مسیر فایل: src/redux/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],      // لیست محصولات: { id, title, price, quantity, image, totalPrice }
  totalAmount: 0, // قیمت کل
  totalCount: 0,  // تعداد کل آیتم‌ها (جمع quantity)
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 1. افزودن یا افزایش تعداد محصول
    addItem: (state, action) => {
      const newItem = action.payload;
      // مطمئن می‌شویم که newItem.price یک عدد است
      const itemPrice = parseFloat(newItem.price); 
      
      const existingItem = state.items.find((item) => item.id === newItem.id);

      state.totalCount++;
      
      if (!existingItem) {
        // محصول جدید
        state.items.push({
          id: newItem.id,
          title: newItem.title,
          price: itemPrice,
          image: newItem.image,
          quantity: 1,
          totalPrice: itemPrice,
        });
        state.totalAmount += itemPrice;
      } else {
        // محصول تکراری
        existingItem.quantity++;
        existingItem.totalPrice += itemPrice;
        state.totalAmount += itemPrice;
      }
    },

    // 2. کم کردن تعداد محصول
    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.totalCount--;
        const itemPrice = existingItem.price;

        state.totalAmount -= itemPrice;

        if (existingItem.quantity === 1) {
          // اگر تعداد به صفر رسید، کلاً حذف شود
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          // در غیر این صورت فقط یکی کم شود
          existingItem.quantity--;
          existingItem.totalPrice -= itemPrice;
        }
      }
    },

    // 3. حذف کامل یک آیتم (مخصوصاً در صفحه سبد خرید)
    deleteItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      
      if (existingItem) {
        state.totalCount -= existingItem.quantity;
        state.totalAmount -= existingItem.totalPrice;
        state.items = state.items.filter((item) => item.id !== id);
      }
    },
    
    // 4. خالی کردن کل سبد (بعد از پرداخت موفق)
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalCount = 0;
    },
    
    // 5. بازخوانی استیت از کوکی
    setCartFromCookie: (state, action) => {
      if (action.payload) {
        const { items, totalAmount, totalCount } = action.payload;
        state.items = items;
        state.totalAmount = totalAmount;
        state.totalCount = totalCount;
      }
    }
  },
});

export const { addItem, removeItem, deleteItem, clearCart, setCartFromCookie } = cartSlice.actions;
export default cartSlice.reducer;