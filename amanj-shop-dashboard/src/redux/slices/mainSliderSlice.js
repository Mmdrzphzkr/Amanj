import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStrapiData } from "@/lib/strapi-frontend";

export const fetchMainSlider = createAsyncThunk(
  "mainSlider/fetchMainSlider",
  async () => await fetchStrapiData("/api/main-slider")
);

const mainSliderSlice = createSlice({
  name: "mainSlider",
  initialState: { items: [], status: "idle", error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMainSlider.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMainSlider.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMainSlider.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default mainSliderSlice.reducer;
