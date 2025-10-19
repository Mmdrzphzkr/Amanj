"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProducts } from "../../../redux/slices/productSlice";
import Header from "../header/header";
import MainSliderContainer from "../../../components/Sliders/MainSlider/MainSliderContainer";
import BrandSliderContainer from "../../../components/Sliders/BrandSlider/BrandSliderContainer";
import BottomSliderContainer from "../../../components/Sliders/BottomSlider/BottomSliderContainer";
import { fetchPublicGallery } from "../../../redux/slices/publicGallerySlice";

const HomePage = () => {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.items);

  const publicGallery = useSelector((s) => s.publicGallery.items || []);

  const STRAPI_URL = "http://localhost:8000".replace(/\/+$/, "");

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchPublicGallery());
  }, [dispatch]);

  return (
    <main className="container">
      <Header />
      <MainSliderContainer />
      <div className="bg-[#EDE9DE] h-[115px]">
        <BrandSliderContainer />
      </div>
      <section className="flex gap-8 flex-wrap justify-center flex-col section__one px-[58px]">
        <div className="section__header flex flex-col items-center justify-center mt-[132px]">
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
          <div className="flex flex-col md:flex-row justify-between gap-5 items-center w-full mb-6">
            <div className="garantee-box garantee-box flex flex-col md:flex justify-between items-center p-4 bg-white rounded-[40px] flex-5/12 h-[361px]">
              <div className="grantee-box-image w-full h-[253px]">
                <img
                  src={`${STRAPI_URL}${publicGallery[1]?.image?.url}`}
                  alt={`${
                    publicGallery[1]?.image?.alternativeText || "grantee image"
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
            <div className="garantee-box flex flex-col md:flex justify-between items-center p-4 bg-white rounded-[40px] flex-7/12 h-[361px]">
              <div className="grantee-box-image w-full h-[253px]">
                <img
                  src={`${STRAPI_URL}${publicGallery[0]?.image?.url}`}
                  alt={`${
                    publicGallery[0]?.image?.alternativeText || "grantee image"
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
          <div className="flex flex-col md:flex-row justify-between gap-6 items-center w-full">
            <div className="garantee-box garantee-box flex flex-col md:flex justify-between items-center p-4 bg-white rounded-[40px] flex-5/12 h-[361px]">
              <div className="grantee-box-image w-full h-[253px]">
                <img
                  src={`${STRAPI_URL}${publicGallery[3]?.image?.url}`}
                  alt={`${
                    publicGallery[3]?.image?.alternativeText || "grantee image"
                  }`}
                  width={`${publicGallery[3]?.image?.width || 150}`}
                  height={`${publicGallery[3]?.image?.height || 150}`}
                  loading="lazy"
                  className="w-full h-full"
                />
              </div>
              <p className="grantee-box-title text-2xl font-bold">اصالت کالا</p>
              <p className="grantee-box-description text-[#696969] text-lg">
                تمام محصولات با تضمین اورجینال بودن
              </p>
            </div>
            <div className="garantee-box garantee-box flex flex-col md:flex justify-between items-center p-4 bg-white rounded-[40px] flex-5/12 h-[361px]">
              <div className="grantee-box-image w-full h-[253px]">
                <img
                  src={`${STRAPI_URL}${publicGallery[2]?.image?.url}`}
                  alt={`${
                    publicGallery[2]?.image?.alternativeText || "grantee image"
                  }`}
                  width={`${publicGallery[2]?.image?.width || 150}`}
                  height={`${publicGallery[2]?.image?.height || 150}`}
                  loading="lazy"
                  className="w-full h-full"
                />
              </div>
              <p className="grantee-box-title text-2xl font-bold">
                ضمانت قیمت و کیفیت
              </p>
              <p className="grantee-box-description text-[#696969] text-lg">
                بهترین کیفیت با منصفانه‌ترین قیمت بازار
              </p>
            </div>
            <div className="garantee-box garantee-box flex flex-col md:flex justify-between items-center p-4 bg-white rounded-[40px] flex-5/12 h-[361px]">
              <div className="grantee-box-image w-full h-[253px]">
                <img
                  src={`${STRAPI_URL}${publicGallery[4]?.image?.url}`}
                  alt={`${
                    publicGallery[4]?.image?.alternativeText || "grantee image"
                  }`}
                  width={`${publicGallery[4]?.image?.width || 150}`}
                  height={`${publicGallery[4]?.image?.height || 150}`}
                  loading="lazy"
                  className="w-full h-full"
                />
              </div>
              <p className="grantee-box-title text-2xl font-bold">گارانتی</p>
              <p className="grantee-box-description text-[#696969] text-lg">
                اطمینان خاطر از خرید با ضمانت معتبر
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex gap-8 flex-wrap justify-center flex-col section__two px-[58px]">
        <div className="section__header flex flex-col items-center justify-center mt-[103px]">
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
          <p className="text-3xl font-bold mt-3">محصولات پر فروش</p>
        </div>
        <div className="text-lg font-bold text-black text-center">
          Comming Soon
        </div>
      </section>

      <section className="flex gap-8 flex-wrap justify-center flex-col section__three px-[58px]">
        <div className="section__header flex flex-col items-center justify-center mt-[103px] mb-">
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
          <p className="text-3xl font-bold mt-3">نظرات مشتریان</p>
        </div>
        <div className="text-lg font-bold text-black text-center">
          Comming Soon
        </div>
      </section>

      <section className="section__four px-[58px] pt-[154px]">
        <BottomSliderContainer />
      </section>

      <footer className="text-center mt-12 text-gray-600">
        &copy; {new Date().getFullYear()} Amanj Shop. All rights reserved.
      </footer>
    </main>
  );
};

export default HomePage;
