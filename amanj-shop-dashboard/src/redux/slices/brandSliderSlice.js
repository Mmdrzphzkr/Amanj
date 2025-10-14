import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStrapiData } from "@/lib/strapi-frontend";

export const fetchbrandSlider = createAsyncThunk(
  "brandSlider/fetchbrandSlider",
  async () => await fetchStrapiData("/api/brand-sliders?populate=*")
);

const brandSliderSlice = createSlice({
  name: "brandSlider",
  initialState: { items: [], status: "idle", error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchbrandSlider.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchbrandSlider.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchbrandSlider.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default brandSliderSlice.reducer;
