"use client";
import { useState, useEffect, useCallback } from "react";
import { Input, Select } from "@/components/erp/Input";
import ConfirmDialog from "@/components/erp/ConfirmDialog";
import JalaliDatePicker from "@/components/JalaliDatePicker";
import { formatJalaliDate } from "@/components/erp/helpers";

const initialForm = {
  serialNumber: "", deviceName: "", customerPhoneNumber: "",
  warrantyDuration: "", warrantyType: "Normal",
  startDate: "", endDate: "",
};

export default function GuaranteePage() {
  const [guarantees, setGuarantees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const fetchGuarantees = useCallback(async () => {
    try {
      const res = await fetch("/api/guarantees");
      const json = await res.json();
      setGuarantees(json?.data || []);
    } catch (err) {
      console.error("Failed to fetch guarantees", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGuarantees(); }, [fetchGuarantees]);

  const openAdd = () => {
    setEditing(null);
    setForm(initialForm);
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      serialNumber: item.serialNumber || "",
      deviceName: item.deviceName || "",
      customerPhoneNumber: item.customerPhoneNumber || "",
      warrantyDuration: item.warrantyDuration ? String(item.warrantyDuration) : "",
      warrantyType: item.warrantyType || "Normal",
      startDate: item.startDate || "",
      endDate: item.endDate || "",
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("deviceImage", imageFile);

      const url = editing ? `/api/guarantees/${editing.documentId || editing.id}` : "/api/guarantees";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, { method, body: fd });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "خطا در ذخیره");
        return;
      }
      setShowModal(false);
      fetchGuarantees();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/guarantees/${deleteTarget.documentId || deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        alert("خطا در حذف");
        return;
      }
      setDeleteTarget(null);
      fetchGuarantees();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="page-container"><p>در حال بارگذاری...</p></div>;
  }

  const warrantyTypeLabel = (t) => t === "VIP" ? "VIP" : "Normal";

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>مدیریت گارانتی‌ها</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ گارانتی جدید</button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>شماره سریال</th>
              <th>نام دستگاه</th>
              <th>موبایل مشتری</th>
              <th>نوع</th>
              <th>مدت (ماه)</th>
              <th>تاریخ شروع</th>
              <th>تاریخ پایان</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {guarantees.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: "center" }}>هیچ گارانتی یافت نشد</td></tr>
            ) : (
              guarantees.map((g) => (
                <tr key={g.id}>
                  <td>{g.serialNumber}</td>
                  <td>{g.deviceName}</td>
                  <td>{g.customerPhoneNumber}</td>
                  <td>{warrantyTypeLabel(g.warrantyType)}</td>
                  <td>{g.warrantyDuration}</td>
                  <td>{formatJalaliDate(g.startDate)}</td>
                  <td>{formatJalaliDate(g.endDate)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-sm btn-secondary" onClick={() => openEdit(g)}>ویرایش</button>
                      <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(g)}>حذف</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? "ویرایش گارانتی" : "گارانتی جدید"}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-grid">
                <Input
                  label="نام دستگاه"
                  value={form.deviceName}
                  onChange={(e) => setForm({ ...form, deviceName: e.target.value })}
                  required
                />
                <Input
                  label="شماره سریال"
                  value={form.serialNumber}
                  onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                  required
                />
                <Select
                  label="نوع گارانتی"
                  options={[
                    { value: "Normal", label: "Normal" },
                    { value: "VIP", label: "VIP" },
                  ]}
                  value={form.warrantyType}
                  onChange={(e) => setForm({ ...form, warrantyType: e.target.value })}
                />
                <Input
                  label="مدت گارانتی (ماه)"
                  type="number"
                  value={form.warrantyDuration}
                  onChange={(e) => setForm({ ...form, warrantyDuration: e.target.value })}
                  required
                  min="0"
                />
                <Input
                  label="شماره موبایل مشتری"
                  value={form.customerPhoneNumber}
                  onChange={(e) => setForm({ ...form, customerPhoneNumber: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginTop: 16 }}>
                <label className="label">تاریخ شروع</label>
                <JalaliDatePicker
                  value={form.startDate}
                  onChange={(v) => setForm({ ...form, startDate: v })}
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <label className="label">تاریخ پایان</label>
                <JalaliDatePicker
                  value={form.endDate}
                  onChange={(v) => setForm({ ...form, endDate: v })}
                />
              </div>

              <div style={{ marginTop: 16 }}>
                <label className="label">تصویر دستگاه (اختیاری)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="input-field"
                />
                {imageFile && <span style={{ fontSize: 12, color: "#666" }}>{imageFile.name}</span>}
              </div>

              <div className="modal-actions" style={{ marginTop: 24 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "در حال ذخیره..." : editing ? "به‌روزرسانی" : "ثبت"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`آیا از حذف گارانتی "${deleteTarget.serialNumber}" اطمینان دارید؟`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
