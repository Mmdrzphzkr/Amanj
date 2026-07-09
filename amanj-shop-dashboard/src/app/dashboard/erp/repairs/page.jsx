'use client';

import { useState, useEffect } from 'react';
import { useErp } from '@/context/ErpContext';
import { getRepairsFromStrapi, createRepairInStrapi, updateRepairInStrapi, deleteRepairFromStrapi } from '../erpApi';
import PageHeader from '@/components/erp/PageHeader';
import StatCard from '@/components/erp/StatCard';
import Table from '@/components/erp/Table';
import Modal from '@/components/erp/Modal';
import { Input, Select, Textarea } from '@/components/erp/Input';
import Button from '@/components/erp/Button';
import Badge from '@/components/erp/Badge';
import ConfirmDialog from '@/components/erp/ConfirmDialog';
import PrintInvoice from '@/components/erp/PrintInvoice';
import { formatCurrency, formatJalaliDate, repairStatuses } from '@/components/erp/helpers';
import toast from 'react-hot-toast';

const emptyItem = { id: '', name: '', partsCost: 0, laborCost: 0, quantity: 1, description: '', total: 0 };

const emptyForm = {
  documentId: '',
  repairNumber: `SRV-${Date.now().toString(36).toUpperCase()}`,
  date: new Date().toISOString().slice(0, 10),
  customerName: '', customerPhone: '', brand: '', model: '', serialNumber: '',
  problem: '', technician: '', receivedDate: new Date().toISOString().slice(0, 10),
  deliveryDate: '', items: [], totalCost: 0, statuses: 'pending', note: '',
};

