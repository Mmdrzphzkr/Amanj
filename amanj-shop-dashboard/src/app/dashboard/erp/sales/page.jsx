"use client";

import { useState, useEffect } from "react";
import { useErp } from "@/context/ErpContext";
import {
  getInvoicesFromStrapi,
  createInvoiceInStrapi,
  updateInvoiceInStrapi,
  deleteInvoiceFromStrapi,
} from "../erpApi";
import PageHeader from "@/components/erp/PageHeader";
import StatCard from "@/components/erp/StatCard";
import Table from "@/components/erp/Table";
import Modal from "@/components/erp/Modal";
import { Input, Select, Textarea } from "@/components/erp/Input";
import Button from "@/components/erp/Button";
import Badge from "@/components/erp/Badge";
import ConfirmDialog from "@/components/erp/ConfirmDialog";
import PrintInvoice from "@/components/erp/PrintInvoice";
import {
  formatCurrency,
  formatJalaliDate,
  invoiceStatuses,
  paymentMethods,
} from "@/components/erp/helpers";
import toast from "react-hot-toast";

const emptyItem = {
  id: "",
  description: "",
  quantity: 1,
  unitPrice: 0,
  discount: 0,
  tax: 0,
  total: 0,
};

const emptyForm = {
  documentId: '',
  invoiceNumber: `INV-${Date.now().toString(36).toUpperCase()}`,
  date: new Date().toISOString().slice(0, 10),
  customerName: "",
  customerPhone: "",
  items: [],
  subtotal: 0,
  discount: 0,
  taxAmount: 0,
  totalAmount: 0,
  paymentMethod: "cash",
  statuses: "draft",
  note: "",
};

