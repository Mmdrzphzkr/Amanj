import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productslice";
import headersReducer from "./slices/headerslice";
import mainSliderReducer from "./slices/mainSliderSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    headers: headersReducer,
    mainSlider: mainSliderReducer,
  },
});
