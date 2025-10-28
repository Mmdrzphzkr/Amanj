import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStrapiData } from "@/lib/strapi-frontend";

export const fetchFaqAccordion = createAsyncThunk(
  "faqAccordion/fetchFaqAccordion",
  async () => await fetchStrapiData("/api/faq-accordions?populate=*")
);

const faqAccordionSlice = createSlice({
  name: "faqAccordion",
  initialState: { items: [], status: "idle", error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqAccordion.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFaqAccordion.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFaqAccordion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default faqAccordionSlice.reducer;
