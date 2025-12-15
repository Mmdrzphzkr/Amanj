// middleware.js (در کنار پوشه app یا src)
import { NextResponse } from "next/server";

export function middleware(request) {
  // خواندن کوکی که در فایل route.js ست کردید
  const token = request.cookies.get("strapi_jwt");
  const url = request.nextUrl.clone();

  // لیست مسیرهایی که نیاز به لاگین دارند
  const protectedPaths = ["/checkout", "/profile", "/dashboard"];
  const isProtected = protectedPaths.some((path) =>
    url.pathname.startsWith(path)
  );

  // اگر مسیر محافظت شده است و توکن نداریم -> برو به لاگین
  if (isProtected && !token) {
    url.pathname = "/login";
    // آدرس فعلی را هم نگه دار تا بعد از لاگین برگردد
    url.searchParams.set("callbackUrl", request.nextUrl.pathname); 
    return NextResponse.redirect(url);
  }

  // اگر در صفحه لاگین هستیم و توکن داریم -> برو به داشبورد (نمی‌خواد دوباره لاگین کنه)
  if (url.pathname === "/login" && token) {
    url.pathname = "/dashboard"; // یا /profile
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// کانفیگ برای اینکه میدل‌ور روی فایل‌های استاتیک و عکس‌ها اجرا نشود
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};