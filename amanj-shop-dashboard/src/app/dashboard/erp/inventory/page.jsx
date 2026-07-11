'use client';

import { useState, useEffect } from 'react';
import { getProductsFromStrapi, createProductInStrapi, updateProductInStrapi, deleteProductFromStrapi } from '../erpApi';
import PageHeader from '@/components/erp/PageHeader';
import StatCard from '@/components/erp/StatCard';
import Table from '@/components/erp/Table';
import Modal from '@/components/erp/Modal';
import { Input, Select } from '@/components/erp/Input';
import Button from '@/components/erp/Button';
import ConfirmDialog from '@/components/erp/ConfirmDialog';
import { formatCurrency, generateId, productCategories } from '@/components/erp/helpers';
import toast from 'react-hot-toast';

const emptyForm = { name: '', category: 'coffee_machine', sku: '', purchasePrice: 0, sellingPrice: 0, stock: 0, minStock: 0, supplier: '' };

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { setLoading(true); const data = await getProductsFromStrapi(); setProducts(data); }
    catch (e) { toast.error('خطا در بارگذاری: ' + e.message); }
    finally { setLoading(false); }
  };

  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter);
  const warehouseValue = products.reduce((s, p) => s + Number(p.sellingPrice || 0) * Number(p.stock || 0), 0);
  const criticalCount = products.filter((p) => Number(p.stock) <= Number(p.minStock)).length;

  const openNew = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditing(p.documentId); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('نام کالا الزامی است'); return; }
    try {
      setSaving(true);
      if (editing) { await updateProductInStrapi(editing, form); toast.success('به‌روزرسانی شد'); }
      else { await createProductInStrapi(form); toast.success('کالا ثبت شد'); }
      setShowForm(false); setEditing(null); await loadData();
    } catch (e) { toast.error('خطا: ' + e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await deleteProductFromStrapi(deleteTarget.documentId); toast.success('حذف شد'); setDeleteTarget(null); await loadData(); }
    catch (e) { toast.error('خطا: ' + e.message); }
  };

  const categoryLabels = { coffee_machine: '☕ دستگاه قهوه‌ساز', accessory: '🔌 لوازم جانبی', spare_part: '⚙️ قطعات یدکی' };

  const columns = [
    { header: 'نام کالا', accessor: 'name' },
    { header: 'دسته', render: (row) => <span style={{ padding: '2px 8px', borderRadius: 6, background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: 12 }}>{categoryLabels[row.category] || row.category}</span> },
    { header: 'SKU', accessor: 'sku' },
    { header: 'قیمت خرید', render: (row) => formatCurrency(row.purchasePrice) },
    { header: 'قیمت فروش', render: (row) => formatCurrency(row.sellingPrice) },
    { header: 'موجودی', render: (row) => <span style={{ color: Number(row.stock) <= Number(row.minStock) ? 'var(--danger)' : 'inherit', fontWeight: 700 }}>{row.stock}</span> },
    { header: 'حداقل', accessor: 'minStock' },
    { header: 'تامین‌کننده', accessor: 'supplier' },
    { header: 'عملیات', render: (row) => (
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={(e) => { e.stopPropagation(); openEdit(row); }} className="btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }}>✏️</button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }} className="btn-ghost" style={{ padding: '4px 8px', fontSize: 12, color: 'var(--danger)' }}>🗑️</button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="مدیریت انبار و کالا" subtitle="ERP • موجودی" actions={<Button onClick={openNew}>+ کالای جدید</Button>} />

      {criticalCount > 0 && (
        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 16, background: 'var(--danger-dim)', border: '1px solid var(--danger)', color: 'var(--danger)', fontSize: 13, fontWeight: 600 }}>
          ⚠️ {criticalCount} کالا دارای موجودی بحرانی: {products.filter((p) => Number(p.stock) <= Number(p.minStock)).map((p) => p.name).join('، ')}
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {[{ value: 'all', label: 'همه' }, ...productCategories].map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)} style={{
            padding: '6px 14px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600,
            background: filter === f.value ? 'var(--accent-dim)' : 'transparent',
            color: filter === f.value ? 'var(--accent)' : 'var(--text-secondary)',
            border: filter === f.value ? '1px solid var(--accent)' : '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit',
          }}>{f.label}</button>
        ))}
      </div>

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <StatCard value={products.length} label="کل کالاها" color="amber" icon="📦" loading={loading} />
        <StatCard value={formatCurrency(warehouseValue)} label="ارزش موجودی" color="green" icon="💰" loading={loading} />
        <StatCard value={criticalCount} label="موجودی بحرانی" color="red" icon="⚠️" loading={loading} />
      </div>

      <Table columns={columns} data={filtered} onRowClick={openEdit} loading={loading} emptyMessage="هیچ کالایی یافت نشد" />

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'ویرایش کالا' : 'کالای جدید'}
        footer={<><Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? 'در حال ذخیره...' : (editing ? 'به‌روزرسانی' : 'ثبت کالا')}</Button><Button variant="ghost" onClick={() => setShowForm(false)}>انصراف</Button></>}
      >
        <div className="form-grid">
          <Input label="نام کالا" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Select label="دسته‌بندی" options={productCategories} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          <Input label="تامین‌کننده" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
          <Input label="قیمت خرید" type="number" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: Number(e.target.value) })} />
          <Input label="قیمت فروش" type="number" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })} />
          <Input label="موجودی" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
          <Input label="حداقل موجودی" type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })} />
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        message={`آیا از حذف "${deleteTarget?.name || ''}" اطمینان دارید؟`} />
    </div>
  );
}
