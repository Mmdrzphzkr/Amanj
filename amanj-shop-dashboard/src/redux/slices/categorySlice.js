import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStrapiData } from "@/lib/strapi-frontend";

export const fetchCategory = createAsyncThunk(
  "products/fetchCategory",
  async () => await fetchStrapiData("/api/product-categories?populate=*")
);

const categorySlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
