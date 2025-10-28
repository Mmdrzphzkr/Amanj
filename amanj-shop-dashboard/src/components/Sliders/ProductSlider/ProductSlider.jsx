// components/slides/BrandSlide.jsx
import React from "react";
import './ProductSlider.css';
const ProductSlide = ({ brand, strapiUrl }) => {
  return (
    <div className="w-[190px] h-[60px]">
      {brand.images?.map((img) => {
        const src = `${strapiUrl}${img.url?.startsWith("/") ? "" : "/"}${
          img.url || ""
        }`;
        return (
          <img
            key={img.id}
            src={src}
            alt={img.alternativeText || img.name || "brand"}
            className="w-full h-auto object-cover"
            width={190}
            height={66}
            loading="lazy"
          />
        );
      })}
    </div>
  );
};

export default ProductSlide;
