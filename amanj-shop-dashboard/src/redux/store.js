import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productSlice";
import headersReducer from "./slices/headerSlice";
import mainSliderReducer from "./slices/mainSliderSlice";
import brandSliderReducer from "./slices/brandSliderSlice";
import publicGalleryReducer from "./slices/publicGallerySlice";
import BottomSliderReducer from "./slices/bottomSliderSlice";
import FaqAccordionReducer from "./slices/faqAccordionSlice";
import CategoryReducer from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    headers: headersReducer,
    mainSlider: mainSliderReducer,
    brandSlider: brandSliderReducer,
    publicGallery: publicGalleryReducer,
    bottomSlider: BottomSliderReducer,
    faqAccordion: FaqAccordionReducer,
    categories: CategoryReducer,
  },
});
