// containers/MainSliderContainer.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMainSlider } from "../../../redux/slices/mainSliderSlice";
import SwiperWrapper from "../../Swiper/SwiperWrapper";
import MainSlide from "./MainSlider";
import { Navigation, Pagination } from "swiper/modules";

const MainSliderContainer = () => {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.mainSlider.items);

  useEffect(() => {
    dispatch(fetchMainSlider());
  }, [dispatch]);

  const STRAPI_URL = (
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000"
  ).replace(/\/+$/, "");

  const options = {
    slidesPerView: 1,
    loop: true,
    navigation: true,
    pagination: { clickable: true },
    speed: 600,
  };

  return (
    <SwiperWrapper
      items={items}
      renderItem={(item) => <MainSlide item={item} strapiUrl={STRAPI_URL} />}
      swiperOptions={options}
      modules={[Navigation, Pagination]}
      className="main-swiper"
    />
  );
};

export default MainSliderContainer;
