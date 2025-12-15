// src/app/profile/orders/[orderId]/page.jsx
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

// استفاده از متغیر محیطی آدرس استرپی
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

// این یک Server Component است
async function getOrderDetails(orderId) {
    const cookieStore = cookies();
    const token = cookieStore.get('strapi_jwt')?.value;

    if (!token) return null; // اگر لاگین نباشد، اجازه نمی‌دهیم فچ کند

    try {
        // فچ کردن سفارش مشخص
        const res = await fetch(`${STRAPI_URL}/api/orders/${orderId}?populate=*`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            // جلوگیری از کش (چون اطلاعات خصوصی کاربر است)
            cache: 'no-store',
        });

        if (res.status === 404 || res.status === 401) {
            return null; // سفارش پیدا نشد یا دسترسی مجاز نیست
        }

        if (!res.ok) {
            throw new Error('خطا در دریافت جزییات سفارش');
        }

        const data = await res.json();
        const order = data.data;

        // چک امنیتی: مطمئن شویم این سفارش متعلق به کاربر لاگین شده است
        // این کار باید در Strapi با Policy انجام شود، اما برای اطمینان این چک را اینجا می‌گذاریم
        const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        const currentUser = await userRes.json();

        // اگر سفارش دارای فیلد user باشد و برابر با کاربر فعلی نباشد
        if (order.attributes.user?.data?.id !== currentUser.id) {
            return null; // اجازه دسترسی به سفارش دیگران را نمی‌دهیم
        }

        return order;
    } catch (error) {
        console.error("Fetch Order Details Error:", error);
        return null;
    }
}

// تابع کمکی برای نمایش وضعیت
const getStatusBadge = (status) => {
    // ... (همان کد قبلی که رنگ‌ها را مشخص می‌کرد)
    switch (status) {
        case 'pending_payment':
            return <span className="px-3 py-1 text-sm font-semibold leading-none rounded text-yellow-800 bg-yellow-200">در انتظار پرداخت</span>;
        case 'paid':
            return <span className="px-3 py-1 text-sm font-semibold leading-none rounded text-blue-800 bg-blue-200">پرداخت شده</span>;
        case 'processing':
            return <span className="px-3 py-1 text-sm font-semibold leading-none rounded text-indigo-800 bg-indigo-200">در حال آماده‌سازی</span>;
        case 'shipped':
            return <span className="px-3 py-1 text-sm font-semibold leading-none rounded text-purple-800 bg-purple-200">ارسال شده</span>;
        case 'delivered':
            return <span className="px-3 py-1 text-sm font-semibold leading-none rounded text-green-800 bg-green-200">تحویل موفق</span>;
        case 'cancelled':
            return <span className="px-3 py-1 text-sm font-semibold leading-none rounded text-red-800 bg-red-200">لغو شده</span>;
        default:
            return <span className="px-3 py-1 text-sm font-semibold leading-none rounded text-gray-800 bg-gray-200">{status}</span>;
    }
};

export default async function OrderDetailsPage({ params }) {
    const order = await getOrderDetails(params.orderId);

    if (!order) {
        return notFound();
    }

    const orderData = order.attributes;
    // فرض می‌کنیم AddressSnapshot و OrderItems به صورت JSON ذخیره شده‌اند
    const addressSnapshot = JSON.parse(orderData.AddressSnapshot || '{}');
    const orderItems = JSON.parse(orderData.OrderItems || '[]');
    const date = new Date(orderData.createdAt).toLocaleDateString('fa-IR', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <h1 className="text-3xl font-bold mb-6 border-b pb-2">جزئیات سفارش #{order.id}</h1>

            <div className="grid md:grid-cols-3 gap-6">

                {/* ستون راست: اطلاعات اصلی و وضعیت */}
                <div className="md:col-span-2 space-y-6">
                    {/* اطلاعات وضعیت و پرداخت */}
                    <div className="p-5 bg-white rounded-lg shadow-md border-r-4 border-blue-500">
                        <h2 className="text-xl font-semibold mb-3">وضعیت و پرداخت</h2>
                        <div className="space-y-2">
                            <p><strong>وضعیت فعلی:</strong> {getStatusBadge(orderData.Status)}</p>
                            <p><strong>تاریخ ثبت:</strong> {date}</p>
                            <p><strong>روش پرداخت:</strong> {orderData.PaymentMethod === 'card_to_card' ? 'کارت به کارت' : 'پرداخت اینترنتی'}</p>
                            <p><strong>روش ارسال:</strong> {orderData.ShippingMethod}</p>
                        </div>
                    </div>

                    {/* اطلاعات محصولات */}
                    <div className="p-5 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-3">محصولات سفارش داده شده ({orderItems.length} قلم)</h2>
                        <ul className="divide-y divide-gray-200">
                            {orderItems.map((item, index) => (
                                <li key={index} className="py-3 flex justify-between items-center text-sm">
                                    <div className="flex-1">
                                        <div className="font-medium">{item.title}</div>
                                        <div className="text-gray-500">تعداد: {item.quantity}</div>
                                    </div>
                                    <div className="font-semibold">{item.price_at_time_of_order.toLocaleString()} تومان</div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* ستون چپ: خلاصه مبلغ و آدرس */}
                <div className="md:col-span-1 space-y-6">

                    {/* خلاصه مبلغ */}
                    <div className="p-5 bg-gray-50 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-3 border-b pb-2">خلاصه مالی</h2>
                        <div className="space-y-2 text-gray-700">
                            <div className="flex justify-between"><span>جمع محصولات:</span><span>{(orderData.TotalAmount - orderData.ShippingCost).toLocaleString()}</span></div>
                            <div className="flex justify-between"><span>هزینه ارسال:</span><span>{orderData.ShippingCost.toLocaleString()}</span></div>
                        </div>
                        <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-dashed">
                            <span>مبلغ نهایی:</span><span className="text-blue-600">{orderData.TotalAmount.toLocaleString()} تومان</span>
                        </div>
                    </div>

                    {/* آدرس ارسال */}
                    <div className="p-5 bg-white rounded-lg shadow-md border-l-4 border-green-500">
                        <h2 className="text-xl font-semibold mb-3">آدرس ارسال</h2>
                        <p className="font-bold`">{addressSnapshot.Title}</p>
                        <p className="text-sm">{addressSnapshot.FullAddress}، {addressSnapshot.City}</p>
                        <p className="text-sm">کد پستی: {addressSnapshot.PostalCode}</p>
                        <p className="text-sm mt-2">گیرنده: {addressSnapshot.RecipientName} ({addressSnapshot.RecipientPhone})</p>
                    </div>

                </div>
            </div>
        </div>
    );
}