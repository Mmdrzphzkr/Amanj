import ArticleCategoryForm from "../ArticleCategoryForm";
import { getStrapiData } from "@/lib/strapi";

export default async function EditArticleCategoryPage({ params }) {
  const { id } = params;
  const { data: categoryToEdit } = await getStrapiData(`/api/article-categories/${id}`);
  const { data: allCategories } = await getStrapiData("/api/article-categories");

  if (!categoryToEdit) {
    return <div style={{ padding: "40px", textAlign: "center", color: "var(--danger)" }}>دسته‌بندی مورد نظر یافت نشد</div>;
  }

  return (
    <div>
      <ArticleCategoryForm initialData={categoryToEdit} allCategories={allCategories} />
    </div>
  );
}
