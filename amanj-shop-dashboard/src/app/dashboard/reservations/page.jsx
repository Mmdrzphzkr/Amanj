"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReservationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      const isAdmin = user.role?.type === "admin";
      if (!isAdmin) router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const isAdmin = user?.role?.type === "admin";
    if (user && isAdmin) loadReservations();
  }, [user]);

  const loadReservations = async () => {
    try {
      const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
      const res = await fetch(`${STRAPI}/api/technical-reservations?pagination[pageSize]=100&sort=createdAt:desc`);
      if (!res.ok) throw new Error("Failed to load reservations");
      const json = await res.json();
      const items = (json.data || []).map((d) => ({ id: d.id, ...d }));
      setReservations(items);
    } catch (err) {
      console.error("Error loading reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (reservation) => {
    setSelectedReservation(reservation);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReservation(null);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center mt-8">
        <svg className="animate-spin h-8 w-8 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </div>
    );
  }

  const isAdmin = user?.role?.type === "admin";
  if (!user || !isAdmin) {
    return <div className="text-right">دسترسی غیرمجاز.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-6 mb-8 px-4 text-black" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h1 className="text-2xl font-semibold mb-3 md:mb-0 text-white">درخواست‌های سرویس فنی</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >
          بازگشت به داشبورد
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center mt-6">
          <svg className="animate-spin h-8 w-8 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-right text-gray-700">درخواستی موجود نیست.</div>
      ) : (
        <>
          {/* Desktop / Tablet table */}
          <div className="overflow-x-auto hidden md:block bg-white rounded shadow" style={{ direction: 'rtl' }}>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-right">نام</th>
                  <th className="px-4 py-2 text-right">نام خانوادگی</th>
                  <th className="px-4 py-2 text-right">موبایل</th>
                  <th className="px-4 py-2 text-right">تاریخ</th>
                  <th className="px-4 py-2 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-right">{res.name}</td>
                    <td className="px-4 py-3 text-right">{res.lastname}</td>
                    <td className="px-4 py-3 text-right">{res.phone}</td>
                    <td className="px-4 py-3 text-right">{new Date(res.createdAt).toLocaleDateString("fa-IR")}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleOpenDialog(res)}
                        className="bg-gray-600 hover:bg-gray-500 text-white text-xs md:text-sm px-3 py-1 rounded"
                      >
                        جزئیات
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="md:hidden">
            {reservations.map((res) => (
              <div key={res.id} className="p-4 mb-3 bg-white rounded shadow">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-base">{res.name} {res.lastname}</div>
                    <div className="text-gray-600">{res.phone}</div>
                  </div>
                  <button onClick={() => handleOpenDialog(res)} className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded min-w-[80px] text-sm">
                    جزئیات
                  </button>
                </div>
                <div className="text-gray-500 text-sm">{new Date(res.createdAt).toLocaleDateString('fa-IR')}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Dialog */}
      {openDialog && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseDialog}></div>
          <div className="relative bg-white rounded max-w-lg w-full mx-4 shadow-lg" dir="rtl" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-3 border-b text-right">
              <h2 className="text-lg font-medium">جزئیات درخواست</h2>
            </div>
            <div className="p-5 text-right space-y-3">
              <div><strong>نام:</strong> {selectedReservation.name}</div>
              <div><strong>نام خانوادگی:</strong> {selectedReservation.lastname}</div>
              <div><strong>موبایل:</strong> <a className="text-blue-600" href={`tel:${selectedReservation.phone}`}>{selectedReservation.phone}</a></div>
              <div><strong>سرویس‌های انتخاب شده:</strong></div>
              {Array.isArray(selectedReservation.services) && selectedReservation.services.length > 0 ? (
                <div className="mr-3">
                  {selectedReservation.services.map((svc, idx) => (
                    <div key={idx}>• {typeof svc === 'object' ? svc.name : svc}</div>
                  ))}
                </div>
              ) : (
                <div className="mr-3">هیچ سرویسی انتخاب نشده</div>
              )}
              <div>
                <strong>توضیحات:</strong>
                <div className="mt-1 p-2 bg-gray-100 rounded whitespace-pre-wrap">{selectedReservation.description}</div>
              </div>
              <div className="text-sm text-gray-500"><strong>تاریخ:</strong> {new Date(selectedReservation.createdAt).toLocaleString("fa-IR")}</div>
            </div>
            <div className="px-5 py-3 border-t flex justify-end">
              <button onClick={handleCloseDialog} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded">بستن</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
