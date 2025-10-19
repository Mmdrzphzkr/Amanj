// components/Swiper/SwiperWrapper.jsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

const SwiperWrapper = ({ items = [], renderItem, swiperOptions = {}, modules = [], className = "" }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  if (!renderItem) {
    console.warn("SwiperWrapper: renderItem prop is required.");
    return null;
  }
  if (!items || items.length === 0) return null;

  return (
    <>
      {isClient ? (
        <Swiper modules={modules} {...swiperOptions} className={className}>
          {items.map((item, idx) => (
            <SwiperSlide className="relative" key={(item.id ?? idx) + "-slide-" + idx}>
              {renderItem(item, idx)}
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="static-swiper-fallback">{renderItem(items[0], 0)}</div>
      )}
    </>
  );
};

export default SwiperWrapper;
