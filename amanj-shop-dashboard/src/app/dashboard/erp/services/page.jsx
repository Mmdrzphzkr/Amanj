"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createServiceInStrapi, getServicesFromStrapi } from "../erpApi";

const emptyForm = {
  customerName: "",
  serviceName: "",
  amount: "",
  note: "",
};

function formatCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(amount);
}

export default function ServicesPage() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await getServicesFromStrapi();
      setRecords(data);
    } catch (error) {
      setMessage(error.message || "بارگذاری خدمات با خطا مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.customerName.trim() || !form.serviceName.trim() || !form.amount) return;

    try {
      setSaving(true);
      setMessage("");
      await createServiceInStrapi({
        customerName: form.customerName.trim(),
        serviceName: form.serviceName.trim(),
        amount: form.amount,
        note: form.note.trim(),
      });
      setForm(emptyForm);
      await loadRecords();
      setMessage("خدمت با موفقیت در استرپی ثبت شد.");
    } catch (error) {
      setMessage(error.message || "ثبت خدمت با خطا مواجه شد");
    } finally {
      setSaving(false);
    }
  };

  const totalAmount = records.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <div className="dashboard-kicker">ERP • فاکتور خدمات</div>
          <h1 className="page-title">ثبت خدمات و تعمیرات</h1>
          <p className="page-subtitle">برای هر خدمت، مشتری، نوع خدمات و مبلغ را ثبت کنید.</p>
        </div>
        <Link href="/dashboard/erp" className="btn-ghost">
          بازگشت به ERP
        </Link>
      </div>

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card">
          <div className="stat-icon">🛠️</div>
          <div className="stat-value">{records.length}</div>
          <div className="stat-label">خدمت ثبت‌شده</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💳</div>
          <div className="stat-value">{formatCurrency(totalAmount)}</div>
          <div className="stat-label">جمع خدمات</div>
        </div>
      </div>

      {message ? <div className="badge badge-blue" style={{ marginBottom: 12, display: "inline-flex" }}>{message}</div> : null}

      <div className="dashboard-grid">
        <div className="panel-card">
          <div className="panel-card__header">ثبت خدمت جدید</div>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="label">نام مشتری</label>
              <input className="input-field" value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} placeholder="مثلاً مریم احمدی" />
            </div>
            <div className="form-group">
              <label className="label">نوع خدمت</label>
              <input className="input-field" value={form.serviceName} onChange={(event) => setForm({ ...form, serviceName: event.target.value })} placeholder="مثلاً تعویض فیلتر" />
            </div>
            <div className="form-group full">
              <label className="label">مبلغ</label>
              <input className="input-field" type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="مثلاً 850000" />
            </div>
            <div className="form-group full">
              <label className="label">توضیحات</label>
              <textarea className="input-field" rows="3" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="شرح کار انجام‌شده" />
            </div>
            <div className="form-group full" style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn-primary" type="submit" disabled={saving}>{saving ? "در حال ثبت..." : "ثبت خدمت"}</button>
            </div>
          </form>
        </div>

        <div className="panel-card">
          <div className="panel-card__header">خدمات اخیر</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {loading ? (
              <div style={{ color: "var(--text-secondary)", padding: "8px 0" }}>در حال بارگذاری...</div>
            ) : records.length === 0 ? (
              <div style={{ color: "var(--text-secondary)", padding: "8px 0" }}>هنوز خدمتی ثبت نشده است.</div>
            ) : (
              records.slice(0, 6).map((record) => (
                <div key={record.id} className="module-item">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <strong>{record.serviceName}</strong>
                    <span className="badge badge-blue">{formatCurrency(record.amount)} تومان</span>
                  </div>
                  <span>{record.customerName}</span>
                  <small style={{ color: "var(--text-muted)" }}>{record.createdAt}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
