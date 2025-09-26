// src/app/layout.js
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/Theme/ThemeRegistry";
import { AuthProvider } from "@/context/AuthContext";

const vazirmatn = Vazirmatn({ subsets: ["arabic"], display: "swap" });

export const metadata = {
  title: "داشبورد فروشگاه",
  description: "مدیریت فروشگاه شما",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.className}>
        <AuthProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
