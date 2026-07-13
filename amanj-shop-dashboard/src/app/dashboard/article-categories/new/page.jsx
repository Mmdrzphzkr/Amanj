import ArticleCategoryForm from "../ArticleCategoryForm";
import { getStrapiData } from "@/lib/strapi";

export default async function NewArticleCategoryPage() {
  const { data: categories } = await getStrapiData("/api/article-categories");

  return (
    <div>
      <ArticleCategoryForm allCategories={categories} />
    </div>
  );
}
