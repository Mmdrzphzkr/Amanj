import { getStrapiData } from "@/lib/strapi";
import ArticleForm from "../ArticleForm";

export default async function NewArticlePage() {
  const { data: categories } = await getStrapiData("/api/article-categories");

  if (!categories || categories.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1 className="page-title" style={{ marginBottom: "16px" }}>خطا: دسته‌بندی مقاله وجود ندارد</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "14px" }}>
          شما نمی‌توانید مقاله‌ای را بدون اختصاص دادن به یک دسته‌بندی ایجاد کنید.
          لطفاً ابتدا یک دسته‌بندی مقاله بسازید.
        </p>
        <a href="/dashboard/article-categories/new" className="btn-primary" style={{ textDecoration: "none" }}>
          ایجاد دسته‌بندی مقاله
        </a>
      </div>
    );
  }

  return <ArticleForm categories={categories} />;
}
