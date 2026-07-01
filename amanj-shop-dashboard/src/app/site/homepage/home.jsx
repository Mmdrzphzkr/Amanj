"use client";

import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

import Header from "@/components/Header/Header";
import MainSliderContainer from "@/components/Sliders/MainSlider/MainSliderContainer";
import BrandSliderContainer from "@/components/Sliders/BrandSlider/BrandSliderContainer";
import BottomSliderContainer from "@/components/Sliders/BottomSlider/BottomSliderContainer";
import ProductSliderContainer from "@/components/Sliders/ProductSlider/ProductSliderContainer";
import FaqAccordion from "@/components/Accordion/FaqAccordion";
import Footer from "@/components/Footer/Footer";
import MobileNav from "@/components/MobileNav/MobileNav";

import { fetchPublicGallery } from "@/redux/slices/publicGallerySlice";
import useReveal from "@/hooks/useReveal";
import { StarIcon, HeartIcon, CommentIcon, QuestionIcon } from "@/components/Icons/Icons";

const HomePage = () => {
  const dispatch = useDispatch();
  const publicGallery = useSelector((s) => s.publicGallery.items || []);

  const STRAPI_URL = (
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000"
  ).replace(/\/+$/, "");

  useEffect(() => {
    dispatch(fetchPublicGallery());
  }, [dispatch]);

  const [sec1Ref, sec1Visible] = useReveal();
  const [sec2Ref, sec2Visible] = useReveal();
  const [sec3Ref, sec3Visible] = useReveal();

  // ✅ تابع کمکی برای پیدا کردن عکس بر اساس نام
  const getImageByFileName = useCallback((fileName) => {
    // پیدا کردن آیتمی که نام فایل آن با fileName مطابقت داشته باشد
    const item = publicGallery.find((item) => {
      const imageName = item?.image?.name || "";
      // حذف پسوند و مقایسه
      const nameWithoutExt = imageName.replace(/\.[^.]+$/, "");
      return nameWithoutExt === fileName;
    });

    if (item?.image?.url) {
      return `${STRAPI_URL}${item.image.url}`;
    }
    
    // اگر عکسی پیدا نشد، یک placeholder برگردان
    return "";
  }, [publicGallery, STRAPI_URL]);

  // همچنین می‌توانید برای alternativeText هم جستجو کنید
  const getImageByAltText = useCallback((altText) => {
    const item = publicGallery.find((item) => {
      const itemAltText = item?.image?.alternativeText || "";
      return itemAltText === altText;
    });

    if (item?.image?.url) {
      return `${STRAPI_URL}${item.image.url}`;
    }
    return "";
  }, [publicGallery, STRAPI_URL]);

  return (
    <main>
      <Header />

      <MainSliderContainer />

      <div className="bg-[#EDE9DE] h-[115px]">
        <BrandSliderContainer />
      </div>

      {/* SECTION 1 - مزیت‌ها */}
      <section
        ref={sec1Ref}
        className={`section__one transition-all duration-700 ${
          sec1Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto p-4">
          {/* HEADER with SVG */}
          <div className="section__header flex flex-col items-center justify-center mb-[30px] mt-[50px] md:mt-[132px]">
            <div className="container__svg">
              <StarIcon />
            </div>
            <p className="text-xl md:text-3xl font-bold mt-3">
              مزیت هایی که مارا متمایز می کنند
            </p>
          </div>

          {/* GRID - First Row */}
          <div className="flex flex-col justify-center items-center garatee-box__container">
            <div className="grid grid-cols-1 gap-5 items-center w-full mb-6 md:grid-cols-12 md:gap-5">
              {/* Card 1 - پشتیبانی ۲۴ ساعته */}
              <div className="garantee-box flex flex-col justify-between items-center p-4 bg-white rounded-[40px] flex-1 h-[361px] md:col-span-5">
                <div className="relative w-full h-[253px]">
                  <Image
                    src={getImageByFileName("Poshtibani") || "/placeholder.jpg"}
                    alt="پشتیبانی ۲۴ ساعته"
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover rounded-xl"
                    unoptimized={true}
                  />
                </div>
                <p className="garantee-box-title text-2xl font-bold">
                  پشتیبانی ۲۴ ساعته
                </p>
                <p className="garantee-box-description text-[#696969] text-lg">
                  همیشه آماده پاسخگویی به سوالات و نیازهای شما
                </p>
              </div>

              {/* Card 2 - تعمیر تخصصی */}
              <div className="garantee-box flex flex-col justify-between items-center p-4 bg-white rounded-[40px] flex-1 h-[361px] md:col-span-7">
                <div className="relative w-full h-[253px]">
                  <Image
                    src={getImageByFileName("Tatilat") || "/placeholder.jpg"}
                    alt="تعمیر تخصصی با قطعات اورجینال"
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover rounded-xl"
                    unoptimized={true}
                  />
                </div>
                <p className="garantee-box-title text-2xl font-bold">
                  تعمیر تخصصی با قطعات اورجینال
                </p>
                <p className="garantee-box-description text-[#696969] text-lg">
                  تعمیر توسط تکنسین‌های حرفه‌ای با قطعات اصلی
                </p>
              </div>
            </div>

            {/* GRID - Second Row */}
            <div className="grid grid-cols-1 gap-6 items-center w-full md:grid-cols-12 md:gap-6">
              {/* Card 3 - اصالت کالا */}
              <div className="garantee-box flex flex-col justify-between items-center p-4 bg-white rounded-[40px] flex-1 h-[361px] md:col-span-4">
                <div className="relative w-full h-[253px]">
                  <Image
                    src={getImageByFileName("Asalat") || "/placeholder.jpg"}
                    alt="اصالت کالا"
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover rounded-xl"
                    unoptimized={true}
                  />
                </div>
                <p className="garantee-box-title text-2xl font-bold">
                  اصالت کالا
                </p>
                <p className="garantee-box-description text-[#696969] text-lg">
                  تمام محصولات با تضمین اورجینال بودن
                </p>
              </div>

              {/* Card 4 - ضمانت قیمت و کیفیت */}
              <div className="garantee-box flex flex-col justify-between items-center p-4 bg-white rounded-[40px] flex-1 h-[361px] md:col-span-4">
                <div className="relative w-full h-[253px]">
                  <Image
                    src={getImageByFileName("Zemanat") || "/placeholder.jpg"}
                    alt="ضمانت قیمت و کیفیت"
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover rounded-xl"
                    unoptimized={true}
                  />
                </div>
                <p className="garantee-box-title text-2xl font-bold">
                  ضمانت قیمت و کیفیت
                </p>
                <p className="garantee-box-description text-[#696969] text-lg">
                  بهترین کیفیت با منصفانه‌ترین قیمت بازار
                </p>
              </div>

              {/* Card 5 - گارانتی */}
              <div className="garantee-box flex flex-col justify-between items-center p-4 bg-white rounded-[40px] flex-1 h-[361px] md:col-span-4">
                <div className="relative w-full h-[253px]">
                  <Image
                    src={getImageByFileName("Garanti") || "/placeholder.jpg"}
                    alt="گارانتی"
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover rounded-xl"
                    unoptimized={true}
                  />
                </div>
                <p className="garantee-box-title text-2xl font-bold">گارانتی</p>
                <p className="garantee-box-description text-[#696969] text-lg">
                  اطمینان خاطر از خرید با ضمانت معتبر
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - محصولات پر فروش */}
      <section
        ref={sec2Ref}
        className={`section__two transition-all duration-700 ${
          sec2Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto p-4">
          <div className="section__header flex flex-col items-center justify-center mb-[30px] mt-[50px] md:mt-[103px]">
            <div className="container__svg">
              <HeartIcon />
            </div>
            <p className="text-xl md:text-3xl font-bold mt-3">محصولات پر فروش</p>
          </div>
          <ProductSliderContainer />
        </div>
      </section>

      {/* SECTION 3 - نظرات مشتریان */}
      <section
        ref={sec3Ref}
        className={`section__three transition-all duration-700 ${
          sec3Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto p-4">
          <div className="section__header flex flex-col items-center justify-center mb-[30px] mt-[50px] md:mt-[103px]">
            <div className="container__svg">
              <CommentIcon />
            </div>
            <p className="text-xl md:text-3xl font-bold mt-3">نظرات مشتریان</p>
          </div>
          <div className="text-lg font-bold text-black text-center">
            Comming Soon
          </div>
        </div>
      </section>

      {/* SECTION 4 - اسلایدر پایین */}
      <section className="section__four pt-[154px]">
        <div className="container mx-auto p-4">
          <BottomSliderContainer />
        </div>
      </section>

      {/* SECTION 5 - سوالات متداول */}
      <section className="section__five">
        <div className="container mx-auto p-4">
          <div className="section__header flex flex-col items-center justify-center mb-[30px] mt-[50px] md:mt-[103px]">
            <div className="container__svg">
              <QuestionIcon />
            </div>
            <p className="text-xl md:text-3xl font-bold mt-3">سوالات متداول</p>
          </div>
          <FaqAccordion />
        </div>
      </section>

      <MobileNav />
      <Footer />
    </main>
  );
};

export default HomePage;