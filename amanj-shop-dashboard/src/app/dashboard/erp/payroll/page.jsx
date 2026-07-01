"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPayrollInStrapi, getPayrollsFromStrapi } from "../erpApi";

const emptyForm = {
  workerName: "",
  workDays: "",
  salaryPerDay: "",
  bonus: "",
  note: "",
};

function formatCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(amount);
}

export default function PayrollPage() {
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
      const data = await getPayrollsFromStrapi();
      setRecords(data);
    } catch (error) {
      setMessage(error.message || "بارگذاری حقوق با خطا مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.workerName.trim() || !form.workDays || !form.salaryPerDay) return;

    try {
      setSaving(true);
      setMessage("");
      await createPayrollInStrapi({
        workerName: form.workerName.trim(),
        workDays: form.workDays,
        salaryPerDay: form.salaryPerDay,
        bonus: form.bonus,
        note: form.note.trim(),
      });
      setForm(emptyForm);
      await loadRecords();
      setMessage("حقوق با موفقیت در استرپی ثبت شد.");
    } catch (error) {
      setMessage(error.message || "ثبت حقوق با خطا مواجه شد");
    } finally {
      setSaving(false);
    }
  };

  const totalSalary = records.reduce((sum, item) => sum + Number(item.totalSalary || 0), 0);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <div className="dashboard-kicker">ERP • حقوق و فیش</div>
          <h1 className="page-title">ثبت کارکرد و محاسبه حقوق</h1>
          <p className="page-subtitle">روزهای کاری، دستمزد روزانه و پاداش را وارد کنید تا حقوق محاسبه شود.</p>
        </div>
        <Link href="/dashboard/erp" className="btn-ghost">
          بازگشت به ERP
        </Link>
      </div>

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card">
          <div className="stat-icon">👷</div>
          <div className="stat-value">{records.length}</div>
          <div className="stat-label">کارگر ثبت‌شده</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💸</div>
          <div className="stat-value">{formatCurrency(totalSalary)}</div>
          <div className="stat-label">جمع حقوق</div>
        </div>
      </div>

      {message ? <div className="badge badge-blue" style={{ marginBottom: 12, display: "inline-flex" }}>{message}</div> : null}

      <div className="dashboard-grid">
        <div className="panel-card">
          <div className="panel-card__header">ثبت حقوق جدید</div>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="label">نام کارگر</label>
              <input className="input-field" value={form.workerName} onChange={(event) => setForm({ ...form, workerName: event.target.value })} placeholder="مثلاً امیر قنبرزاده" />
            </div>
            <div className="form-group">
              <label className="label">تعداد روز کاری</label>
              <input className="input-field" type="number" value={form.workDays} onChange={(event) => setForm({ ...form, workDays: event.target.value })} placeholder="مثلاً 20" />
            </div>
            <div className="form-group">
              <label className="label">دستمزد روزانه</label>
              <input className="input-field" type="number" value={form.salaryPerDay} onChange={(event) => setForm({ ...form, salaryPerDay: event.target.value })} placeholder="مثلاً 1200000" />
            </div>
            <div className="form-group">
              <label className="label">پاداش</label>
              <input className="input-field" type="number" value={form.bonus} onChange={(event) => setForm({ ...form, bonus: event.target.value })} placeholder="مثلاً 500000" />
            </div>
            <div className="form-group full">
              <label className="label">یادداشت</label>
              <textarea className="input-field" rows="3" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="توضیحات اضافی" />
            </div>
            <div className="form-group full" style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn-primary" type="submit" disabled={saving}>{saving ? "در حال ثبت..." : "ثبت حقوق"}</button>
            </div>
          </form>
        </div>

        <div className="panel-card">
          <div className="panel-card__header">حقوق اخیر</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {loading ? (
              <div style={{ color: "var(--text-secondary)", padding: "8px 0" }}>در حال بارگذاری...</div>
            ) : records.length === 0 ? (
              <div style={{ color: "var(--text-secondary)", padding: "8px 0" }}>هنوز حقوقی ثبت نشده است.</div>
            ) : (
              records.slice(0, 6).map((record) => (
                <div key={record.id} className="module-item">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <strong>{record.workerName}</strong>
                    <span className="badge badge-green">{formatCurrency(record.totalSalary)} تومان</span>
                  </div>
                  <span>{record.workDays} روز کاری • {formatCurrency(record.salaryPerDay)} تومان/روز</span>
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
