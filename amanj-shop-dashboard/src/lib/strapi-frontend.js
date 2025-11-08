// src/lib/strapi-frontend.js (نسخه اصلاح شده)
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000";

// 💡 تابع اکنون یک آرگومان اختیاری 'options' را می‌پذیرد
export async function fetchStrapiData(path, options = {}) {
  const url = `${STRAPI_URL}${path}`; // 💡 اضافه کردن هدرهای پیش‌فرض برای POST/PUT

  const mergedOptions = {
    headers: {
      "Content-Type": "application/json", // می‌توانید اینجا هدرهای احراز هویت (Auth) را نیز اضافه کنید
    },
    next: { revalidate: 60 }, // Revalidate data every 60 seconds (برای GET)
    ...options, // ادغام با آپشن‌های ارسالی (مثل method و body)
  };

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      // 🚨 اگر پاسخ موفق نبود، کل JSON خطا را می‌گیریم
      const errorData = await response.json(); // 💡 پرتاب آبجکت خطا به جای رشته عمومی، برای Redux // این باعث می‌شود Redux Thunk بتواند خطا را بگیرد و reject کند.
      throw errorData;
    }

    const data = await response.json();
    return data.data; // Strapi nests data under a 'data' key
  } catch (error) {
    console.error("Error in fetchStrapiData:", error); // 🚨 نکته کلیدی: خطا را پرتاب می‌کنیم تا Redux Thunk آن را بگیرد
    throw error;
  }
}
