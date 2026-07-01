"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createInvoiceInStrapi, getInvoicesFromStrapi } from "../erpApi";

const emptyForm = {
  customerName: "",
  items: "",
  amount: "",
  note: "",
};

function formatCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(amount);
}

export default function InvoicesPage() {
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
      const data = await getInvoicesFromStrapi();
      setRecords(data);
    } catch (error) {
      setMessage(error.message || "بارگذاری فاکتورها با خطا مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.customerName.trim() || !form.items.trim() || !form.amount) return;

    try {
      setSaving(true);
      setMessage("");
      await createInvoiceInStrapi({
        customerName: form.customerName.trim(),
        items: form.items.trim(),
        amount: form.amount,
        note: form.note.trim(),
      });
      setForm(emptyForm);
      await loadRecords();
      setMessage("فاکتور با موفقیت در استرپی ثبت شد.");
    } catch (error) {
      setMessage(error.message || "ثبت فاکتور با خطا مواجه شد");
    } finally {
      setSaving(false);
    }
  };

  const totalAmount = records.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <div className="dashboard-kicker">ERP • فاکتور فروش</div>
          <h1 className="page-title">ثبت و پیگیری فاکتورهای فروش</h1>
          <p className="page-subtitle">این داده‌ها در مرورگر شما ذخیره می‌شوند و برای نسخه‌ی بعدی به سمت پایگاه داده منتقل می‌شوند.</p>
        </div>
        <Link href="/dashboard/erp" className="btn-ghost">
          بازگشت به ERP
        </Link>
      </div>

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-value">{records.length}</div>
          <div className="stat-label">تعداد فاکتور</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{formatCurrency(totalAmount)}</div>
          <div className="stat-label">مجموع فروش</div>
        </div>
      </div>

      {message ? <div className="badge badge-blue" style={{ marginBottom: 12, display: "inline-flex" }}>{message}</div> : null}

      <div className="dashboard-grid">
        <div className="panel-card">
          <div className="panel-card__header">افزودن فاکتور جدید</div>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="label">نام مشتری</label>
              <input className="input-field" value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} placeholder="مثلاً علی رضایی" />
            </div>
            <div className="form-group">
              <label className="label">مبلغ</label>
              <input className="input-field" type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="مثلاً 2500000" />
            </div>
            <div className="form-group full">
              <label className="label">آیتم‌ها</label>
              <input className="input-field" value={form.items} onChange={(event) => setForm({ ...form, items: event.target.value })} placeholder="مثلاً قهوه‌ساز مدل X، لوازم جانبی" />
            </div>
            <div className="form-group full">
              <label className="label">یادداشت</label>
              <textarea className="input-field" rows="3" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="توضیحات تکمیلی" />
            </div>
            <div className="form-group full" style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn-primary" type="submit" disabled={saving}>{saving ? "در حال ثبت..." : "ثبت فاکتور"}</button>
            </div>
          </form>
        </div>

        <div className="panel-card">
          <div className="panel-card__header">آخرین فاکتورها</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {loading ? (
              <div style={{ color: "var(--text-secondary)", padding: "8px 0" }}>در حال بارگذاری...</div>
            ) : records.length === 0 ? (
              <div style={{ color: "var(--text-secondary)", padding: "8px 0" }}>هنوز فاکتور ثبت نشده است.</div>
            ) : (
              records.slice(0, 6).map((record) => (
                <div key={record.id} className="module-item">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <strong>{record.customerName}</strong>
                    <span className="badge badge-amber">{formatCurrency(record.amount)} تومان</span>
                  </div>
                  <span>{record.items}</span>
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
