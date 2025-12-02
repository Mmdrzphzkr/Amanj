"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Header from "@/components/Header/Header";
import MainSliderContainer from "@/components/Sliders/MainSlider/MainSliderContainer";
import BrandSliderContainer from "@/components/Sliders/BrandSlider/BrandSliderContainer";
import BottomSliderContainer from "@/components/Sliders/BottomSlider/BottomSliderContainer";
import ProductSliderContainer from "@/components/Sliders/ProductSlider/ProductSliderContainer";
import FaqAccordion from "@/components/Accordion/FaqAccordion";
import Footer from "@/components/Footer/Footer";
import { fetchPublicGallery } from "@/redux/slices/publicGallerySlice";

const HomePage = () => {
  const dispatch = useDispatch();

  const publicGallery = useSelector((s) => s.publicGallery.items || []);

   const STRAPI_URL = (
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000"
  ).replace(/\/+$/, "");

  useEffect(() => {
    dispatch(fetchPublicGallery());
  }, [dispatch]);

  return (
    <main className="">
      <Header />
      <MainSliderContainer />
      <div className="bg-[#EDE9DE] h-[115px]">
        <BrandSliderContainer />
      </div>
      <section className="flex gap-8 flex-wrap justify-center flex-col section__one">
        <div className="container mx-auto">
          <div className="section__header flex flex-col items-center justify-center mb-[30px] mt-[50px] md:mt-[132px]">
            <div className="container__svg">
              <svg
                width="61"
                height="61"
                viewBox="0 0 61 61"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_774_190)">
                  <rect
                    x="0.5"
                    y="0.635986"
                    width="60"
                    height="60"
                    rx="30"
                    fill="black"
                  />
                  <g filter="url(#filter0_f_774_190)">
                    <ellipse
                      cx="30.4999"
                      cy="30.636"
                      rx="27.2865"
                      ry="2.71758"
                      fill="url(#paint0_linear_774_190)"
                    />
                  </g>
                  <g filter="url(#filter1_f_774_190)">
                    <ellipse
                      cx="30.4999"
                      cy="30.636"
                      rx="27.2865"
                      ry="2.71758"
                      transform="rotate(55.2712 30.4999 30.636)"
                      fill="url(#paint1_linear_774_190)"
                    />
                  </g>
                  <g filter="url(#filter2_f_774_190)">
                    <ellipse
                      cx="30.5"
                      cy="30.636"
                      rx="27.2865"
                      ry="2.71758"
                      transform="rotate(117.612 30.5 30.636)"
                      fill="url(#paint2_linear_774_190)"
                    />
                  </g>

                  <g
                    style={{ mixBlendMode: "lighten" }}
                    opacity="0.19"
                    filter="url(#filter3_f_774_190)"
                  >
                    <ellipse
                      cx="30.4999"
                      cy="30.636"
                      rx="27.2865"
                      ry="2.71758"
                      fill="url(#paint3_linear_774_190)"
                    />
                  </g>
                  <g
                    style={{ mixBlendMode: "lighten" }}
                    opacity="0.19"
                    filter="url(#filter4_f_774_190)"
                  >
                    <ellipse
                      cx="30.4999"
                      cy="30.636"
                      rx="27.2865"
                      ry="2.71758"
                      transform="rotate(55.2712 30.4999 30.636)"
                      fill="url(#paint4_linear_774_190)"
                    />
                  </g>
                  <g
                    style={{ mixBlendMode: "lighten" }}
                    opacity="0.19"
                    filter="url(#filter5_f_774_190)"
                  >
                    <ellipse
                      cx="30.5"
                      cy="30.636"
                      rx="27.2865"
                      ry="2.71758"
                      transform="rotate(117.612 30.5 30.636)"
                      fill="url(#paint5_linear_774_190)"
                    />
                  </g>

                  <circle
                    opacity="0.55"
                    cx="43.2868"
                    cy="23.2864"
                    r="0.358093"
                    fill="#D9D9D9"
                  />
                  <circle
                    opacity="0.55"
                    cx="15.9644"
                    cy="32.7127"
                    r="0.358093"
                    transform="rotate(180 15.9644 32.7127)"
                    fill="#D9D9D9"
                  />
                  <ellipse
                    opacity="0.55"
                    cx="0.353023"
                    cy="0.331706"
                    rx="0.353023"
                    ry="0.331706"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 23.926 17.2417)"
                    fill="#D9D9D9"
                  />
                  <ellipse
                    opacity="0.55"
                    cx="0.353023"
                    cy="0.331706"
                    rx="0.353023"
                    ry="0.331706"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 35.3252 38.7574)"
                    fill="#D9D9D9"
                  />
                  <circle
                    opacity="0.55"
                    cx="34.5041"
                    cy="16.2779"
                    r="0.358093"
                    fill="#D9D9D9"
                  />
                  <circle
                    opacity="0.55"
                    cx="24.7474"
                    cy="39.7213"
                    r="0.358093"
                    transform="rotate(180 24.7474 39.7213)"
                    fill="#D9D9D9"
                  />
                  <ellipse
                    opacity="0.55"
                    cx="0.353023"
                    cy="0.331706"
                    rx="0.353023"
                    ry="0.331706"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 14.8394 22.4158)"
                    fill="#D9D9D9"
                  />
                  <ellipse
                    opacity="0.55"
                    cx="0.353023"
                    cy="0.331706"
                    rx="0.353023"
                    ry="0.331706"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 44.4119 33.5833)"
                    fill="#D9D9D9"
                  />
                  <circle cx="40.6991" cy="17.3995" r="0.159546" fill="#EDE9DE" />
                  <circle
                    cx="18.5521"
                    cy="38.5995"
                    r="0.159546"
                    transform="rotate(180 18.5521 38.5995)"
                    fill="#EDE9DE"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 18.3066 17.1115)"
                    fill="#EDE9DE"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 40.9446 38.8877)"
                    fill="#EDE9DE"
                  />
                  <circle cx="48.326" cy="22.1243" r="0.159546" fill="#EDE9DE" />
                  <circle
                    cx="10.9252"
                    cy="33.8749"
                    r="0.159546"
                    transform="rotate(180 10.9252 33.8749)"
                    fill="#EDE9DE"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 25.0645 12.0646)"
                    fill="#EDE9DE"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 34.187 43.9346)"
                    fill="#EDE9DE"
                  />
                  <circle cx="36.8519" cy="7.9502" r="0.159546" fill="#EDE9DE" />
                  <circle
                    cx="22.3995"
                    cy="48.049"
                    r="0.159546"
                    transform="rotate(180 22.3995 48.049)"
                    fill="#EDE9DE"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 9.01685 16.7839)"
                    fill="#EDE9DE"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 50.2344 39.2152)"
                    fill="#EDE9DE"
                  />

                  <path
                    d="M21.9541 29.433C21.6845 27.6539 21.5498 26.7644 21.7741 26.4386C21.9982 26.1131 22.3929 25.9502 22.7814 26.0227C23.1702 26.0954 23.7023 26.8209 24.7663 28.2719C25.3089 29.0117 25.5801 29.3816 25.8794 29.4828C26.1805 29.5847 26.5121 29.5373 26.7727 29.3551C27.0316 29.1741 27.1883 28.743 27.5019 27.8808L28.8084 24.288C29.4308 22.5764 29.742 21.7206 30.258 21.5919C30.4169 21.5523 30.5831 21.5523 30.742 21.5919C31.258 21.7206 31.5692 22.5764 32.1916 24.288L33.4981 27.8808C33.8117 28.743 33.9684 29.1741 34.2273 29.3551C34.4879 29.5373 34.8195 29.5847 35.1206 29.4828C35.4199 29.3816 35.6911 29.0117 36.2337 28.2719C37.2977 26.8209 37.8298 26.0954 38.2186 26.0227C38.6071 25.9502 39.0018 26.1131 39.2259 26.4386C39.4502 26.7644 39.3155 27.6539 39.0459 29.433L37.9637 36.5753C37.768 37.8671 37.6702 38.513 37.2857 38.9526C37.1609 39.0954 37.0163 39.2197 36.8564 39.3218C36.3642 39.636 35.7109 39.636 34.4044 39.636H26.5956C25.2891 39.636 24.6358 39.636 24.1436 39.3218C23.9837 39.2197 23.8391 39.0954 23.7143 38.9526C23.3298 38.513 23.232 37.8671 23.0363 36.5753L21.9541 29.433Z"
                    stroke="#EDE9DE"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M28.5 34.136C28.5 33.0314 29.3954 32.136 30.5 32.136C31.6046 32.136 32.5 33.0314 32.5 34.136C32.5 35.2406 31.6046 36.136 30.5 36.136C29.3954 36.136 28.5 35.2406 28.5 34.136Z"
                    stroke="#EDE9DE"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </g>

                <defs>
                  <filter
                    id="filter0_f_774_190"
                    x="-6.38662"
                    y="18.3185"
                    width="73.773"
                    height="24.6352"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="4.8"
                      result="effect1_foregroundBlur_774_190"
                    />
                  </filter>

                  <filter
                    id="filter1_f_774_190"
                    x="5.19346"
                    y="-1.44387"
                    width="50.6131"
                    height="64.1598"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="4.8"
                      result="effect1_foregroundBlur_774_190"
                    />
                  </filter>

                  <filter
                    id="filter2_f_774_190"
                    x="8.02378"
                    y="-3.17629"
                    width="44.9524"
                    height="67.6244"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="4.8"
                      result="effect1_foregroundBlur_774_190"
                    />
                  </filter>

                  <filter
                    id="filter3_f_774_190"
                    x="-0.386621"
                    y="24.3185"
                    width="61.773"
                    height="12.6352"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="1.8"
                      result="effect1_foregroundBlur_774_190"
                    />
                  </filter>

                  <filter
                    id="filter4_f_774_190"
                    x="11.1935"
                    y="4.55613"
                    width="38.6131"
                    height="52.1598"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="1.8"
                      result="effect1_foregroundBlur_774_190"
                    />
                  </filter>

                  <filter
                    id="filter5_f_774_190"
                    x="14.0238"
                    y="2.82371"
                    width="32.9524"
                    height="55.6244"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="1.8"
                      result="effect1_foregroundBlur_774_190"
                    />
                  </filter>

                  <linearGradient
                    id="paint0_linear_774_190"
                    x1="3.21338"
                    y1="30.636"
                    x2="57.7864"
                    y2="30.636"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>

                  <linearGradient
                    id="paint1_linear_774_190"
                    x1="3.21344"
                    y1="30.636"
                    x2="57.7864"
                    y2="30.636"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>

                  <linearGradient
                    id="paint2_linear_774_190"
                    x1="3.21347"
                    y1="30.636"
                    x2="57.7865"
                    y2="30.636"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>

                  <linearGradient
                    id="paint3_linear_774_190"
                    x1="3.21338"
                    y1="30.636"
                    x2="57.7864"
                    y2="30.636"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>

                  <linearGradient
                    id="paint4_linear_774_190"
                    x1="3.21344"
                    y1="30.636"
                    x2="57.7864"
                    y2="30.636"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>

                  <linearGradient
                    id="paint5_linear_774_190"
                    x1="3.21347"
                    y1="30.636"
                    x2="57.7865"
                    y2="30.636"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>

                  <clipPath id="clip0_774_190">
                    <rect
                      x="0.5"
                      y="0.635986"
                      width="60"
                      height="60"
                      rx="30"
                      fill="white"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <p className="text-3xl font-bold mt-3">
              مزیت هایی که مارا متمایز می کنند
            </p>
          </div>
          <div className="flex flex-col justify-center items-center garatee-box__container">
            <div className="grid grid-cols-1 gap-5 items-center w-full mb-6 
                    md:grid-cols-12 md:gap-5">

              <div className="garantee-box garantee-box flex flex-col justify-between items-center p-4 bg-white rounded-[40px] flex-1 h-[361px]
                        md:col-span-5">
                <div className="grantee-box-image w-full h-[253px]">
                  <img
                    src={`${STRAPI_URL}${publicGallery[1]?.image?.url}`}
                    alt={`${publicGallery[1]?.image?.alternativeText || "grantee image"
                      }`}
                    width={`${publicGallery[1]?.image?.width || 150}`}
                    height={`${publicGallery[1]?.image?.height || 150}`}
                    loading="lazy"
                    className="w-full h-full"
                  />
                </div>
                <p className="grantee-box-title text-2xl font-bold">
                  پشتیبانی ۲۴ ساعته
                </p>
                <p className="grantee-box-description text-[#696969] text-lg">
                  همیشه آماده پاسخگویی به سوالات و نیازهای شما
                </p>
              </div>

              <div className="garantee-box flex flex-col justify-between items-center p-4 bg-white rounded-[40px] flex-1 h-[361px]
                        md:col-span-7">
                <div className="grantee-box-image w-full h-[253px]">
                  <img
                    src={`${STRAPI_URL}${publicGallery[0]?.image?.url}`}
                    alt={`${publicGallery[0]?.image?.alternativeText || "grantee image"
                      }`}
                    width={`${publicGallery[0]?.image?.width || 150}`}
                    height={`${publicGallery[0]?.image?.height || 150}`}
                    loading="lazy"
                    className="w-full h-full"
                  />
                </div>
                <p className="grantee-box-title text-2xl font-bold">
                  تعمیر تخصصی با قطعات اورجینال
                </p>
                <p className="grantee-box-description text-[#696969] text-lg">
                  تعمیر توسط تکنسین‌های حرفه‌ای با قطعات اصلی
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 items-center w-full
                    md:grid-cols-12 md:gap-6">

              <div className="garantee-box garantee-box flex flex-col justify-between items-center p-4 bg-white rounded-[40px] flex-1 h-[361px]
                        md:col-span-4">
                <div className="grantee-box-image w-full h-[253px]">
                  <img
                    src={`${STRAPI_URL}${publicGallery[3]?.image?.url}`}
                    alt={`${publicGallery[3]?.image?.alternativeText || "grantee image"
                      }`}
                    width={`${publicGallery[3]?.image?.width || 150}`}
                    height={`${publicGallery[3]?.image?.height || 150}`}
                    loading="lazy"
                    className="w-full h-full"
                  />
                </div>
                <p className="garantee-box-title text-2xl font-bold">اصالت کالا</p>
                <p className="garantee-box-description text-[#696969] text-lg">
                  تمام محصولات با تضمین اورجینال بودن
                </p>
              </div>

              <div className="garantee-box garantee-box flex flex-col justify-between items-center p-4 bg-white rounded-[40px] flex-1 h-[361px]
                        md:col-span-4">
                <div className="grantee-box-image w-full h-[253px]">
                  <img
                    src={`${STRAPI_URL}${publicGallery[2]?.image?.url}`}
                    alt={`${publicGallery[2]?.image?.alternativeText || "grantee image"
                      }`}
                    width={`${publicGallery[2]?.image?.width || 150}`}
                    height={`${publicGallery[2]?.image?.height || 150}`}
                    loading="lazy"
                    className="w-full h-full"
                  />
                </div>
                <p className="garantee-box-title text-2xl font-bold">
                  ضمانت قیمت و کیفیت
                </p>
                <p className="garantee-box-description text-[#696969] text-lg">
                  بهترین کیفیت با منصفانه‌ترین قیمت بازار
                </p>
              </div>

              <div className="garantee-box garantee-box flex flex-col justify-between items-center p-4 bg-white rounded-[40px] flex-1 h-[361px]
                        md:col-span-4">
                <div className="grantee-box-image w-full h-[253px]">
                  <img
                    src={`${STRAPI_URL}${publicGallery[4]?.image?.url}`}
                    alt={`${publicGallery[4]?.image?.alternativeText || "grantee image"
                      }`}
                    width={`${publicGallery[4]?.image?.width || 150}`}
                    height={`${publicGallery[4]?.image?.height || 150}`}
                    loading="lazy"
                    className="w-full h-full"
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

      <section className="flex gap-8 flex-wrap justify-center flex-col section__two">
        <div className="container mx-auto">
          <div className="section__header flex flex-col items-center justify-center mb-[30px] mt-[50px] md:mt-[103px]">
            <div className="container__svg">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_940_110)">
                  <rect width="60" height="60" rx="30" fill="black" />
                  <g filter="url(#filter0_f_940_110)">
                    <ellipse
                      cx="29.9999"
                      cy="30"
                      rx="27.2865"
                      ry="2.71758"
                      fill="url(#paint0_linear_940_110)"
                    />
                  </g>
                  <g filter="url(#filter1_f_940_110)">
                    <ellipse
                      cx="29.9999"
                      cy="29.9999"
                      rx="27.2865"
                      ry="2.71758"
                      transform="rotate(55.2712 29.9999 29.9999)"
                      fill="url(#paint1_linear_940_110)"
                    />
                  </g>
                  <g filter="url(#filter2_f_940_110)">
                    <ellipse
                      cx="30"
                      cy="30.0001"
                      rx="27.2865"
                      ry="2.71758"
                      transform="rotate(117.612 30 30.0001)"
                      fill="url(#paint2_linear_940_110)"
                    />
                  </g>
                  <g
                    style={{ mixBlendMode: "lighten" }}
                    opacity="0.19"
                    filter="url(#filter3_f_940_110)"
                  >
                    <ellipse
                      cx="29.9999"
                      cy="30"
                      rx="27.2865"
                      ry="2.71758"
                      fill="url(#paint3_linear_940_110)"
                    />
                  </g>
                  <g
                    style={{ mixBlendMode: "lighten" }}
                    opacity="0.19"
                    filter="url(#filter4_f_940_110)"
                  >
                    <ellipse
                      cx="29.9999"
                      cy="29.9999"
                      rx="27.2865"
                      ry="2.71758"
                      transform="rotate(55.2712 29.9999 29.9999)"
                      fill="url(#paint4_linear_940_110)"
                    />
                  </g>
                  <g
                    style={{ mixBlendMode: "lighten" }}
                    opacity="0.19"
                    filter="url(#filter5_f_940_110)"
                  >
                    <ellipse
                      cx="30"
                      cy="29.9999"
                      rx="27.2865"
                      ry="2.71758"
                      transform="rotate(117.612 30 29.9999)"
                      fill="url(#paint5_linear_940_110)"
                    />
                  </g>
                  <circle
                    opacity="0.55"
                    cx="42.7868"
                    cy="22.6506"
                    r="0.358093"
                    fill="#D9D9D9"
                  />
                  <circle
                    opacity="0.55"
                    cx="15.4644"
                    cy="32.0767"
                    r="0.358093"
                    transform="rotate(180 15.4644 32.0767)"
                    fill="#D9D9D9"
                  />
                  <ellipse
                    opacity="0.55"
                    cx="0.353023"
                    cy="0.331706"
                    rx="0.353023"
                    ry="0.331706"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 23.426 16.6057)"
                    fill="#D9D9D9"
                  />
                  <ellipse
                    opacity="0.55"
                    cx="0.353023"
                    cy="0.331706"
                    rx="0.353023"
                    ry="0.331706"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 34.8252 38.1213)"
                    fill="#D9D9D9"
                  />
                  <circle
                    opacity="0.55"
                    cx="34.0041"
                    cy="15.642"
                    r="0.358093"
                    fill="#D9D9D9"
                  />
                  <circle
                    opacity="0.55"
                    cx="24.2474"
                    cy="39.0853"
                    r="0.358093"
                    transform="rotate(180 24.2474 39.0853)"
                    fill="#D9D9D9"
                  />
                  <ellipse
                    opacity="0.55"
                    cx="0.353023"
                    cy="0.331706"
                    rx="0.353023"
                    ry="0.331706"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 14.3394 21.7798)"
                    fill="#D9D9D9"
                  />
                  <ellipse
                    opacity="0.55"
                    cx="0.353023"
                    cy="0.331706"
                    rx="0.353023"
                    ry="0.331706"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 43.9119 32.9473)"
                    fill="#D9D9D9"
                  />
                  <circle cx="40.1991" cy="16.7635" r="0.159546" fill="#EDE9DE" />
                  <circle
                    cx="18.0521"
                    cy="37.9635"
                    r="0.159546"
                    transform="rotate(180 18.0521 37.9635)"
                    fill="#EDE9DE"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 17.8066 16.4753)"
                    fill="#EDE9DE"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 40.4446 38.2517)"
                    fill="#EDE9DE"
                  />
                  <circle cx="47.826" cy="21.4884" r="0.159546" fill="#EDE9DE" />
                  <circle
                    cx="10.4252"
                    cy="33.2389"
                    r="0.159546"
                    transform="rotate(180 10.4252 33.2389)"
                    fill="#EDE9DE"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 24.5645 11.4287)"
                    fill="#EDE9DE"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 33.687 43.2986)"
                    fill="#EDE9DE"
                  />
                  <circle cx="36.3519" cy="7.31409" r="0.159546" fill="#EDE9DE" />
                  <circle
                    cx="21.8995"
                    cy="47.413"
                    r="0.159546"
                    transform="rotate(180 21.8995 47.413)"
                    fill="#EDE9DE"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 8.51685 16.1479)"
                    fill="#EDE9DE"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 49.7344 38.5793)"
                    fill="#EDE9DE"
                  />
                  <path
                    d="M30 40.75C24.072 40.75 19.25 35.927 19.25 30C19.25 24.073 24.072 19.25 30 19.25C35.928 19.25 40.75 24.073 40.75 30C40.75 35.927 35.928 40.75 30 40.75ZM30 20.75C24.899 20.75 20.75 24.899 20.75 30C20.75 35.101 24.899 39.25 30 39.25C35.101 39.25 39.25 35.101 39.25 30C39.25 24.899 35.101 20.75 30 20.75ZM30 35.75C29.894 35.75 29.788 35.728 29.689 35.683C29.509 35.601 25.275 33.637 24.588 30.096C24.316 28.693 24.596 27.314 25.339 26.408C25.956 25.656 26.838 25.255 27.889 25.25C27.895 25.25 27.9 25.25 27.905 25.25C28.886 25.25 29.559 25.695 30 26.175C30.44 25.695 31.113 25.25 32.095 25.25C32.1 25.25 32.105 25.25 32.111 25.25C33.163 25.255 34.045 25.655 34.661 26.406C35.415 27.324 35.688 28.669 35.412 30.095C34.725 33.637 30.491 35.601 30.311 35.682C30.212 35.728 30.106 35.75 30 35.75ZM27.9041 26.75C27.9011 26.75 27.899 26.75 27.897 26.75C27.298 26.753 26.829 26.958 26.499 27.359C26.037 27.923 25.873 28.839 26.061 29.809C26.508 32.116 29.094 33.678 29.999 34.16C30.902 33.676 33.493 32.107 33.938 29.81C34.126 28.838 33.962 27.922 33.5 27.358C33.171 26.958 32.7011 26.753 32.1021 26.75C32.1001 26.75 32.097 26.75 32.095 26.75C31.099 26.75 30.725 27.781 30.709 27.825C30.603 28.126 30.318 28.329 30 28.329C29.998 28.329 29.996 28.329 29.994 28.329C29.673 28.326 29.389 28.123 29.287 27.819C29.274 27.781 28.9001 26.75 27.9041 26.75ZM34.675 29.952H34.6851H34.675Z"
                    fill="#EDE9DE"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_f_940_110"
                    x="-6.88662"
                    y="17.6825"
                    width="73.773"
                    height="24.6351"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="4.8"
                      result="effect1_foregroundBlur_940_110"
                    />
                  </filter>
                  <filter
                    id="filter1_f_940_110"
                    x="4.69346"
                    y="-2.07998"
                    width="50.6131"
                    height="64.1597"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="4.8"
                      result="effect1_foregroundBlur_940_110"
                    />
                  </filter>
                  <filter
                    id="filter2_f_940_110"
                    x="7.52378"
                    y="-3.81216"
                    width="44.9524"
                    height="67.6246"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="4.8"
                      result="effect1_foregroundBlur_940_110"
                    />
                  </filter>
                  <filter
                    id="filter3_f_940_110"
                    x="-0.886621"
                    y="23.6825"
                    width="61.773"
                    height="12.6351"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="1.8"
                      result="effect1_foregroundBlur_940_110"
                    />
                  </filter>
                  <filter
                    id="filter4_f_940_110"
                    x="10.6935"
                    y="3.92002"
                    width="38.6131"
                    height="52.1597"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="1.8"
                      result="effect1_foregroundBlur_940_110"
                    />
                  </filter>
                  <filter
                    id="filter5_f_940_110"
                    x="13.5238"
                    y="2.1876"
                    width="32.9524"
                    height="55.6246"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="1.8"
                      result="effect1_foregroundBlur_940_110"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_940_110"
                    x1="2.71338"
                    y1="30"
                    x2="57.2864"
                    y2="30"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_940_110"
                    x1="2.71344"
                    y1="29.9999"
                    x2="57.2864"
                    y2="29.9999"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_940_110"
                    x1="2.71347"
                    y1="30.0001"
                    x2="57.2865"
                    y2="30.0001"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <linearGradient
                    id="paint3_linear_940_110"
                    x1="2.71338"
                    y1="30"
                    x2="57.2864"
                    y2="30"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <linearGradient
                    id="paint4_linear_940_110"
                    x1="2.71344"
                    y1="29.9999"
                    x2="57.2864"
                    y2="29.9999"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <linearGradient
                    id="paint5_linear_940_110"
                    x1="2.71347"
                    y1="29.9999"
                    x2="57.2865"
                    y2="29.9999"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <clipPath id="clip0_940_110">
                    <rect width="60" height="60" rx="30" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <p className="text-3xl font-bold mt-3">محصولات پر فروش</p>
          </div>
          <ProductSliderContainer />
        </div>
      </section>

      <section className="flex gap-8 flex-wrap justify-center flex-col section__three">
        <div className="container mx-auto">
          <div className="section__header flex flex-col items-center justify-center mb-[30px] mt-[50px] md:mt-[103px]">
            <div className="container__svg">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1332_181)">
                  <rect width="60" height="60" rx="30" fill="black" />
                  <g filter="url(#filter0_f_1332_181)">
                    <ellipse
                      cx="29.9999"
                      cy="30"
                      rx="27.2865"
                      ry="2.71758"
                      fill="url(#paint0_linear_1332_181)"
                    />
                  </g>
                  <g filter="url(#filter1_f_1332_181)">
                    <ellipse
                      cx="29.9999"
                      cy="29.9999"
                      rx="27.2865"
                      ry="2.71758"
                      transform="rotate(55.2712 29.9999 29.9999)"
                      fill="url(#paint1_linear_1332_181)"
                    />
                  </g>
                  <g filter="url(#filter2_f_1332_181)">
                    <ellipse
                      cx="30"
                      cy="30.0001"
                      rx="27.2865"
                      ry="2.71758"
                      transform="rotate(117.612 30 30.0001)"
                      fill="url(#paint2_linear_1332_181)"
                    />
                  </g>
                  <g
                    style={{ mixBlendMode: "lighten" }}
                    opacity="0.19"
                    filter="url(#filter3_f_1332_181)"
                  >
                    <ellipse
                      cx="29.9999"
                      cy="30"
                      rx="27.2865"
                      ry="2.71758"
                      fill="url(#paint3_linear_1332_181)"
                    />
                  </g>
                  <g
                    style={{ mixBlendMode: "lighten" }}
                    opacity="0.19"
                    filter="url(#filter4_f_1332_181)"
                  >
                    <ellipse
                      cx="29.9999"
                      cy="29.9999"
                      rx="27.2865"
                      ry="2.71758"
                      transform="rotate(55.2712 29.9999 29.9999)"
                      fill="url(#paint4_linear_1332_181)"
                    />
                  </g>
                  <g
                    style={{ mixBlendMode: "lighten" }}
                    opacity="0.19"
                    filter="url(#filter5_f_1332_181)"
                  >
                    <ellipse
                      cx="30"
                      cy="29.9999"
                      rx="27.2865"
                      ry="2.71758"
                      transform="rotate(117.612 30 29.9999)"
                      fill="url(#paint5_linear_1332_181)"
                    />
                  </g>
                  <circle
                    opacity="0.55"
                    cx="42.7868"
                    cy="22.6506"
                    r="0.358093"
                    fill="#D9D9D9"
                  />
                  <circle
                    opacity="0.55"
                    cx="15.4644"
                    cy="32.0767"
                    r="0.358093"
                    transform="rotate(180 15.4644 32.0767)"
                    fill="#D9D9D9"
                  />
                  <ellipse
                    opacity="0.55"
                    cx="0.353023"
                    cy="0.331706"
                    rx="0.353023"
                    ry="0.331706"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 23.426 16.6057)"
                    fill="#D9D9D9"
                  />
                  <ellipse
                    opacity="0.55"
                    cx="0.353023"
                    cy="0.331706"
                    rx="0.353023"
                    ry="0.331706"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 34.8252 38.1213)"
                    fill="#D9D9D9"
                  />
                  <circle
                    opacity="0.55"
                    cx="34.0041"
                    cy="15.642"
                    r="0.358093"
                    fill="#D9D9D9"
                  />
                  <circle
                    opacity="0.55"
                    cx="24.2474"
                    cy="39.0853"
                    r="0.358093"
                    transform="rotate(180 24.2474 39.0853)"
                    fill="#D9D9D9"
                  />
                  <ellipse
                    opacity="0.55"
                    cx="0.353023"
                    cy="0.331706"
                    rx="0.353023"
                    ry="0.331706"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 14.3394 21.7798)"
                    fill="#D9D9D9"
                  />
                  <ellipse
                    opacity="0.55"
                    cx="0.353023"
                    cy="0.331706"
                    rx="0.353023"
                    ry="0.331706"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 43.9119 32.9473)"
                    fill="#D9D9D9"
                  />
                  <circle cx="40.1991" cy="16.7635" r="0.159546" fill="#F9F8F5" />
                  <circle
                    cx="18.0521"
                    cy="37.9635"
                    r="0.159546"
                    transform="rotate(180 18.0521 37.9635)"
                    fill="#F9F8F5"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 17.8066 16.4753)"
                    fill="#F9F8F5"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 40.4446 38.2517)"
                    fill="#F9F8F5"
                  />
                  <circle cx="47.826" cy="21.4884" r="0.159546" fill="#F9F8F5" />
                  <circle
                    cx="10.4252"
                    cy="33.2389"
                    r="0.159546"
                    transform="rotate(180 10.4252 33.2389)"
                    fill="#F9F8F5"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 24.5645 11.4287)"
                    fill="#F9F8F5"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 33.687 43.2986)"
                    fill="#F9F8F5"
                  />
                  <circle cx="36.3519" cy="7.31409" r="0.159546" fill="#F9F8F5" />
                  <circle
                    cx="21.8995"
                    cy="47.413"
                    r="0.159546"
                    transform="rotate(180 21.8995 47.413)"
                    fill="#F9F8F5"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 8.51685 16.1479)"
                    fill="#F9F8F5"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 49.7344 38.5793)"
                    fill="#F9F8F5"
                  />
                  <path
                    d="M21.8569 39.75C21.7119 39.75 21.5711 39.748 21.4331 39.743C20.9331 39.731 20.495 39.411 20.324 38.928C20.152 38.442 20.2941 37.9131 20.6841 37.5811C21.6161 36.8291 21.9889 35.997 22.1389 35.426C20.9019 33.947 20.249 32.08 20.249 30.001C20.249 24.848 24.259 21.25 29.999 21.25C35.739 21.25 39.749 24.849 39.749 30.001C39.749 35.153 35.739 38.752 29.999 38.752C28.812 38.752 27.674 38.591 26.605 38.2729C25.242 39.4599 23.3639 39.75 21.8569 39.75ZM21.478 38.243C21.48 38.243 21.4819 38.243 21.4839 38.243C21.4809 38.244 21.479 38.244 21.478 38.243ZM30 22.75C25.143 22.75 21.75 25.732 21.75 30.001C21.75 31.837 22.355 33.463 23.501 34.703C23.656 34.871 23.7269 35.101 23.6909 35.328C23.5229 36.399 22.9951 37.412 22.1831 38.243C23.3431 38.201 24.903 37.934 25.863 36.91C26.064 36.694 26.376 36.617 26.655 36.714C27.69 37.072 28.815 37.2531 30 37.2531C34.857 37.2531 38.25 34.271 38.25 30.002C38.25 25.733 34.857 22.75 30 22.75ZM31.02 30C31.02 29.448 30.573 29 30.02 29H30.01C29.458 29 29.0149 29.448 29.0149 30C29.0149 30.552 29.468 31 30.02 31C30.572 31 31.02 30.552 31.02 30ZM35.02 30C35.02 29.448 34.573 29 34.02 29H34.01C33.458 29 33.0149 29.448 33.0149 30C33.0149 30.552 33.468 31 34.02 31C34.572 31 35.02 30.552 35.02 30ZM27.02 30C27.02 29.448 26.573 29 26.02 29H26.01C25.458 29 25.0149 29.448 25.0149 30C25.0149 30.552 25.468 31 26.02 31C26.572 31 27.02 30.552 27.02 30Z"
                    fill="#F9F8F5"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_f_1332_181"
                    x="-6.88662"
                    y="17.6825"
                    width="73.773"
                    height="24.6351"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="4.8"
                      result="effect1_foregroundBlur_1332_181"
                    />
                  </filter>
                  <filter
                    id="filter1_f_1332_181"
                    x="4.69346"
                    y="-2.07998"
                    width="50.6131"
                    height="64.1597"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="4.8"
                      result="effect1_foregroundBlur_1332_181"
                    />
                  </filter>
                  <filter
                    id="filter2_f_1332_181"
                    x="7.52378"
                    y="-3.81216"
                    width="44.9524"
                    height="67.6246"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="4.8"
                      result="effect1_foregroundBlur_1332_181"
                    />
                  </filter>
                  <filter
                    id="filter3_f_1332_181"
                    x="-0.886621"
                    y="23.6825"
                    width="61.773"
                    height="12.6351"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="1.8"
                      result="effect1_foregroundBlur_1332_181"
                    />
                  </filter>
                  <filter
                    id="filter4_f_1332_181"
                    x="10.6935"
                    y="3.92002"
                    width="38.6131"
                    height="52.1597"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="1.8"
                      result="effect1_foregroundBlur_1332_181"
                    />
                  </filter>
                  <filter
                    id="filter5_f_1332_181"
                    x="13.5238"
                    y="2.1876"
                    width="32.9524"
                    height="55.6246"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="1.8"
                      result="effect1_foregroundBlur_1332_181"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_1332_181"
                    x1="2.71338"
                    y1="30"
                    x2="57.2864"
                    y2="30"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_1332_181"
                    x1="2.71344"
                    y1="29.9999"
                    x2="57.2864"
                    y2="29.9999"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_1332_181"
                    x1="2.71347"
                    y1="30.0001"
                    x2="57.2865"
                    y2="30.0001"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <linearGradient
                    id="paint3_linear_1332_181"
                    x1="2.71338"
                    y1="30"
                    x2="57.2864"
                    y2="30"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <linearGradient
                    id="paint4_linear_1332_181"
                    x1="2.71344"
                    y1="29.9999"
                    x2="57.2864"
                    y2="29.9999"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <linearGradient
                    id="paint5_linear_1332_181"
                    x1="2.71347"
                    y1="29.9999"
                    x2="57.2865"
                    y2="29.9999"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <clipPath id="clip0_1332_181">
                    <rect width="60" height="60" rx="30" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <p className="text-3xl font-bold mt-3">نظرات مشتریان</p>
          </div>
          <div className="text-lg font-bold text-black text-center">
            Comming Soon
          </div>
        </div>
      </section>

      <section className="section__four pt-[154px]">
        <div className="container mx-auto">
          <BottomSliderContainer />
        </div>
      </section>

      <section className="section__five">
        <div className="container mx-auto">
          <div className="section__header flex flex-col items-center justify-center mb-[30px] mt-[50px] md:mt-[103px]">
            <div className="container__svg">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1396_99)">
                  <rect width="60" height="60" rx="30" fill="black" />
                  <g filter="url(#filter0_f_1396_99)">
                    <ellipse
                      cx="29.9999"
                      cy="30"
                      rx="27.2865"
                      ry="2.71758"
                      fill="url(#paint0_linear_1396_99)"
                    />
                  </g>
                  <g filter="url(#filter1_f_1396_99)">
                    <ellipse
                      cx="29.9999"
                      cy="29.9999"
                      rx="27.2865"
                      ry="2.71758"
                      transform="rotate(55.2712 29.9999 29.9999)"
                      fill="url(#paint1_linear_1396_99)"
                    />
                  </g>
                  <g filter="url(#filter2_f_1396_99)">
                    <ellipse
                      cx="30"
                      cy="30.0001"
                      rx="27.2865"
                      ry="2.71758"
                      transform="rotate(117.612 30 30.0001)"
                      fill="url(#paint2_linear_1396_99)"
                    />
                  </g>
                  <g
                    style={{ mixBlendMode: "lighten" }}
                    opacity="0.19"
                    filter="url(#filter3_f_1396_99)"
                  >
                    <ellipse
                      cx="29.9999"
                      cy="30"
                      rx="27.2865"
                      ry="2.71758"
                      fill="url(#paint3_linear_1396_99)"
                    />
                  </g>
                  <g
                    style={{ mixBlendMode: "lighten" }}
                    opacity="0.19"
                    filter="url(#filter4_f_1396_99)"
                  >
                    <ellipse
                      cx="29.9999"
                      cy="29.9999"
                      rx="27.2865"
                      ry="2.71758"
                      transform="rotate(55.2712 29.9999 29.9999)"
                      fill="url(#paint4_linear_1396_99)"
                    />
                  </g>
                  <g
                    style={{ mixBlendMode: "lighten" }}
                    opacity="0.19"
                    filter="url(#filter5_f_1396_99)"
                  >
                    <ellipse
                      cx="30"
                      cy="29.9999"
                      rx="27.2865"
                      ry="2.71758"
                      transform="rotate(117.612 30 29.9999)"
                      fill="url(#paint5_linear_1396_99)"
                    />
                  </g>
                  <path
                    d="M33.5 35.8333H26.5M33.5 35.8333V37C33.5 38.4045 33.5 39.1067 33.1629 39.6111C33.017 39.8295 32.8295 40.017 32.6111 40.1629C32.1067 40.5 31.4045 40.5 30 40.5C28.5955 40.5 27.8933 40.5 27.3889 40.1629C27.1705 40.017 26.983 39.8295 26.8371 39.6111C26.5 39.1067 26.5 38.4045 26.5 37V35.8333M33.5 35.8333V34.6581C33.5 34.2844 33.6175 33.9201 33.8359 33.6169L35.8197 30.8615C39.2352 26.1178 35.8453 19.5 30 19.5C24.1547 19.5 20.7648 26.1178 24.1803 30.8615L26.1641 33.6169C26.3825 33.9201 26.5 34.2844 26.5 34.6581V35.8333M28.25 29.4167L30 32.3333L31.75 29.4167"
                    stroke="#F9F8F5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    opacity="0.55"
                    cx="42.7868"
                    cy="22.6506"
                    r="0.358093"
                    fill="#D9D9D9"
                  />
                  <circle
                    opacity="0.55"
                    cx="15.4644"
                    cy="32.0767"
                    r="0.358093"
                    transform="rotate(180 15.4644 32.0767)"
                    fill="#D9D9D9"
                  />
                  <ellipse
                    opacity="0.55"
                    cx="0.353023"
                    cy="0.331706"
                    rx="0.353023"
                    ry="0.331706"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 23.426 16.6057)"
                    fill="#D9D9D9"
                  />
                  <ellipse
                    opacity="0.55"
                    cx="0.353023"
                    cy="0.331706"
                    rx="0.353023"
                    ry="0.331706"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 34.8252 38.1213)"
                    fill="#D9D9D9"
                  />
                  <circle
                    opacity="0.55"
                    cx="34.0041"
                    cy="15.642"
                    r="0.358093"
                    fill="#D9D9D9"
                  />
                  <circle
                    opacity="0.55"
                    cx="24.2474"
                    cy="39.0853"
                    r="0.358093"
                    transform="rotate(180 24.2474 39.0853)"
                    fill="#D9D9D9"
                  />
                  <ellipse
                    opacity="0.55"
                    cx="0.353023"
                    cy="0.331706"
                    rx="0.353023"
                    ry="0.331706"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 14.3394 21.7798)"
                    fill="#D9D9D9"
                  />
                  <ellipse
                    opacity="0.55"
                    cx="0.353023"
                    cy="0.331706"
                    rx="0.353023"
                    ry="0.331706"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 43.9119 32.9473)"
                    fill="#D9D9D9"
                  />
                  <circle cx="40.1991" cy="16.7635" r="0.159546" fill="#F9F8F5" />
                  <circle
                    cx="18.0521"
                    cy="37.9635"
                    r="0.159546"
                    transform="rotate(180 18.0521 37.9635)"
                    fill="#F9F8F5"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 17.8066 16.4753)"
                    fill="#F9F8F5"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 40.4446 38.2517)"
                    fill="#F9F8F5"
                  />
                  <circle cx="47.826" cy="21.4884" r="0.159546" fill="#F9F8F5" />
                  <circle
                    cx="10.4252"
                    cy="33.2389"
                    r="0.159546"
                    transform="rotate(180 10.4252 33.2389)"
                    fill="#F9F8F5"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 24.5645 11.4287)"
                    fill="#F9F8F5"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 33.687 43.2986)"
                    fill="#F9F8F5"
                  />
                  <circle cx="36.3519" cy="7.31409" r="0.159546" fill="#F9F8F5" />
                  <circle
                    cx="21.8995"
                    cy="47.413"
                    r="0.159546"
                    transform="rotate(180 21.8995 47.413)"
                    fill="#F9F8F5"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(0.37576 -0.926717 0.8985 0.438973 8.51685 16.1479)"
                    fill="#F9F8F5"
                  />
                  <ellipse
                    cx="0.157287"
                    cy="0.147789"
                    rx="0.157287"
                    ry="0.147789"
                    transform="matrix(-0.37576 0.926717 -0.8985 -0.438973 49.7344 38.5793)"
                    fill="#F9F8F5"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_f_1396_99"
                    x="-6.88662"
                    y="17.6825"
                    width="73.773"
                    height="24.6351"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="4.8"
                      result="effect1_foregroundBlur_1396_99"
                    />
                  </filter>
                  <filter
                    id="filter1_f_1396_99"
                    x="4.69346"
                    y="-2.07998"
                    width="50.6131"
                    height="64.1597"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="4.8"
                      result="effect1_foregroundBlur_1396_99"
                    />
                  </filter>
                  <filter
                    id="filter2_f_1396_99"
                    x="7.52378"
                    y="-3.81216"
                    width="44.9524"
                    height="67.6246"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="4.8"
                      result="effect1_foregroundBlur_1396_99"
                    />
                  </filter>
                  <filter
                    id="filter3_f_1396_99"
                    x="-0.886621"
                    y="23.6825"
                    width="61.773"
                    height="12.6351"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="1.8"
                      result="effect1_foregroundBlur_1396_99"
                    />
                  </filter>
                  <filter
                    id="filter4_f_1396_99"
                    x="10.6935"
                    y="3.92002"
                    width="38.6131"
                    height="52.1597"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="1.8"
                      result="effect1_foregroundBlur_1396_99"
                    />
                  </filter>
                  <filter
                    id="filter5_f_1396_99"
                    x="13.5238"
                    y="2.1876"
                    width="32.9524"
                    height="55.6246"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation="1.8"
                      result="effect1_foregroundBlur_1396_99"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_1396_99"
                    x1="2.71338"
                    y1="30"
                    x2="57.2864"
                    y2="30"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_1396_99"
                    x1="2.71344"
                    y1="29.9999"
                    x2="57.2864"
                    y2="29.9999"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_1396_99"
                    x1="2.71347"
                    y1="30.0001"
                    x2="57.2865"
                    y2="30.0001"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <linearGradient
                    id="paint3_linear_1396_99"
                    x1="2.71338"
                    y1="30"
                    x2="57.2864"
                    y2="30"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <linearGradient
                    id="paint4_linear_1396_99"
                    x1="2.71344"
                    y1="29.9999"
                    x2="57.2864"
                    y2="29.9999"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <linearGradient
                    id="paint5_linear_1396_99"
                    x1="2.71347"
                    y1="29.9999"
                    x2="57.2865"
                    y2="29.9999"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D9D9D9" />
                    <stop offset="0.543269" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <clipPath id="clip0_1396_99">
                    <rect width="60" height="60" rx="30" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <p className="text-3xl font-bold mt-3">سوالات متداول</p>
          </div>
          <FaqAccordion />
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default HomePage;
