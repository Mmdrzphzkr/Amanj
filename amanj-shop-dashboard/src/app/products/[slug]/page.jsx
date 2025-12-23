// src/app/products/[slug]/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchStrapiData } from "@/lib/strapi-frontend";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { Tabs, Tab, Box } from "@mui/material";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import SwiperWrapper from "@/components/Swiper/SwiperWrapper";
import { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import OrderModal from "@/components/Modal/OrderModal";
import { useDispatch } from "react-redux"; // ۱. اضافه شد
import { addItem } from "@/redux/slices/cartSlice"; // ۲. اضافه شد
import { toast } from "react-hot-toast";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} className="py-4">
      {value === index && children}
    </div>
  );
}

export default function ProductPage() {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  // ✅ این وضعیت، باز یا بسته بودن پاپ‌آپ را کنترل می‌کند
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // ... (منطق fetch شما)
        const response = await fetchStrapiData(
          `/api/products?filters[slug][$eq]=${slug}&populate=*`
        );
        if (response && response.length > 0) {
          console.log(response[0]);
          setProduct(response[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return <div>محصول مورد نظر یافت نشد</div>;
  }

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000";

  // ... (تنظیمات Swiper)
  const thumbnailOptions = {
    spaceBetween: 10,
    slidesPerView: 4,
    loop: product.gallery.length > 4,
    autoplay:
      product.gallery.length > 1
        ? { delay: 2500, disableOnInteraction: false }
        : false,
    navigation: true,
    speed: 600,
    watchSlidesProgress: true,
    breakpoints: {
      320: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 10,
      },
    },
  };

  const handleAddToCart = () => {
    if (product.stock > 0) {
      dispatch(
        addItem({
          id: product.id,
          documentId: product.documentId,
          title: product.name,
          price: product.price,
          image: `${STRAPI_URL}${product.thumbnail?.url}`,
          quantity: 1,
        })
      );

      // جایگزینی alert با toast
      toast.success(`${product.name} به سبد خرید اضافه شد`, {
        style: {
          border: "1px solid #EDE9DE",
          padding: "16px",
          color: "#3F3F3F",
          background: "#F9F8F5",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "bold",
        },
        iconTheme: {
          primary: "#C5A35C", // هماهنگ با رنگ طلایی برند شما
          secondary: "#FFFAEE",
        },
      });
    } else {
      toast.error("متاسفانه موجودی این کالا به اتمام رسیده است.");
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <main className="container">
        <Header />
        <div className="mt-20 mb-8">
          <Breadcrumb category={product.category} currentTitle={product.name} />
        </div>
        <div className="flex md:flex-row flex-col gap-8 justify-center px-[58px] mb-16">
          {/* ... بخش گالری ... */}
          <div className="md:w-1/2 w-full">
            <div className="mb-4 relative">
              <div className="brand-name absolute top-6 right-6 bg-[#EDE9DE] text-lg font-bold text-[#696969] rounded-3xl px-3 py-1">
                {product.brand?.name}
              </div>
              <img
                src={`${STRAPI_URL}${product.gallery[selectedImage].url}`}
                alt={product.name}
                loading="lazy"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <SwiperWrapper
              items={product.gallery}
              modules={[FreeMode, Navigation, Thumbs]}
              swiperOptions={thumbnailOptions}
              className="product-thumbs-slider"
              renderItem={(image, index) => (
                <div
                  className={`cursor-pointer border-2 rounded-xl overflow-hidden ${
                    selectedImage === index
                      ? "border-[#EDE9DE]"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={`${STRAPI_URL}${image.formats.thumbnail.url}`}
                    alt={image.alternativeText || product.name}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              )}
            />
          </div>

          {/* ... بخش توضیحات و دکمه ... */}
          <div className="md:w-1/2 w-full">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.short_description}</p>
            <div className="text-2xl font-bold text-primary mb-4 flex items-center justify-start gap-2">
              <span className="flex justify-start align-middle gap-1">
                {product.price?.toLocaleString()}
                <svg
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* ... (SVG paths) ... */}
                  <path
                    d="M3.2 9.12C2.752 9.12 2.33067 9.03467 1.936 8.864C1.552 8.704 1.216 8.48 0.928 8.192C0.64 7.904 0.410667 7.56267 0.24 7.168C0.08 6.784 0 6.368 0 5.92V1.648H1.104V5.744C1.104 6.032 1.15733 6.29867 1.264 6.544C1.37067 6.8 1.51467 7.01867 1.696 7.2C1.888 7.392 2.112 7.54133 2.368 7.648C2.624 7.75467 2.896 7.808 3.184 7.808H5.952C6.19733 7.808 6.42667 7.76 6.64 7.664C6.85333 7.57867 7.04 7.456 7.2 7.296C7.36 7.14667 7.48267 6.96533 7.568 6.752C7.664 6.54933 7.712 6.32533 7.712 6.08V1.376H8.816V6.272C8.816 6.66667 8.74133 7.03467 8.592 7.376C8.44267 7.728 8.23467 8.032 7.968 8.288C7.712 8.544 7.408 8.74667 7.056 8.896C6.71467 9.04533 6.34667 9.12 5.952 9.12H3.2ZM3.728 0H5.088V1.36H3.728V0Z"
                    fill="#B4B4B4"
                  />
                  <path
                    d="M3.70977 17.04C3.70977 17.1893 3.63511 17.264 3.48577 17.264H2.89377C2.56311 17.264 2.24844 17.2 1.94977 17.072C1.65111 16.944 1.38977 16.768 1.16577 16.544C0.941773 16.32 0.765773 16.0587 0.637773 15.76C0.509773 15.4613 0.445773 15.1467 0.445773 14.816V10.006H1.54977V14.8C1.54977 15.12 1.66177 15.392 1.88577 15.616C2.12044 15.84 2.39244 15.952 2.70177 15.952H3.48577C3.54977 15.952 3.60311 15.9787 3.64577 16.032C3.68844 16.0747 3.70977 16.128 3.70977 16.192V17.04Z"
                    fill="#B4B4B4"
                  />
                  <path
                    d="M7.22415 15.952H9.65616V13.808C9.65616 13.5307 9.55482 13.296 9.35215 13.104C9.16015 12.9013 8.92016 12.8 8.63216 12.8H7.59215C7.34682 12.8 7.13348 12.88 6.95215 13.04C6.77082 13.1893 6.65348 13.3813 6.60015 13.616L6.36015 14.912C6.30682 15.1893 6.36548 15.4347 6.53615 15.648C6.71748 15.8507 6.94682 15.952 7.22415 15.952ZM5.22415 14.944L5.56015 13.296C5.60281 13.0507 5.68815 12.8213 5.81615 12.608C5.94415 12.3947 6.09881 12.2133 6.28015 12.064C6.46148 11.9147 6.66415 11.7973 6.88815 11.712C7.12282 11.6266 7.36815 11.584 7.62415 11.584H8.52016C8.82949 11.584 9.11749 11.6427 9.38416 11.76C9.66149 11.8773 9.90149 12.0373 10.1042 12.24C10.3068 12.4426 10.4668 12.6773 10.5842 12.944C10.7015 13.2107 10.7602 13.4987 10.7602 13.808V15.824C10.7602 16.2507 10.6268 16.5973 10.3602 16.864C10.1042 17.1307 9.75215 17.264 9.30415 17.264H7.35215C7.01082 17.264 6.69615 17.184 6.40815 17.024C6.13082 16.8533 5.90148 16.5813 5.72015 16.208C5.52815 16.5813 5.27215 16.8533 4.95215 17.024C4.63215 17.184 4.29615 17.264 3.94415 17.264H3.48015C3.33081 17.264 3.25615 17.1893 3.25615 17.04V16.176C3.25615 16.1227 3.27748 16.0747 3.32015 16.032C3.36281 15.9787 3.41615 15.952 3.48015 15.952H3.99215C4.30148 15.952 4.56815 15.856 4.79215 15.664C5.02681 15.472 5.17081 15.232 5.22415 14.944Z"
                    fill="#B4B4B4"
                  />
                  <path
                    d="M14.8666 17.264C14.5359 17.264 14.2319 17.1947 13.9546 17.056C13.6772 16.9173 13.4426 16.7307 13.2506 16.496C13.0586 16.2613 12.9199 15.9947 12.8346 15.696C12.7492 15.3867 12.7386 15.072 12.8026 14.752L13.0746 13.296C13.1172 13.0507 13.2026 12.8267 13.3306 12.624C13.4586 12.4107 13.6132 12.2293 13.7946 12.08C13.9759 11.9306 14.1786 11.8133 14.4026 11.728C14.6372 11.6427 14.8826 11.6 15.1386 11.6H16.0346C16.3439 11.6 16.6319 11.6586 16.8986 11.776C17.1759 11.8933 17.4159 12.0533 17.6186 12.256C17.8212 12.448 17.9812 12.6827 18.0986 12.96C18.2159 13.2267 18.2746 13.5147 18.2746 13.824V15.952H19.5386C19.6026 15.952 19.6559 15.9787 19.6986 16.032C19.7412 16.0747 19.7626 16.1227 19.7626 16.176V17.04C19.7626 17.1893 19.6879 17.264 19.5386 17.264H18.2586V17.456C18.2372 18.1813 18.0079 18.832 17.5706 19.408C17.1439 19.9947 16.5786 20.4107 15.8746 20.656L14.0506 21.28L13.6986 20.176L15.6186 19.536C16.0772 19.376 16.4452 19.104 16.7226 18.72C17.0106 18.3467 17.1546 17.9147 17.1546 17.424V17.136C17.0692 17.1893 16.9679 17.2267 16.8506 17.248C16.7439 17.2587 16.6319 17.264 16.5146 17.264H14.8666ZM14.7546 15.952H17.1706V13.824C17.1706 13.5467 17.0692 13.312 16.8666 13.12C16.6746 12.9173 16.4399 12.816 16.1626 12.816H15.1066C14.8612 12.816 14.6479 12.8907 14.4666 13.04C14.2852 13.1893 14.1679 13.3867 14.1146 13.632L13.8746 14.912C13.8212 15.1893 13.8852 15.4347 14.0666 15.648C14.2479 15.8507 14.4772 15.952 14.7546 15.952Z"
                    fill="#B4B4B4"
                  />
                  <path
                    d="M21.4787 15.952C21.7987 15.952 22.0707 15.84 22.2947 15.616C22.5187 15.392 22.6307 15.1253 22.6307 14.816V11.872H23.7347V14.816C23.7347 15.1573 23.6707 15.4773 23.5427 15.776C23.4147 16.0747 23.2387 16.336 23.0147 16.56C22.7907 16.7733 22.5294 16.944 22.2307 17.072C21.9427 17.2 21.628 17.264 21.2867 17.264H19.5427C19.3934 17.264 19.3187 17.1893 19.3187 17.04V16.192C19.3187 16.128 19.34 16.0747 19.3827 16.032C19.4254 15.9787 19.4787 15.952 19.5427 15.952H21.4787ZM20.1667 9.99998H21.5267V8.64H20.1667V9.99998ZM22.3587 9.99998H23.7187V8.64H22.3587V9.99998Z"
                    fill="#B4B4B4"
                  />
                </svg>
              </span>
              {/* ... (آیکون SVG تومان) ... */}
            </div>
            <div>
              {/* ✅ دکمه ثبت سفارش که مودال را باز می‌کند */}
              {/* <button
                className="bg-primary text-[#696969] px-6 py-3 rounded-lg bg-[#EDE9DE] hover:bg-[#B4B4B4] cursor-pointer transition"
                onClick={() => {
                  console.log("Opening modal...");
                  setIsOrderModalOpen(true);
                }}
              >
                ثبت سفارش
              </button> */}
              <button
                disabled={product.stock <= 0}
                className={`flex-1 px-8 py-4 rounded-xl font-bold transition-all shadow-lg ${
                  product.stock > 0
                    ? "bg-[#3F3F3F] text-[#EDE9DE] hover:bg-[#C5A35C] cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={handleAddToCart}
              >
                {product.stock > 0 ? "افزودن به سبد خرید" : "ناموجود"}
              </button>
            </div>
          </div>
        </div>

        {/* ... بخش Tabs ... */}
        <div className="px-[58px] mb-16">
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              centered
            >
              <Tab label="توضیحات محصول" />
              <Tab label="مشخصات فنی" />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <div className="prose max-w-none">
              {product.description[0]?.children[0]?.text}
            </div>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <div className="grid grid-cols-2 gap-4">
              {product.specifications.map((spec) => (
                <div
                  key={spec.id}
                  className="flex justify-between p-3 bg-gray-50 rounded"
                >
                  <span className="font-medium">{spec.attribute}</span>
                  <span>{spec.value}</span>
                </div>
              ))}
            </div>
          </TabPanel>
        </div>

        {/* ✅ رندر کردن کامپوننت مودال (پاپ‌آپ) */}
        {/* این کامپوننت تا زمانی که 'open' false باشد، پنهان است */}
        {/* <OrderModal
          open={isOrderModalOpen}
          onClose={() => {
            console.log("Closing modal...");
            setIsOrderModalOpen(false);
          }}
          product={product}
        /> */}
      </main>
      <Footer />
    </Suspense>
  );
}
