import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productSlice";
import headersReducer from "./slices/headerSlice";
import mainSliderReducer from "./slices/mainSliderSlice";
import brandSliderReducer from "./slices/brandSliderSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    headers: headersReducer,
    mainSlider: mainSliderReducer,
    brandSlider: brandSliderReducer,
  },
});
