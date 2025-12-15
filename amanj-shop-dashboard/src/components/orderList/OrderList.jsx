// src/components/OrdersList.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // برای چک کردن توکن و لاگین

// تابع کمکی برای نمایش وضعیت با رنگ مناسب
const getStatusBadge = (status) => {
    switch (status) {
        case 'pending_payment':
            return <span className="px-2 py-1 text-xs font-semibold leading-none rounded-full text-yellow-800 bg-yellow-200">در انتظار پرداخت</span>;
        case 'paid':
            return <span className="px-2 py-1 text-xs font-semibold leading-none rounded-full text-blue-800 bg-blue-200">پرداخت شده</span>;
        case 'processing':
            return <span className="px-2 py-1 text-xs font-semibold leading-none rounded-full text-indigo-800 bg-indigo-200">در حال آماده‌سازی</span>;
        case 'shipped':
            return <span className="px-2 py-1 text-xs font-semibold leading-none rounded-full text-purple-800 bg-purple-200">ارسال شده</span>;
        case 'delivered':
            return <span className="px-2 py-1 text-xs font-semibold leading-none rounded-full text-green-800 bg-green-200">تحویل موفق</span>;
        case 'cancelled':
            return <span className="px-2 py-1 text-xs font-semibold leading-none rounded-full text-red-800 bg-red-200">لغو شده</span>;
        default:
            return <span className="px-2 py-1 text-xs font-semibold leading-none rounded-full text-gray-800 bg-gray-200">{status}</span>;
    }
};

export default function OrdersList() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            const fetchOrders = async () => {
                setLoading(true);
                setError(null);
                try {
                    // فچ کردن از API Route داخلی (امن)
                    const res = await fetch("/api/user/orders");

                    if (res.status === 401) {
                        // توکن منقضی شده یا نامعتبر
                        throw new Error("نشست کاربری شما منقضی شده است. لطفاً دوباره وارد شوید.");
                    }

                    if (!res.ok) {
                        throw new Error("خطا در دریافت لیست سفارشات.");
                    }

                    const data = await res.json();
                    setOrders(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrders();
        }
        // اگر لاگین نبود، کاری نمی‌کنیم چون صفحه پروفایل خودش کاربر را ریدایرکت می‌کند
        if (!authLoading && !isAuthenticated) {
            setLoading(false);
        }

    }, [isAuthenticated, authLoading]);

    if (loading) {
        return <div className="text-center p-8">در حال بارگذاری لیست سفارشات...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600 border border-red-300 bg-red-50 rounded">{error}</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
                شما تاکنون هیچ سفارشی ثبت نکرده‌اید.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => {
                const orderData = order.attributes;
                const orderId = order.id;

                // تاریخ شمسی کردن
                const date = new Date(orderData.createdAt).toLocaleDateString('fa-IR');

                return (
                    <div
                        key={orderId}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                    >
                        <div className="flex flex-col space-y-1">
                            <span className="font-semibold text-lg text-gray-800">سفارش #{orderId}</span>
                            <span className="text-sm text-gray-600">تاریخ: {date}</span>
                        </div>

                        <div className="flex flex-col md:flex-row md:space-x-4 md:space-x-reverse items-start md:items-center mt-3 md:mt-0">
                            <div className="text-lg font-bold text-green-700">
                                {orderData.TotalAmount.toLocaleString()} تومان
                            </div>

                            <div className="my-2 md:my-0">
                                {getStatusBadge(orderData.Status)}
                            </div>

                            <Link
                                href={`/profile/orders/${orderId}`}
                                className="text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                            >
                                مشاهده جزئیات
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}