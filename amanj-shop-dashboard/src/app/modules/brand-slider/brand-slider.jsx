import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrandSlider } from "../../../redux/slices/brandSliderSlice";
import "./brand-slider.css";

const BrandSlider = () => {
  const dispatch = useDispatch();
  const brandSliderImages = useSelector((state) => state.brandSlider.items);
    console.log(brandSliderImages);
  useEffect(() => {
    dispatch(fetchBrandSlider());
  }, [dispatch]);

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000";

  return (
    <>
      {brandSliderImages?.map((brandSliderImage, index) => (
        // The container needs to be relative to hold the image and overlay
        <div className="main-slider relative" key={brandSliderImage.id}>
          {/* Image element */}
          <img
            className="w-full h-auto"
            src={`${STRAPI_URL}${brandSliderImage.image.url}`}
            alt={brandSliderImage.image.alternativeText || "brand slider image"}
            width={957}
            height={302}
            loading="lazy"
            fetchPriority="low"
          />
        </div>
      ))}
    </>
  );
};

export default BrandSlider;
