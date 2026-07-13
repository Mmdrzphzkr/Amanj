import Link from "next/link";
import { Container, Box, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import MobileNav from "@/components/MobileNav/MobileNav";

const STRAPI_URL = (
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000"
).replace(/\/+$/, "");

async function getArticles() {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/articles?populate=*&sort=published_date:desc&pagination[pageSize]=50`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data?.data || [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/article-categories?populate=*`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data?.data || [];
  } catch {
    return [];
  }
}

export const metadata = {
  title: "مقالات - Amanj Coffee",
  description: "مقالات تخصصی در مورد تعمیرات، نگهداری و نکات مفید درباره انواع دستگاه‌های کافی‌شاپ و خدمات تکنیکا",
};

export default async function ArticlesPage() {
  const [articles, categories] = await Promise.all([getArticles(), getCategories()]);

  return (
    <>
      <Header />
      <Box sx={{ backgroundColor: "#F9F8F5", minHeight: "100vh", pt: { xs: 10, md: 12 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 7.25 }, py: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 900, mb: 2, color: "#3F3F3F" }}>
            مقالات
          </Typography>
          <Typography variant="body1" sx={{ color: "#696969", mb: 4, maxWidth: "600px", fontSize: "16px", lineHeight: 1.8 }}>
            نکات مفید، راهنماهای تعمیر و نگهداری، و مقالات تخصصی درباره محصولات و خدمات ما
          </Typography>

          {categories.length > 0 && (
            <Box sx={{ mb: 5, display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Link href="/articles" style={{
                display: "inline-flex", alignItems: "center", padding: "8px 20px",
                borderRadius: "50px", fontWeight: 600, fontSize: "14px",
                background: "#C5A35C", color: "#fff", textDecoration: "none",
              }}>
                همه مقالات
              </Link>
              {categories.map((cat) => {
                const attrs = cat.attributes ?? cat;
                return (
                  <Link key={cat.id || cat.documentId} href={`/article-categories/${attrs.slug}`} style={{
                    display: "inline-flex", alignItems: "center", padding: "8px 20px",
                    borderRadius: "50px", fontWeight: 600, fontSize: "14px",
                    background: "#EDE9DE", color: "#696969", textDecoration: "none",
                    transition: "all 0.2s",
                  }}>
                    {attrs.name}
                  </Link>
                );
              })}
            </Box>
          )}

          {articles.length === 0 ? (
            <Box sx={{ py: 10, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                هنوز مقاله‌ای منتشر نشده است
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {articles.map((article) => {
                const attrs = article.attributes ?? article;
                const title = attrs.title || "";
                const excerpt = attrs.excerpt || "";
                const slug = attrs.slug || "";
                const imageUrl = attrs.image?.url
                  ? `${STRAPI_URL}${attrs.image.url}`
                  : null;
                const published_date = attrs.published_date
                  ? new Date(attrs.published_date).toLocaleDateString("fa-IR")
                  : "";
                const categoryName = attrs.category?.name || attrs.category?.data?.attributes?.name || null;

                return (
                  <Grid key={article.id || article.documentId} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Link href={`/articles/${slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
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
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                            {categoryName && (
                              <Typography variant="caption" sx={{
                                background: "#EDE9DE", color: "#696969",
                                padding: "3px 12px", borderRadius: "50px",
                                fontWeight: 600, fontSize: "11px",
                              }}>
                                {categoryName}
                              </Typography>
                            )}
                            {published_date && (
                              <Typography variant="caption" sx={{ color: "#C5A35C", fontWeight: 600, fontSize: "11px" }}>
                                {published_date}
                              </Typography>
                            )}
                          </Box>
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
