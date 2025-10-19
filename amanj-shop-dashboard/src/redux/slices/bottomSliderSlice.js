import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStrapiData } from "@/lib/strapi-frontend";

export const fetchBottomSlider = createAsyncThunk(
  "bottomSlider/fetchBottomSlider",
  async () => await fetchStrapiData("/api/bottom-sliders?populate=*")
);

const bottomSliderSlice = createSlice({
  name: "bottomSlider",
  initialState: { items: [], status: "idle", error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBottomSlider.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBottomSlider.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchBottomSlider.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default bottomSliderSlice.reducer;
