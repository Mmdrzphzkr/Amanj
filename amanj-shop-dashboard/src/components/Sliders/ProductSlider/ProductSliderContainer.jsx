// containers/ProductSliderContainer.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../redux/slices/productSlice";
import SwiperWrapper from "../../Swiper/SwiperWrapper";
import { Autoplay, Navigation } from "swiper/modules";
import Link from "next/link";
import ProductCard from "../../ProdcutCard/ProductCard";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const ProductSliderContainer = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items || []);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const STRAPI_URL = (
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000"
  ).replace(/\/+$/, "");

  // 🧠 نکته مهم: width کانتینر نباید محدود باشد
  const options = {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: products.length > 4,
    autoplay:
      products.length > 1
        ? { delay: 2500, disableOnInteraction: false }
        : false,
    navigation: true,
    speed: 600,
    breakpoints: {
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 }, // ✅ نمایش ۴ محصول در دسکتاپ
    },
  };

  return (
    // ❌ اصلاح: حذف px-4 از کانتینر بیرونی برای جلوگیری از تداخل با سوایپر
    <div className="product-slider-container w-full h-full">
      <SwiperWrapper
        items={products}
        renderItem={(product) => (
          // ✅ اصلاح: حذف div والد اضافی و اضافه کردن w-full برای اطمینان از انعطاف Link
          <Link
            href={`/products/${product.slug}`}
            className="inline-block" // w-full برای اطمینان از پر کردن SwiperSlide
          >
            <ProductCard product={product} strapiUrl={STRAPI_URL} />
          </Link>
        )}
        swiperOptions={options}
        modules={[Autoplay, Navigation]}
        className="product-swiper !p-5"
      />
    </div>
  );
};

export default ProductSliderContainer;
