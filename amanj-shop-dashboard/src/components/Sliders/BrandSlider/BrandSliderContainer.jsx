// containers/BrandSliderContainer.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrandSlider } from "../../../redux/slices/brandSliderSlice";
import SwiperWrapper from "../../Swiper/SwiperWrapper";
import BrandSlide from "./BrandSlider";
import { Autoplay, Navigation } from "swiper/modules";

const ImageSlide = ({ img, strapiUrl }) => {
  const src = `${strapiUrl}${img.url?.startsWith("/") ? "" : "/"}${
    img.url || ""
  }`;
  return (
    <div className="flex items-center justify-center py-6">
      <img
        src={src}
        alt={img.alternativeText || img.name || "brand image"}
        className="object-contain max-h-40"
        loading="lazy"
        width={img.width || 300}
        height={img.height || 120}
      />
    </div>
  );
};

const BrandSliderContainer = () => {
  const dispatch = useDispatch();
  const brands = useSelector((s) => s.brandSlider.items || []);

  useEffect(() => {
    dispatch(fetchBrandSlider());
  }, [dispatch]);

  const STRAPI_URL = (
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000"
  ).replace(/\/+$/, "");

  // Flatten کردن: همه تصاویر از همه برندها را در یک آرایه قرار می‌دهیم
  const allImages = (brands || []).flatMap((brand) =>
    (brand.images || []).map((img) => ({
      ...img,
      brandName: brand.name ?? null,
    }))
  );

  // debug مفید: باز کردن console و چک کن که تعداد تصاویر چنده
  // console.log(
  //   "brands length:",
  //   brands.length,
  //   "allImages length:",
  //   allImages.length
  // );

  const options = {
    slidesPerView: 2, // چند اسلاید در نما؛ تنظیم کن مطابق نیاز (یا responsive بگذار)
    spaceBetween: 24,
    loop: allImages.length > 1, // فقط اگر بیش از یک تصویر داریم loop بذار
    autoplay:
      allImages.length > 1
        ? { delay: 2500, disableOnInteraction: false }
        : false,
    speed: 600,
    breakpoints: {
      640: { slidesPerView: 3 },
      1024: { slidesPerView: 6 },
    },
  };

  return (
    <div className="brand-slider-container">
      <SwiperWrapper
        items={allImages}
        renderItem={(img) => <ImageSlide img={img} strapiUrl={STRAPI_URL} />}
        swiperOptions={options}
        modules={[Autoplay, Navigation]}
        className="brand-swiper"
      />
    </div>
  );
};

export default BrandSliderContainer;
