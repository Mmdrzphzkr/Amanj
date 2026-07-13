import { getStrapiData } from "@/lib/strapi";
import ArticleForm from "../ArticleForm";

export default async function EditArticlePage({ params }) {
  const { id } = params;
  const { data: articleToEdit } = await getStrapiData(`/api/articles/${id}?populate=*`);
  const { data: categories } = await getStrapiData("/api/article-categories");

  if (!articleToEdit) {
    return <div style={{ padding: "40px", textAlign: "center", color: "var(--danger)" }}>مقاله مورد نظر یافت نشد</div>;
  }

  return <ArticleForm categories={categories} initialData={articleToEdit} />;
}
