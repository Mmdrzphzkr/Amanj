// orderSlice.js (فایل فرضی)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStrapiData } from "@/lib/strapi-frontend";

// 1. تعریف Async Thunk
export const submitOrder = createAsyncThunk(
  "order/submit",
  async (orderData, { rejectWithValue }) => {
    try {
      // Validate mobile number
      const mobileRegex = /^09\d{9}$/;
      if (!mobileRegex.test(orderData.data.mobile)) {
        return rejectWithValue({
          message: "شماره موبایل معتبر نیست. مثال: 09123456789",
        });
      }

      // Validate and convert quantity
      const quantity = parseInt(orderData.data.quantity);
      if (isNaN(quantity) || quantity < 1) {
        return rejectWithValue({
          message: "تعداد باید عددی بزرگتر از صفر باشد",
        });
      }

      const response = await fetchStrapiData("/api/place-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            name: orderData.data.name,
            family: orderData.data.family,
            mobile: orderData.data.mobile,
            quantity: quantity, // ارسال به صورت عدد
            description: orderData.data.description || "",
            productId: parseInt(orderData.data.productId),
          },
        }),
      });

      if (!response) {
        throw new Error("خطا در ارتباط با سرور");
      }

      console.log("Order submitted successfully:", response);
      return response;
    } catch (error) {
      console.error("Submit order error:", error);
      return rejectWithValue({
        message: error.message || "خطا در ثبت سفارش",
      });
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitOrder.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
