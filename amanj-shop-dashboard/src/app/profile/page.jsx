"use client";

import { useAuth } from "@/context/AuthContext"; // ایمپورت useAuth
import { redirect } from "next/navigation";
import OrdersList from "@/components/OrdersList"; // این کامپوننت را بعدا می‌سازیم
import Loading from "@/components/Loading/Loading";

export default function ProfilePage() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  // اگر هنوز وضعیت لاگین مشخص نیست، یک لودر نشان بده
   if (loading) {
    return <Loading />;
  }
  
  // اگر لاگین نیست، به صفحه اصلی برود (بهتر است از middleware استفاده کنید)
  if (!isAuthenticated) {
    // اگر از middleware استفاده نمی‌کنید:
    redirect("/login?callbackUrl=/profile"); 
  }

  // حالا که مطمئنیم کاربر لاگین است، می‌توانیم اطلاعاتش را نمایش دهیم
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center border-b pb-3 mb-6">
        <h1 className="text-3xl font-bold">پروفایل کاربری {user.username}</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          خروج از حساب
        </button>
      </div>

      <section className="mb-8 p-6 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">اطلاعات کاربری</h2>
        <p><strong>نام کاربری:</strong> {user.username}</p>
        <p><strong>ایمیل:</strong> {user.email}</p>
        {/* بعداً فیلد آدرس را هم از استرپی اینجا نمایش می‌دهید */}
        {/* <p><strong>آدرس پیش‌فرض:</strong> ...</p> */}
        
        {/* دکمه‌ای برای ویرایش اطلاعات */}
        <button className="mt-4 text-blue-500 hover:underline">ویرایش اطلاعات</button>
      </section>

      {/* لیست سفارشات (مرحله بعدی) */}
      <section>
        <h2 className="text-xl font-semibold mb-4">لیست سفارشات شما</h2>
        {/* در اینجا باید کامپوننت لیست سفارشات را بگذارید */}
        <OrdersList />
        <p className="text-gray-500">لیست سفارشات به زودی در اینجا نمایش داده خواهد شد.</p>
      </section>
    </div>
  );
}