import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStrapiData } from "@/lib/strapi-frontend";

export const fetchHeaders = createAsyncThunk(
  "headers/fetchHeaders",
  async () => await fetchStrapiData("/api/headers")
);

const headersSlice = createSlice({
  name: "headers",
  initialState: { items: [], status: "idle", error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeaders.pending, (state) => { state.status = "loading"; })
      .addCase(fetchHeaders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchHeaders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default headersSlice.reducer;