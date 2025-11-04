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
      480: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 }, // ✅ نمایش ۴ محصول در دسکتاپ
    },
  };

  return (
    <div className="product-slider-container w-full max-w-[1400px] mx-auto px-4">
      <SwiperWrapper
        items={products}
        renderItem={(product) => (
          <div className="w-full h-full flex items-center justify-center">
            <Link
              href={`/products/${product.slug}`}
              className="block w-full h-full p-1"
            >
              <ProductCard product={product} strapiUrl={STRAPI_URL} />
            </Link>
          </div>
        )}
        swiperOptions={options}
        modules={[Autoplay, Navigation]}
        className="product-swiper w-full"
      />
    </div>
  );
};

export default ProductSliderContainer;
