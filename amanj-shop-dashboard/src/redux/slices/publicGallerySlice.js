import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStrapiData } from "@/lib/strapi-frontend";

export const fetchPublicGallery = createAsyncThunk(
  "publicGallery/fetchPublicGallery",
  async () => await fetchStrapiData("/api/public-galleries?populate=*")
);

const publicGallerySlice = createSlice({
  name: "publicGallery",
  initialState: { items: [], status: "idle", error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicGallery.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPublicGallery.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPublicGallery.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default publicGallerySlice.reducer;
