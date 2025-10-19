// containers/MainSliderContainer.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBottomSlider } from "../../../redux/slices/bottomSliderSlice";
import SwiperWrapper from "../../Swiper/SwiperWrapper";
import BottomSlide from "./BottomSlider";
import { Navigation, Pagination } from "swiper/modules";

const BottomSliderContainer = () => {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.bottomSlider.items);
  console.log(items, "bottom slider items");
  useEffect(() => {
    dispatch(fetchBottomSlider());
  }, [dispatch]);

  const STRAPI_URL = (
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000"
  ).replace(/\/+$/, "");

  const options = {
    slidesPerView: 1,
    loop: true,
    navigation: true,
    pagination: { clickable: true },
    autoplay: true,
    speed: 600,
  };

  return (
    <SwiperWrapper
      items={items}
      renderItem={(item) => <BottomSlide item={item} strapiUrl={STRAPI_URL} />}
      swiperOptions={options}
      modules={[Navigation, Pagination]}
      className="bottom-swiper"
    />
  );
};

export default BottomSliderContainer;
