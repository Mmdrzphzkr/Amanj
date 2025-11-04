"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "@mui/icons-material";

const Breadcrumb = ({ category, currentTitle }) => {
  const pathname = usePathname();

  const breadcrumbItems = [
    { title: "خانه", path: "/" },
    category && {
      title: category.name,
      path: `/categories/${category.slug}` // حذف site از مسیر
    },
    { title: currentTitle, path: pathname },
  ].filter(Boolean);

  return (
    <nav className="flex px-[58px] py-4 text-sm">
      <ol className="flex items-center space-x-2 space-x-reverse">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={item.path} className="flex items-center">
              {!isLast ? (
                <>
                  <Link
                    href={item.path}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {item.title}
                  </Link>
                  <ChevronLeft className="mx-2 text-gray-400" />
                </>
              ) : (
                <span className="text-gray-900 font-medium">{item.title}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
