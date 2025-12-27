"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { fetchStrapiData } from "@/lib/strapi-frontend";
import { addItem } from "@/redux/slices/cartSlice";
import { toast } from "react-hot-toast";

// MUI Components
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Paper,
  useTheme,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

// Project Components
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import SwiperWrapper from "@/components/Swiper/SwiperWrapper";
import Loading from "@/components/Loading/Loading";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ padding: "24px 0" }}>
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

  const brandColors = {
    bg: "#F9F8F5",
    accent: "#EDE9DE",
    textMain: "#3F3F3F",
    gold: "#C5A35C",
    dark: "#1A1A1A",
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
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
    if (slug) fetchProduct();
  }, [slug]);

  if (loading) return <Loading />;
  if (!product)
    return <Box sx={{ py: 10, textAlign: "center" }}>محصول یافت نشد</Box>;

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000";

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
      toast.success(`${product.name} به سبد خرید اضافه شد`, {
        style: {
          borderRadius: "12px",
          background: brandColors.dark,
          color: "#fff",
        },
        iconTheme: { primary: brandColors.gold, secondary: "#fff" },
      });
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <main className="container mx-auto">
        <Header />

        <Box sx={{ mt: 12, mb: 4, px: { xs: 2, md: 7.25 } }}>
          <Breadcrumb category={product.category} currentTitle={product.name} />
        </Box>

        {/* چیدمان فلکس شما حفظ شده است */}
        <div className="flex md:flex-row flex-col gap-8 justify-center px-[58px] mb-16">
          {/* بخش گالری */}
          <div className="md:w-1/2 w-full">
            <Paper
              elevation={0}
              sx={{
                position: "relative",
                borderRadius: "24px",
                overflow: "hidden",
                mb: 2,
                border: `1px solid ${brandColors.accent}`,
              }}
            >
              <Box
                className="brand-name"
                sx={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  bgcolor: brandColors.accent,
                  px: 2,
                  py: 0.5,
                  borderRadius: "20px",
                  fontWeight: "bold",
                  color: "#696969",
                  z_index: 2,
                }}
              >
                {product.brand?.name}
              </Box>
              <img
                src={`${STRAPI_URL}${product.gallery[selectedImage].url}`}
                alt={product.name}
                className="w-full h-auto"
              />
            </Paper>

            <SwiperWrapper
              items={product.gallery}
              modules={[FreeMode, Navigation, Thumbs]}
              swiperOptions={{ spaceBetween: 10, slidesPerView: 4 }}
              renderItem={(image, index) => (
                <Box
                  className={`cursor-pointer border-2 rounded-xl overflow-hidden transition-all ${
                    selectedImage === index
                      ? "border-[#C5A35C]"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={`${STRAPI_URL}${
                      image.formats?.thumbnail?.url || image.url
                    }`}
                    alt={product.name}
                    className="w-full h-auto"
                  />
                </Box>
              )}
            />
          </div>

          {/* بخش توضیحات و دکمه */}
          <div
            className="md:w-1/2 w-full flex flex-col justify-start p-3 rounded-3xl"
            style={{ backgroundColor: brandColors.bg }}
          >
            <Typography
              variant="h3"
              fontWeight="900"
              sx={{ color: brandColors.textMain, mb: 2 }}
            >
              {product.name}
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: "text.secondary", mb: 4, lineHeight: 1.8 }}
            >
              {product.short_description}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 4 }}
            >
              <Typography
                variant="h4"
                fontWeight="800"
                sx={{ color: brandColors.gold }}
              >
                {product.price?.toLocaleString()}
              </Typography>
              <Typography variant="h6" color="text.disabled">
                تومان
              </Typography>
            </Stack>
            <Divider />
            <Button
              disabled={product.stock <= 0}
              variant="contained"
              fullWidth
              onClick={handleAddToCart}
              startIcon={<ShoppingBagOutlinedIcon />}
              sx={{
                bgcolor: brandColors.dark,
                color: brandColors.accent,
                py: 2,
                borderRadius: "50px", // لبه گرد مشابه تصویر برند
                fontWeight: "bold",
                fontSize: "1.1rem",
                "&:hover": {
                  bgcolor: brandColors.gold,
                  color: brandColors.dark,
                },
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                mt: "20px",
              }}
            >
              {product.stock > 0 ? "افزودن به سبد خرید" : "ناموجود"}
            </Button>
          </div>
        </div>

        {/* بخش Tabs با استایل MUI */}
        <Box sx={{ px: { xs: 4, md: 7.25 }, mb: 10 }}>
          <Box sx={{ borderBottom: 1, borderColor: brandColors.accent }}>
            <Tabs
              value={tabValue}
              onChange={(e, v) => setTabValue(v)}
              centered
              sx={{
                "& .MuiTabs-indicator": {
                  bgcolor: brandColors.gold,
                  height: 3,
                },
                "& .MuiTab-root": {
                  fontWeight: "bold",
                  color: "#888",
                  "&.Mui-selected": { color: brandColors.textMain },
                },
              }}
            >
              <Tab label="توضیحات محصول" />
              <Tab label="مشخصات فنی" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "20px",
                bgcolor: "#fff",
                border: `1px solid ${brandColors.accent}`,
              }}
            >
              <Typography sx={{ lineHeight: 2, color: brandColors.textMain }}>
                {product.description[0]?.children[0]?.text}
              </Typography>
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specifications.map((spec) => (
                <Paper
                  key={spec.id}
                  elevation={0}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 2,
                    bgcolor: brandColors.accent,
                    borderRadius: "12px",
                    border: "1px solid #DED9CC",
                  }}
                >
                  <Typography fontWeight="bold" variant="body2">
                    {spec.attribute}
                  </Typography>
                  <Typography variant="body2">{spec.value}</Typography>
                </Paper>
              ))}
            </div>
          </TabPanel>
        </Box>
      </main>
      <Footer />
    </Suspense>
  );
}
