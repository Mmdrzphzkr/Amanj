// components/slides/MainSlide.jsx
import React from "react";

const BottomSlide = ({ item, strapiUrl }) => {
  const img = item?.image ?? {};
  const src = `${strapiUrl}${img.url?.startsWith("/") ? "" : "/"}${
    img.url || ""
  }`;
  return (
    <>
      <img
        src={src}
        alt={img.alternativeText || img.name || "main slide"}
        className="w-full h-auto"
        width={img.width || 1440}
        height={img.height || 825}
        loading="lazy"
      />

      {/* در صورت نیاز overlay محتوا */}
      {item?.body && (
        <div className="bottom-slider__rich-text pointer-events-auto">
          <div
            dangerouslySetInnerHTML={{
              __html: Array.isArray(item.body)
                ? item.body
                    .flatMap((p) => p.children || [])
                    .map((c) => c.text || "")
                    .join("")
                : "",
            }}
          />
        </div>
      )}
    </>
  );
};

export default BottomSlide;
