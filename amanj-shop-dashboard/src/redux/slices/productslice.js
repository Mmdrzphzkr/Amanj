import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStrapiData } from "@/lib/strapi-frontend";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => await fetchStrapiData("/api/products?populate=*")
);

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = "loading"; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;