export default function RepairsPage() {
  const { state } = useErp();
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showPrint, setShowPrint] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { setLoading(true); const data = await getRepairsFromStrapi(); setRepairs(data); }
    catch (e) { toast.error('خطا در بارگذاری تعمیرات: ' + e.message); }
    finally { setLoading(false); }
  };

  const employees = state.employees || [];
  const filtered = filter === 'all' ? repairs : repairs.filter((r) => r.statuses === filter);
  const totalRevenue = repairs.reduce((s, r) => s + Number(r.totalCost || 0), 0);
  const pendingCount = repairs.filter((r) => r.statuses === 'pending' || r.statuses === 'in_progress').length;

  const openNew = () => {
    setForm({ ...emptyForm, repairNumber: `SRV-${Date.now().toString(36).toUpperCase()}` });
    setEditing(null); setShowForm(true);
  };

  const openEdit = (repair) => {
    setForm({
      documentId: repair.documentId, repairNumber: repair.repairNumber, date: repair.date, customerName: repair.customerName,
      customerPhone: repair.customerPhone || '', brand: repair.brand || '', model: repair.model || '',
      serialNumber: repair.serialNumber || '', problem: repair.problem || '', technician: repair.technician || '',
      receivedDate: repair.receivedDate || repair.date, deliveryDate: repair.deliveryDate || '',
      items: repair.items?.length ? repair.items : [{ ...emptyItem, id: Date.now().toString() }],
      totalCost: repair.totalCost, statuses: repair.statuses, note: repair.note || '',
    });
    setEditing(repair.documentId); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.customerName.trim() || !form.items.length) { toast.error('نام مشتری و حداقل یک آیتم الزامی است'); return; }
    const calcItems = form.items.map((it) => ({
      ...it, total: (Number(it.partsCost || 0) + Number(it.laborCost || 0)) * Number(it.quantity || 1),
    }));
    const totalCost = calcItems.reduce((s, it) => s + it.total, 0);
    try {
      setSaving(true);
      if (editing) {
        await updateRepairInStrapi(editing, { ...form, items: calcItems, totalCost });
        toast.success('تعمیر به‌روزرسانی شد');
      } else {
        await createRepairInStrapi({ ...form, items: calcItems, totalCost });
        toast.success('تعمیر جدید ثبت شد');
      }
      setShowForm(false); setEditing(null);
      await loadData();
    } catch (e) { toast.error('خطا در ذخیره: ' + e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await deleteRepairFromStrapi(deleteTarget.documentId); toast.success('حذف شد'); setDeleteTarget(null); await loadData(); }
    catch (e) { toast.error('خطا: ' + e.message); }
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { ...emptyItem, id: Date.now().toString() }] });
  const removeItem = (id) => setForm({ ...form, items: form.items.filter((it) => it.id !== id) });
  const updateItem = (id, field, value) => setForm({ ...form, items: form.items.map((it) => it.id === id ? { ...it, [field]: value } : it) });

  const statusLabels = { pending: 'در انتظار', in_progress: 'در حال تعمیر', completed: 'تکمیل شده', delivered: 'تحویل شده', cancelled: 'لغو شده' };

  const columns = [
    { header: 'شماره', accessor: 'repairNumber' },
    { header: 'مشتری', accessor: 'customerName' },
    { header: 'برند/مدل', render: (row) => `${row.brand || ''} ${row.model || ''}`.trim() || '—' },
    { header: 'تکنسین', accessor: 'technician' },
    { header: 'تاریخ دریافت', render: (row) => formatJalaliDate(row.receivedDate || row.date) },
    { header: 'هزینه', render: (row) => formatCurrency(row.totalCost || 0) },
    { header: 'وضعیت', render: (row) => <Badge statuses={row.statuses}>{statusLabels[row.statuses] || row.statuses}</Badge> },
    {
      header: 'عملیات', render: (row) => (
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={(e) => { e.stopPropagation(); openEdit(row); }} className="btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }}>✏️</button>
          <button onClick={(e) => { e.stopPropagation(); setShowPrint(row); }} className="btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }}>🖨️</button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }} className="btn-ghost" style={{ padding: '4px 8px', fontSize: 12, color: 'var(--danger)' }}>🗑️</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="مدیریت تعمیرات" subtitle="ERP • تعمیرات" actions={<Button onClick={openNew}>+ ثبت تعمیر جدید</Button>} />

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'pending', 'in_progress', 'completed', 'delivered', 'cancelled'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 14px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600,
            background: filter === f ? 'var(--accent-dim)' : 'transparent',
            color: filter === f ? 'var(--accent)' : 'var(--text-secondary)',
            border: filter === f ? '1px solid var(--accent)' : '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit',
          }}>{f === 'all' ? 'همه' : statusLabels[f] || f}</button>
        ))}
      </div>

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <StatCard value={repairs.length} label="کل تعمیرات" color="amber" icon="🔧" loading={loading} />
        <StatCard value={formatCurrency(totalRevenue)} label="درآمد تعمیرات" color="green" icon="💰" loading={loading} />
        <StatCard value={pendingCount} label="در انتظار / در حال کار" color="blue" icon="⏳" loading={loading} />
        <StatCard value={repairs.filter((r) => r.statuses === 'delivered').length} label="تحویل شده" color="purple" icon="✅" loading={loading} />
      </div>

      <Table columns={columns} data={filtered} onRowClick={openEdit} loading={loading} emptyMessage="هیچ تعمیری یافت نشد" />

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'ویرایش تعمیر' : 'ثبت تعمیر جدید'} size="xl"
        footer={<><Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? 'در حال ذخیره...' : (editing ? 'به‌روزرسانی' : 'ثبت تعمیر')}</Button><Button variant="ghost" onClick={() => setShowForm(false)}>انصراف</Button></>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="شماره تعمیر" value={form.repairNumber} onChange={(e) => setForm({ ...form, repairNumber: e.target.value })} />
          <Input label="تاریخ" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Input label="نام مشتری" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
          <Input label="تلفن مشتری" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
          <Input label="برند دستگاه" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          <Input label="مدل" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
          <Input label="شماره سریال" value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} />
          <Input label="تاریخ دریافت" type="date" value={form.receivedDate} onChange={(e) => setForm({ ...form, receivedDate: e.target.value })} />
          <Input label="تاریخ تحویل" type="date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} />
          <Select label="تکنسین" options={employees.filter((e) => e.active !== false).map((e) => ({ value: e.name, label: e.name }))} value={form.technician} onChange={(e) => setForm({ ...form, technician: e.target.value })} />
          <Select label="وضعیت" options={repairStatuses} value={form.statuses} onChange={(e) => setForm({ ...form, statuses: e.target.value })} />
        </div>
        <Textarea label="شرح مشکل" value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} style={{ marginTop: 12 }} />
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>قطعات و خدمات</h4>
            <Button variant="secondary" size="sm" onClick={addItem}>+ افزودن آیتم</Button>
          </div>
          {form.items.map((item) => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 70px 70px 60px 30px', gap: 8, alignItems: 'center', marginBottom: 8, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              <input className="input-field" placeholder="نام قطعه/خدمت" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} style={{ padding: '6px 10px', fontSize: 13 }} />
              <input className="input-field" type="number" placeholder="قیمت قطعه" value={item.partsCost} onChange={(e) => updateItem(item.id, 'partsCost', Number(e.target.value))} style={{ padding: '6px 10px', fontSize: 13, textAlign: 'center' }} />
              <input className="input-field" type="number" placeholder="دستمزد" value={item.laborCost} onChange={(e) => updateItem(item.id, 'laborCost', Number(e.target.value))} style={{ padding: '6px 10px', fontSize: 13, textAlign: 'center' }} />
              <input className="input-field" type="number" placeholder="تعداد" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} style={{ padding: '6px 10px', fontSize: 13, textAlign: 'center' }} />
              <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={!!showPrint} onClose={() => setShowPrint(null)} title="پرینت فاکتور تعمیر" size="full">
        <PrintInvoice data={showPrint} isRepair settings={state.settings} />
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        message={`آیا از حذف تعمیر ${deleteTarget?.repairNumber || ''} اطمینان دارید؟`} />
    </div>
  );
}
