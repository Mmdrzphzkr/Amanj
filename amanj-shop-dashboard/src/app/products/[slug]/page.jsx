// page.jsx
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
// ✅ ایمپورت کردن کامپوننت مودال (پاپ‌آپ)
import OrderModal from "@/components/Modal/OrderModal";

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
              <span>{product.price?.toLocaleString()}</span>
              {/* ... (آیکون SVG تومان) ... */}
            </div>
            <div>
              {/* ✅ دکمه ثبت سفارش که مودال را باز می‌کند */}
              <button
                className="bg-primary text-[#696969] px-6 py-3 rounded-lg bg-[#EDE9DE] hover:bg-[#B4B4B4] cursor-pointer transition"
                onClick={() => {
                  console.log("Opening modal...");
                  setIsOrderModalOpen(true);
                }}
              >
                ثبت سفارش
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
        <OrderModal
          open={isOrderModalOpen}
          onClose={() => {
            console.log("Closing modal...");
            setIsOrderModalOpen(false);
          }}
          product={product}
        />
      </main>
      <Footer />
    </Suspense>
  );
}
