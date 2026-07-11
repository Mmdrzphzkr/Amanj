"use client";
import { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/erp/PageHeader";
import Table from "@/components/erp/Table";
import Modal from "@/components/erp/Modal";
import { Input, Select } from "@/components/erp/Input";
import Button from "@/components/erp/Button";
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("deviceImage", imageFile);

      const url = editing ? `/api/guarantees/${editing.documentId || editing.id}` : "/api/guarantees";

      const res = await fetch(url, { method: "POST", body: fd });
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
      const fd = new FormData();
      fd.append("_method", "DELETE");
      const res = await fetch(`/api/guarantees/${deleteTarget.documentId || deleteTarget.id}`, {
        method: "POST",
        body: fd,
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

  const columns = [
    { header: "شماره سریال", accessor: "serialNumber" },
    { header: "نام دستگاه", accessor: "deviceName" },
    { header: "موبایل مشتری", accessor: "customerPhoneNumber" },
    {
      header: "نوع",
      render: (row) => row.warrantyType === "VIP" ? "VIP" : "Normal",
    },
    { header: "مدت (ماه)", accessor: "warrantyDuration" },
    {
      header: "تاریخ شروع",
      render: (row) => formatJalaliDate(row.startDate),
    },
    {
      header: "تاریخ پایان",
      render: (row) => formatJalaliDate(row.endDate),
    },
    {
      header: "عملیات",
      render: (row) => (
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={(e) => { e.stopPropagation(); openEdit(row); }}
            className="btn-ghost"
            style={{ padding: "4px 8px", fontSize: 12 }}
          >✏️</button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }}
            className="btn-ghost"
            style={{ padding: "4px 8px", fontSize: 12, color: "var(--danger)" }}
          >🗑️</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="مدیریت گارانتی‌ها"
        subtitle="داشبورد • گارانتی"
        actions={<Button onClick={openAdd}>+ گارانتی جدید</Button>}
      />

      <Table
        columns={columns}
        data={guarantees}
        loading={loading}
        emptyMessage="هیچ گارانتی یافت نشد"
      />

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? "ویرایش گارانتی" : "گارانتی جدید"}
        size="xl"
        footer={<>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "⏳ در حال ذخیره..." : editing ? "به‌روزرسانی" : "ثبت گارانتی"}
          </Button>
          <Button variant="ghost" onClick={() => setShowModal(false)}>
            انصراف
          </Button>
        </>}
      >
        {/* اطلاعات دستگاه */}
        <div className="modal-section-header">
          <span>📦</span>
          <span>اطلاعات دستگاه</span>
        </div>
        <div className="form-grid" style={{ marginBottom: 20 }}>
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
          <Input
            label="شماره موبایل مشتری"
            value={form.customerPhoneNumber}
            onChange={(e) => setForm({ ...form, customerPhoneNumber: e.target.value })}
            required
            placeholder="مثال: 09123456789"
          />
        </div>

        {/* اطلاعات گارانتی */}
        <div className="modal-section-header">
          <span>🛡️</span>
          <span>اطلاعات گارانتی</span>
        </div>
        <div className="form-grid" style={{ marginBottom: 20 }}>
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
          <JalaliDatePicker
            label="تاریخ شروع"
            value={form.startDate}
            onChange={(v) => setForm({ ...form, startDate: v })}
          />
          <JalaliDatePicker
            label="تاریخ پایان"
            value={form.endDate}
            onChange={(v) => setForm({ ...form, endDate: v })}
          />
        </div>

        {/* تصویر دستگاه */}
        <div className="modal-section-header">
          <span>📸</span>
          <span>تصویر دستگاه (اختیاری)</span>
        </div>
        <div className="form-group">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="input-field"
          />
          {imageFile && (
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, display: "block" }}>
              {imageFile.name}
            </span>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        message={
          deleteTarget
            ? `آیا از حذف گارانتی "${deleteTarget.serialNumber}" اطمینان دارید؟`
            : ""
        }
      />
    </div>
  );
}
