import Link from "next/link";
import { Container, Box, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import MobileNav from "@/components/MobileNav/MobileNav";

const STRAPI_URL = (
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000"
).replace(/\/+$/, "");

async function getCategoryAndArticles(slug) {
  try {
    const catRes = await fetch(
      `${STRAPI_URL}/api/article-categories?filters[slug][$eq]=${slug}&populate=*`,
      { cache: "no-store" }
    );
    const catData = await catRes.json();
    const category = catData?.data?.[0] || null;
    if (!category) return { category: null, articles: [] };

    const artRes = await fetch(
      `${STRAPI_URL}/api/articles?filters[category][slug][$eq]=${slug}&populate=*&sort=publishedAt:desc`,
      { cache: "no-store" }
    );
    const artData = await artRes.json();
    return { category, articles: artData?.data || [] };
  } catch {
    return { category: null, articles: [] };
  }
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { category } = await getCategoryAndArticles(slug);
  if (!category) {
    return { title: "دسته‌بندی یافت نشد - Amanj Coffee" };
  }
  return {
    title: `${category.name} - مقالات Amanj Coffee`,
    description: category.description || `مقالات مرتبط با ${category.name}`,
  };
}

export default async function ArticleCategoryPage({ params }) {
  const { slug } = params;
  const { category, articles } = await getCategoryAndArticles(slug);

  if (!category) {
    return (
      <>
        <Header />
        <Box sx={{ py: 10, textAlign: "center" }}>
          <Typography variant="h5">دسته‌بندی مورد نظر یافت نشد</Typography>
          <Link href="/articles" style={{ color: "#C5A35C", marginTop: "16px", display: "inline-block" }}>
            بازگشت به مقالات
          </Link>
        </Box>
        <MobileNav />
        <Footer />
      </>
    );
  }

  const attrs = category.attributes ?? category;

  return (
    <>
      <Header />
      <Box sx={{ backgroundColor: "#F9F8F5", minHeight: "100vh", pt: { xs: 10, md: 12 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 7.25 }, py: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, color: "#3F3F3F" }}>
            {attrs.name}
          </Typography>
          {attrs.description && (
            <Typography variant="body1" sx={{ color: "#696969", mb: 4, maxWidth: "600px" }}>
              {attrs.description}
            </Typography>
          )}

          {articles.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                هنوز مقاله‌ای در این دسته‌بندی منتشر نشده است
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {articles.map((article) => {
                const artAttrs = article.attributes ?? article;
                const title = artAttrs.title || "";
                const excerpt = artAttrs.excerpt || "";
                const artSlug = artAttrs.slug || "";
                const imageUrl = artAttrs.image?.url
                  ? `${STRAPI_URL}${artAttrs.image.url}`
                  : null;
                const publishedAt = artAttrs.publishedAt
                  ? new Date(artAttrs.publishedAt).toLocaleDateString("fa-IR")
                  : "";

                return (
                  <Grid key={article.id || article.documentId} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Link href={`/articles/${artSlug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                      <Card sx={{
                        borderRadius: "24px", overflow: "hidden", height: "100%",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 24px rgba(0,0,0,0.1)" },
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      }}>
                        {imageUrl && (
                          <CardMedia
                            component="img"
                            height="200"
                            image={imageUrl}
                            alt={title}
                            sx={{ objectFit: "cover" }}
                          />
                        )}
                        <CardContent sx={{ p: 3 }}>
                          {publishedAt && (
                            <Typography variant="caption" sx={{ color: "#C5A35C", fontWeight: 600, mb: 1, display: "block" }}>
                              {publishedAt}
                            </Typography>
                          )}
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#3F3F3F", lineHeight: 1.4 }}>
                            {title}
                          </Typography>
                          {excerpt && (
                            <Typography variant="body2" sx={{ color: "#696969", lineHeight: 1.7 }}>
                              {excerpt.length > 120 ? excerpt.slice(0, 120) + "..." : excerpt}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>
      <MobileNav />
      <Footer />
    </>
  );
}
