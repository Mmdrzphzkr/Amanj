// middleware.js (در کنار پوشه app یا src)
import { NextResponse } from "next/server";

// Simple JWT expiration check (basic validation)
function isTokenValid(token) {
  if (!token) return false;
  
  try {
    // Split JWT into parts
    const parts = token.value.split('.');
    if (parts.length !== 3) return false;
    
    // Decode payload (middle part)
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    // Check if token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    // If we can't parse the token, consider it invalid
    return false;
  }
}

export function middleware(request) {
  // خواندن کوکی که در فایل route.js ست کردید
  const token = request.cookies.get("strapi_jwt");
  const url = request.nextUrl.clone();

  // Validate token if it exists
  const isTokenPresent = !!token;
  const isTokenStillValid = isTokenValid(token);

  // لیست مسیرهایی که نیاز به لاگین دارند
  const protectedPaths = ["/checkout", "/profile", "/dashboard"];
  const isProtected = protectedPaths.some((path) =>
    url.pathname.startsWith(path)
  );

  // اگر مسیر محافظت شده است و توکن نداریم یا توکن منقضی شده -> برو به لاگین
  if (isProtected && (!isTokenPresent || !isTokenStillValid)) {
    url.pathname = "/login";
    // آدرس فعلی را هم نگه دار تا بعد از لاگین برگردد
    url.searchParams.set("callbackurl", request.nextUrl.pathname); 
    return NextResponse.redirect(url);
  }

  // اگر در صفحه لاگین هستیم و توکن داریم و معتبر است -> برو به داشبورد
  if (url.pathname === "/login" && isTokenPresent && isTokenStillValid) {
    url.pathname = "/dashboard"; // یا /profile
    return NextResponse.redirect(url);
  }

  // Add security headers to response
  const response = NextResponse.next();
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

// کانفیگ برای اینکه میدل‌ور روی فایل‌های استاتیک و عکس‌ها اجرا نشود
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};