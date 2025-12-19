// src/app/layout.js
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import ClientProviders from "@/components/ClientProviders/clientProviders";
import { Toaster } from "react-hot-toast";
import StoreProvider from "../redux/StoreProvider";

const vazirmatn = Vazirmatn({ subsets: ["arabic"], display: "swap" });

export const metadata = {
  title: "Amanj coffee",
  description: "Amanj coffee shop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.className}>
        <Toaster
          position="top-center" // موقعیت نمایش توست‌ها
          reverseOrder={false} // ترتیب نمایش
        />
        <ClientProviders>
          <StoreProvider>
            {children}
          </StoreProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
