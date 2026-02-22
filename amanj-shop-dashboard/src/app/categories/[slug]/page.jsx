// amanj-shop-dashboard/src/app/categories/[slug]/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "@/redux/slices/categorySlice";
import { fetchStrapiData } from "@/lib/strapi-frontend";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ProductCard from "@/components/ProdcutCard/ProductCard";
import { Container, Box, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "@/components/Loading/Loading";

export default function CategoryPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decode the URL encoded slug
  const decodedSlug = decodeURIComponent(slug);

  // دریافت دسته‌بندی‌ها از Redux store
  const categories = useSelector((state) => state.categories.items);
  const categoryStatus = useSelector((state) => state.categories.status);

  // Use decoded slug for comparison
  const currentCategory = categories.find((cat) => cat.slug === decodedSlug);

  useEffect(() => {
    if (categoryStatus === "idle") {
      dispatch(fetchCategory());
    }

    const fetchCategoryProducts = async () => {
      try {
        // Use decoded slug in API call
        const response = await fetchStrapiData(
          `/api/products?filters[category][slug][$eq]=${decodedSlug}&populate=*`
        );
        if (response) {
          setProducts(response);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching category products:", error);
        setLoading(false);
      }
    };

    if (decodedSlug) {
      fetchCategoryProducts();
    }
  }, [decodedSlug, dispatch, categoryStatus]);

  if (loading || categoryStatus === "loading") {
    return <Loading />;
  }

  if (!currentCategory) {
    return <div>دسته‌بندی مورد نظر یافت نشد</div>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Header />
      <Box sx={{ pt: { xs: 8, md: 10 }, backgroundColor: "#F9F8F5" }}>
        <Container maxWidth="lg">
          <Breadcrumb
            category={currentCategory}
            currentTitle={currentCategory.name}
          />
        </Container>
      </Box>

      <Box component="main" sx={{ backgroundColor: "#F9F8F5" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 7.25 }, py: 6 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 4, color: "text.primary" }}>
            {currentCategory.name}
          </Typography>

          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid key={product.id} size={{ xs: 6, md: 4, lg: 3 }} >
                <Link
                  href={`/products/${product.slug}`}
                  style={{ display: "block", height: "100%" }}
                >
                  <ProductCard
                    product={product}
                    strapiUrl={process.env.NEXT_PUBLIC_STRAPI_URL}
                  />
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Suspense>
  );
}
