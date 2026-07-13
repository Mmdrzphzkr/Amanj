import Link from "next/link";
import { Container, Box, Typography, Paper } from "@mui/material";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import MobileNav from "@/components/MobileNav/MobileNav";

const STRAPI_URL = (
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000"
).replace(/\/+$/, "");

async function getArticle(slug) {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data?.data?.[0] || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: "مقاله یافت نشد - Amanj Coffee" };
  }

  const attrs = article.attributes ?? article;
  const metaTitle = attrs.SEO?.metaTitle || attrs.title || "مقاله";
  const metaDescription = attrs.SEO?.metaDescription || attrs.excerpt || "";
  const shareImage = attrs.SEO?.shareImage?.url || attrs.image?.url || null;
  const fullTitle = `${metaTitle} - Amanj Coffee`;

  return {
    title: fullTitle,
    description: metaDescription,
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      type: "article",
      publishedTime: attrs.published_date || null,
      authors: attrs.author ? [attrs.author] : [],
      images: shareImage ? [`${STRAPI_URL}${shareImage}`] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      images: shareImage ? [`${STRAPI_URL}${shareImage}`] : [],
    },
    alternates: {
      canonical: `https://amanjcoffee.com/articles/${slug}`,
    },
  };
}

function renderContent(content) {
  if (!content) return null;
  if (typeof content === "string") {
    return content.split("\n").map((paragraph, i) => (
      <Typography key={i} variant="body1" sx={{ mb: 2, lineHeight: 2, color: "#3F3F3F", fontSize: "16px" }}>
        {paragraph}
      </Typography>
    ));
  }
  if (Array.isArray(content)) {
    return content.map((block, i) => {
      if (block.type === "heading" || block.type === "header") {
        const level = block.level || 2;
        const text = block.children?.[0]?.text || "";
        const variants = { 1: "h4", 2: "h5", 3: "h6" };
        return (
          <Typography key={i} variant={variants[level] || "h5"} sx={{ fontWeight: 700, mt: 3, mb: 1.5, color: "#3F3F3F" }}>
            {text}
          </Typography>
        );
      }
      if (block.type === "paragraph") {
        const text = block.children?.map((c) => c.text || c.bold || "").join("") || "";
        return (
          <Typography key={i} variant="body1" sx={{ mb: 2, lineHeight: 2, color: "#3F3F3F", fontSize: "16px" }}>
            {text}
          </Typography>
        );
      }
      if (block.type === "list") {
        const items = block.children || [];
        return (
          <Box key={i} component="ul" sx={{ mb: 2, pr: 3 }}>
            {items.map((item, j) => (
              <li key={j}>
                <Typography variant="body1" sx={{ lineHeight: 2, color: "#3F3F3F" }}>
                  {item.children?.[0]?.text || ""}
                </Typography>
              </li>
            ))}
          </Box>
        );
      }
      if (block.type === "image") {
        const url = block.image?.url || block.url || "";
        return url ? (
          <Box key={i} sx={{ my: 3, textAlign: "center" }}>
            <img
              src={url.startsWith("http") ? url : `${STRAPI_URL}${url}`}
              alt={block.image?.alternativeText || ""}
              style={{ maxWidth: "100%", borderRadius: "16px" }}
            />
          </Box>
        ) : null;
      }
      if (block.type === "code") {
        return (
          <Paper key={i} elevation={0} sx={{ p: 3, bgcolor: "#1a1a2e", borderRadius: "12px", mb: 2, overflow: "auto" }}>
            <Typography component="pre" sx={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: "14px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {block.children?.[0]?.text || ""}
            </Typography>
          </Paper>
        );
      }
      return null;
    }).filter(Boolean);
  }
  return <Typography>{String(content)}</Typography>;
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = params;
  const article = await getArticle(slug);

  if (!article) {
    return (
      <>
        <Header />
        <Box sx={{ py: 10, textAlign: "center", minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
          <Typography variant="h5" sx={{ color: "#3F3F3F" }}>مقاله مورد نظر یافت نشد</Typography>
          <Link href="/articles" style={{ color: "#C5A35C", fontWeight: 600, textDecoration: "none" }}>
            بازگشت به مقالات
          </Link>
        </Box>
        <MobileNav />
        <Footer />
      </>
    );
  }

  const attrs = article.attributes ?? article;
  const title = attrs.title || "";
  const excerpt = attrs.excerpt || "";
  const content = attrs.content || "";
  const imageUrl = attrs.image?.url ? `${STRAPI_URL}${attrs.image.url}` : null;
  const published_date = attrs.published_date
    ? new Date(attrs.published_date).toLocaleDateString("fa-IR")
    : "";
  const categoryName = attrs.category?.name || attrs.category?.data?.attributes?.name || null;
  const categorySlug = attrs.category?.slug || attrs.category?.data?.attributes?.slug || null;
  const author = attrs.author || null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt || attrs.SEO?.metaDescription || "",
    image: imageUrl || (attrs.SEO?.shareImage?.url ? `${STRAPI_URL}${attrs.SEO.shareImage.url}` : undefined),
    datePublished: attrs.published_date || undefined,
    author: author ? {
      "@type": "Person",
      name: author,
    } : {
      "@type": "Organization",
      name: "Amanj Coffee",
    },
    publisher: {
      "@type": "Organization",
      name: "Amanj Coffee",
      logo: {
        "@type": "ImageObject",
        url: "https://amanjcoffee.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://amanjcoffee.com/articles/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Box sx={{ backgroundColor: "#F9F8F5", minHeight: "100vh", pt: { xs: 10, md: 12 } }}>
        <Container maxWidth="md" sx={{ px: { xs: 2, md: 7.25 }, py: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3, fontSize: "14px" }}>
            <Link href="/" style={{ color: "#696969", textDecoration: "none" }}>خانه</Link>
            <span style={{ color: "#696969" }}>/</span>
            <Link href="/articles" style={{ color: "#696969", textDecoration: "none" }}>مقالات</Link>
            {categorySlug && categoryName && (
              <>
                <span style={{ color: "#696969" }}>/</span>
                <Link href={`/article-categories/${categorySlug}`} style={{ color: "#696969", textDecoration: "none" }}>
                  {categoryName}
                </Link>
              </>
            )}
            <span style={{ color: "#696969" }}>/</span>
            <span style={{ color: "#3F3F3F", fontWeight: 600 }}>{title}</span>
          </Box>

          {imageUrl && (
            <Box sx={{
              width: "100%", borderRadius: "24px", overflow: "hidden", mb: 4,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}>
              <img src={imageUrl} alt={title} style={{ width: "100%", height: "auto", maxHeight: "450px", objectFit: "cover", display: "block" }} />
            </Box>
          )}

          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
              {categoryName && (
                <Link href={`/article-categories/${categorySlug}`} style={{
                  background: "#EDE9DE", color: "#696969", padding: "4px 16px",
                  borderRadius: "50px", fontWeight: 600, fontSize: "13px",
                  textDecoration: "none",
                }}>
                  {categoryName}
                </Link>
              )}
              {published_date && (
                <Typography variant="caption" sx={{ color: "#C5A35C", fontWeight: 600 }}>
                  {published_date}
                </Typography>
              )}
              {author && (
                <Typography variant="caption" sx={{ color: "#696969" }}>
                  نویسنده: {author}
                </Typography>
              )}
            </Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 900, color: "#3F3F3F", mb: 2, lineHeight: 1.3, fontSize: { xs: "1.75rem", md: "2.25rem" } }}>
              {title}
            </Typography>
            {excerpt && (
              <Typography variant="body1" sx={{ color: "#696969", fontSize: "16px", lineHeight: 1.8, maxWidth: "700px" }}>
                {excerpt}
              </Typography>
            )}
          </Box>

          <Paper elevation={0} sx={{
            p: { xs: 3, md: 5 }, borderRadius: "24px", bgcolor: "#fff",
            border: "1px solid #EDE9DE", mb: 6,
          }}>
            {renderContent(content)}
          </Paper>

          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Link href="/articles" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              color: "#C5A35C", fontWeight: 700, textDecoration: "none",
              fontSize: "15px", padding: "10px 24px", borderRadius: "50px",
              border: "2px solid #C5A35C", transition: "all 0.2s",
            }}>
              بازگشت به همه مقالات
            </Link>
          </Box>
        </Container>
      </Box>
      <MobileNav />
      <Footer />
    </>
  );
}
