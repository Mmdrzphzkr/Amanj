"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { addItem, removeItem, deleteItem } from "@/redux/slices/cartSlice";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Header from "@/components/Header/Header";

const CartPage = () => {
  const dispatch = useDispatch();

  // گرفتن اطلاعات سبد خرید از ریداکس
  const { items, totalAmount, totalCount } = useSelector((state) => state.cart);

  // اگر سبد خرید خالی بود
  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
          <ShoppingBag size={80} className="text-[#DED9CC]" />
          <h1 className="text-2xl font-bold text-[#3F3F3F]">
            سبد خرید شما خالی است
          </h1>
          <p className="text-gray-500">
            به نظر می‌رسد هنوز محصولی به سبد خود اضافه نکرده‌اید.
          </p>
          <Link
            href="/"
            className="mt-4 bg-[#3F3F3F] text-[#EDE9DE] px-8 py-3 rounded-full hover:bg-[#C5A35C] transition-colors"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-[#F9F8F5] min-h-screen pt-32 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-[#3F3F3F] mb-8">
            سبد خرید ({totalCount})
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* لیست محصولات (سمت راست در دسکتاپ) */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-4 border border-[#EDE9DE]"
                >
                  {/* تصویر محصول */}
                  <div className="w-24 h-24 bg-[#EDE9DE] rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* جزییات محصول */}
                  <div className="flex-grow text-center md:text-right">
                    <h3 className="text-lg font-bold text-[#3F3F3F]">
                      {item.title}
                    </h3>
                    <p className="text-[#C5A35C] font-semibold mt-1">
                      {item.price.toLocaleString()} تومان
                    </p>
                  </div>

                  {/* کنترل تعداد */}
                  <div className="flex items-center gap-4 bg-[#F9F8F5] px-4 py-2 rounded-full border border-[#EDE9DE]">
                    <button
                      onClick={() => dispatch(addItem(item))}
                      className="text-[#3F3F3F] hover:text-[#C5A35C]"
                    >
                      <Plus size={18} />
                    </button>
                    <span className="font-bold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(removeItem(item.id))}
                      className="text-[#3F3F3F] hover:text-[#C5A35C]"
                    >
                      <Minus size={18} />
                    </button>
                  </div>

                  {/* حذف کلی */}
                  <button
                    onClick={() => dispatch(deleteItem(item.id))}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    title="حذف از سبد"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* خلاصه سفارش (سمت چپ در دسکتاپ) */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-3xl shadow-md border border-[#EDE9DE] sticky top-32">
                <h2 className="text-xl font-bold text-[#3F3F3F] mb-6 border-b pb-4">
                  خلاصه سفارش
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>قیمت کالاها ({totalCount})</span>
                    <span>{totalAmount.toLocaleString()} تومان</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>هزینه ارسال</span>
                    <span className="text-green-600 text-sm font-medium">
                      پس از انتخاب آدرس
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-[#3F3F3F] border-t pt-4 mb-8">
                  <span>جمع کل:</span>
                  <span>{totalAmount.toLocaleString()} تومان</span>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full text-center bg-[#3F3F3F] text-[#EDE9DE] py-4 rounded-full font-bold text-lg hover:bg-[#C5A35C] transition-all shadow-lg hover:shadow-xl"
                >
                  تایید و ادامه ثبت سفارش
                </Link>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>ضمانت اصالت و سلامت کالا</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
