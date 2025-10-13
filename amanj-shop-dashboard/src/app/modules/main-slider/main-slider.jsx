import React from "react";
import { fetchMainSlider } from "../../../redux/slices/mainSliderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const MainSlider = () => {
  const dispatch = useDispatch();
  const mainSlider = useSelector((state) => state.mainSlider.items);
  console.log(mainSlider);
  useEffect(() => {
    dispatch(fetchMainSlider());
  }, [dispatch]);

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000";
  return (
    <>
      <div className="main-slider">
        <img
          src={`${STRAPI_URL}/uploads/main-slider.webp`}
          alt="main-slider-image"
          width={1440}
          height={525}
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </>
  );
};

export default MainSlider;
