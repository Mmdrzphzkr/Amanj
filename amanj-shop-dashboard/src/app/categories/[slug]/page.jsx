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
      <div class="bread-crumb__container pt-20 bg-[#F9F8F5]">
        <Breadcrumb
          category={currentCategory}
          currentTitle={currentCategory.name}
        />
      </div>
      <main className="container mx-auto bg-[#F9F8F5]">
        <div className="px-[58px] py-8">
          <h1 className="text-3xl font-bold mb-8">{currentCategory.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                href={`/products/${product.slug}`}
                className="block w-full h-full p-1"
              >
                <ProductCard
                  key={product.id}
                  product={product}
                  strapiUrl={process.env.NEXT_PUBLIC_STRAPI_URL}
                />
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </Suspense>
  );
}