export default function SalesPage() {
  const { state } = useErp();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showPrint, setShowPrint] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getInvoicesFromStrapi();
      setInvoices(data);
    } catch (e) {
      toast.error("خطا در بارگذاری فاکتورها: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    filter === "all" ? invoices : invoices.filter((i) => i.statuses === filter);
  const paidTotal = invoices
    .filter((i) => i.statuses === "paid")
    .reduce((s, i) => s + Number(i.totalAmount || 0), 0);
  const pendingTotal = invoices
    .filter((i) => i.statuses === "pending")
    .reduce((s, i) => s + Number(i.totalAmount || 0), 0);
  const grandTotal = invoices.reduce(
    (s, i) => s + Number(i.totalAmount || 0),
    0,
  );

  const recalculate = (items, taxRate) => {
    let subtotal = 0;
    const updated = items.map((item) => {
      const lineTotal =
        Number(item.unitPrice || 0) * Number(item.quantity || 1);
      const discount = Number(item.discount || 0);
      const afterDiscount = lineTotal - discount;
      const tax = Math.round((afterDiscount * (taxRate || 0)) / 100);
      const total = afterDiscount + tax;
      subtotal += lineTotal;
      return { ...item, total, tax, discount };
    });
    const discountSum = items.reduce((s, i) => s + Number(i.discount || 0), 0);
    const taxSum = items.reduce((s, i) => s + Number(i.tax || 0), 0);
    return {
      items: updated,
      subtotal,
      discount: discountSum,
      taxAmount: taxSum,
      totalAmount: subtotal - discountSum + taxSum,
    };
  };

  const openNew = () => {
    setForm({
      ...emptyForm,
      invoiceNumber: `INV-${Date.now().toString(36).toUpperCase()}`,
    });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (invoice) => {
    setForm({
      documentId: invoice.documentId,
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      customerName: invoice.customerName,
      customerPhone: invoice.customerPhone || "",
      items: invoice.items?.length
        ? invoice.items
        : [{ ...emptyItem, id: Date.now().toString() }],
      subtotal: invoice.subtotal,
      discount: invoice.discount,
      taxAmount: invoice.taxAmount,
      totalAmount: invoice.totalAmount,
      paymentMethod: invoice.paymentMethod || "cash",
      statuses: invoice.statuses,
      note: invoice.note || "",
    });
    setEditing(invoice.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.customerName.trim() || !form.items.length) {
      toast.error("نام مشتری و حداقل یک آیتم الزامی است");
      return;
    }
    const calc = recalculate(
      form.items,
      Number(state.settings.taxPercentage || 0),
    );
    try {
      setSaving(true);
      if (editing) {
        await updateInvoiceInStrapi({ ...form, ...calc });
        toast.success("فاکتور به‌روزرسانی شد");
      } else {
        await createInvoiceInStrapi({ ...form, ...calc });
        toast.success("فاکتور جدید ثبت شد");
      }
      setShowForm(false);
      setEditing(null);
      await loadData();
    } catch (e) {
      toast.error("خطا در ذخیره فاکتور: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInvoiceFromStrapi(deleteTarget.documentId);
      toast.success("فاکتور حذف شد");
      setDeleteTarget(null);
      await loadData();
    } catch (e) {
      toast.error("خطا در حذف: " + e.message);
    }
  };

  const addItem = () =>
    setForm({
      ...form,
      items: [...form.items, { ...emptyItem, id: Date.now().toString() }],
    });
  const removeItem = (id) =>
    setForm({ ...form, items: form.items.filter((it) => it.id !== id) });
  const updateItem = (id, field, value) => {
    setForm({
      ...form,
      items: form.items.map((it) =>
        it.id === id ? { ...it, [field]: value } : it,
      ),
    });
  };

  const columns = [
    { header: "شماره", render: (row) => row.invoiceNumber },
    { header: "مشتری", render: (row) => row.customerName },
    { header: "تاریخ", render: (row) => formatJalaliDate(row.date) },
    { header: "مبلغ", render: (row) => formatCurrency(row.totalAmount || 0) },
    {
      header: "وضعیت",
      render: (row) => (
        <Badge statuses={row.statuses}>
          {row.statuses === "draft"
            ? "پیش‌نویس"
            : row.statuses === "pending"
              ? "در انتظار"
              : row.statuses === "paid"
                ? "پرداخت شده"
                : "لغو شده"}
        </Badge>
      ),
    },
    {
      header: "عملیات",
      render: (row) => (
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(row);
            }}
            className="btn-ghost"
            style={{ padding: "4px 8px", fontSize: 12 }}
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPrint(row);
            }}
            className="btn-ghost"
            style={{ padding: "4px 8px", fontSize: 12 }}
          >
            🖨️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(row);
            }}
            className="btn-ghost"
            style={{ padding: "4px 8px", fontSize: 12, color: "var(--danger)" }}
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="مدیریت فروش و فاکتورها"
        subtitle="ERP • فروش"
        actions={<Button onClick={openNew}>+ فاکتور جدید</Button>}
      />

      <div
        style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}
      >
        {["all", "draft", "pending", "paid", "canceled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-md)",
              fontSize: 13,
              fontWeight: 600,
              background: filter === f ? "var(--accent-dim)" : "transparent",
              color: filter === f ? "var(--accent)" : "var(--text-secondary)",
              border:
                filter === f
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {f === "all"
              ? "همه"
              : f === "draft"
                ? "پیش‌نویس"
                : f === "pending"
                  ? "در انتظار"
                  : f === "paid"
                    ? "پرداخت شده"
                    : "لغو شده"}
          </button>
        ))}
      </div>

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <StatCard
          value={invoices.length}
          label="کل فاکتورها"
          color="amber"
          icon="📄"
          loading={loading}
        />
        <StatCard
          value={formatCurrency(paidTotal)}
          label="فروش قطعی"
          color="green"
          icon="✅"
          loading={loading}
        />
        <StatCard
          value={formatCurrency(pendingTotal)}
          label="در انتظار پرداخت"
          color="blue"
          icon="⏳"
          loading={loading}
        />
        <StatCard
          value={formatCurrency(grandTotal)}
          label="جمع کل فروش"
          color="purple"
          icon="💰"
          loading={loading}
        />
      </div>

      <Table
        columns={columns}
        data={filtered}
        onRowClick={openEdit}
        loading={loading}
        emptyMessage="هیچ فاکتوری یافت نشد"
      />

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "ویرایش فاکتور" : "فاکتور جدید"}
        size="xl"
        footer={
          <>
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving
                ? "در حال ذخیره..."
                : editing
                  ? "به‌روزرسانی"
                  : "ثبت فاکتور"}
            </Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              انصراف
            </Button>
          </>
        }
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Input
            label="شماره فاکتور"
            value={form.invoiceNumber}
            onChange={(e) =>
              setForm({ ...form, invoiceNumber: e.target.value })
            }
          />
          <Input
            label="تاریخ"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <Input
            label="نام مشتری"
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          />
          <Input
            label="تلفن مشتری"
            value={form.customerPhone}
            onChange={(e) =>
              setForm({ ...form, customerPhone: e.target.value })
            }
          />
          <Select
            label="روش پرداخت"
            options={paymentMethods}
            value={form.paymentMethod}
            onChange={(e) =>
              setForm({ ...form, paymentMethod: e.target.value })
            }
          />
          <Select
            label="وضعیت"
            options={invoiceStatuses}
            value={form.statuses}
            onChange={(e) => setForm({ ...form, statuses: e.target.value })}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <h4
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              آیتم‌های فاکتور
            </h4>
            <Button variant="secondary" size="sm" onClick={addItem}>
              + افزودن آیتم
            </Button>
          </div>
          {form.items.map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 60px 80px 70px 70px 80px 30px",
                gap: 8,
                alignItems: "center",
                marginBottom: 8,
                padding: "6px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <input
                className="input-field"
                placeholder="شرح کالا/خدمت"
                value={item.description}
                onChange={(e) =>
                  updateItem(item.id, "description", e.target.value)
                }
                style={{ padding: "6px 10px", fontSize: 13 }}
              />
              <input
                className="input-field"
                type="number"
                placeholder="تعداد"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(item.id, "quantity", Number(e.target.value))
                }
                style={{
                  padding: "6px 10px",
                  fontSize: 13,
                  textAlign: "center",
                }}
              />
              <input
                className="input-field"
                type="number"
                placeholder="فی"
                value={item.unitPrice}
                onChange={(e) =>
                  updateItem(item.id, "unitPrice", Number(e.target.value))
                }
                style={{
                  padding: "6px 10px",
                  fontSize: 13,
                  textAlign: "center",
                }}
              />
              <input
                className="input-field"
                type="number"
                placeholder="تخفیف"
                value={item.discount}
                onChange={(e) =>
                  updateItem(item.id, "discount", Number(e.target.value))
                }
                style={{
                  padding: "6px 10px",
                  fontSize: 13,
                  textAlign: "center",
                }}
              />
              <input
                className="input-field"
                type="number"
                placeholder="مالیات"
                value={item.tax}
                onChange={(e) =>
                  updateItem(item.id, "tax", Number(e.target.value))
                }
                style={{
                  padding: "6px 10px",
                  fontSize: 13,
                  textAlign: "center",
                }}
              />
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: "var(--accent)",
                  textAlign: "center",
                }}
              >
                {item.total_price?.toLocaleString?.() || 0}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--danger)",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <Textarea
          label="یادداشت"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
      </Modal>

      <Modal
        open={!!showPrint}
        onClose={() => setShowPrint(null)}
        title="پرینت فاکتور"
        size="full"
      >
        <PrintInvoice data={showPrint} settings={state.settings} />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        message={`آیا از حذف فاکتور ${deleteTarget?.invoiceNumber || ""} اطمینان دارید؟`}
      />
    </div>
  );
}
