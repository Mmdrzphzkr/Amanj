// components/slides/MainSlide.jsx
import React from "react";

const MainSlide = ({ item, strapiUrl }) => {
  const img = item?.image ?? {};
  const src = `${strapiUrl}${img.url?.startsWith("/") ? "" : "/"}${
    img.url || ""
  }`;
  return (
    <>
      <img
        src={src}
        alt={img.alternativeText || img.name || "main slide"}
        className="w-full h-auto object-cover"
        width={img.width || 1440}
        height={img.height || 825}
        loading="eager"
        fetchPriority="high"
      />

      {/* در صورت نیاز overlay محتوا */}
      {item?.body && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="slider-content-overlay pointer-events-auto">
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
        </div>
      )}
    </>
  );
};

export default MainSlide;
