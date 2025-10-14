import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMainSlider } from "../../../redux/slices/mainSliderSlice";
import "./main-slider.css";

const MainSlider = () => {
  const dispatch = useDispatch();
  const mainSliderImages = useSelector((state) => state.mainSlider.items);

  useEffect(() => {
    dispatch(fetchMainSlider());
  }, [dispatch]);

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000";

  /**
   * Function to extract and combine the inner HTML text from the body array.
   */
  const renderBodyContent = (body) => {
    if (!body || !Array.isArray(body)) return { __html: "" };

    const contentHtml = body
      .flatMap((paragraph) => paragraph.children || [])
      .map((child) => (child.code && child.text ? child.text : ""))
      .join("");

    return { __html: contentHtml };
  };

  return (
    <>
      {mainSliderImages?.map((mainSliderImage, index) => (
        // The container needs to be relative to hold the image and overlay
        <div className="main-slider relative" key={mainSliderImage.id}>
          {/* Image element */}
          <img
            className="w-full h-auto"
            src={`${STRAPI_URL}${mainSliderImage.image.url}`}
            alt={mainSliderImage.image.alternativeText || "main slider image"}
            width={1440}
            height={525}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "low"}
          />

          {/* Overlay Content Container - positioned absolutely */}
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 10 }}
          >
            {/* This is the Grid container.
              - It is set to grid and covers the whole parent overlay (w-full h-full).
              - The column/row template is set up to position the content precisely.
            */}
            <div className="grid w-full h-full">
              {/* This is the content box itself.
                The positioning is achieved by using custom CSS Grid properties via the style prop:
                1. grid-row: The body starts at row 2 and spans 1 row. This creates a 190px gap above it.
                2. grid-column: The body starts at column 1 and spans 1 column. This pushes it to the left side of its grid area.
                3. margin-right: Pushes the content 160px from the right edge of its grid area.
              */}
              <div className="slider-content-overlay place-self-start pointer-events-auto">
                <div
                  // WARNING: Use with caution!
                  dangerouslySetInnerHTML={renderBodyContent(
                    mainSliderImage.body
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MainSlider;
