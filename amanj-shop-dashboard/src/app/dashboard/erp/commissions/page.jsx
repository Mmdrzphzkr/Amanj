'use client';

import { useState, useEffect } from 'react';
import { getCommissionsFromStrapi, createCommissionInStrapi, deleteCommissionFromStrapi, getEmployeesFromStrapi } from '../erpApi';
import PageHeader from '@/components/erp/PageHeader';
import StatCard from '@/components/erp/StatCard';
import Table from '@/components/erp/Table';
import Modal from '@/components/erp/Modal';
import { Input, Select } from '@/components/erp/Input';
import Button from '@/components/erp/Button';
import ConfirmDialog from '@/components/erp/ConfirmDialog';
import { formatCurrency, formatJalaliDate } from '@/components/erp/helpers';
import toast from 'react-hot-toast';

const emptyForm = { employeeId: '', type: 'invoice', reference: '', amount: 0, date: new Date().toISOString().slice(0, 10), description: '' };

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { setLoading(true); const [c, e] = await Promise.all([getCommissionsFromStrapi(), getEmployeesFromStrapi()]); setCommissions(c); setEmployees(e); }
    catch (err) { toast.error('خطا در بارگذاری: ' + err.message); }
    finally { setLoading(false); }
  };

  const employeeOptions = employees.filter((e) => e.active !== false).map((e) => ({ value: e.id, label: e.name }));
  const filtered = filterEmployee === 'all' ? commissions : commissions.filter((c) => String(c.employeeId) === String(filterEmployee));
  const totalComm = commissions.reduce((s, c) => s + Number(c.amount || 0), 0);

  const getName = (id) => employees.find((e) => String(e.id) === String(id))?.name || '—';

  const openNew = () => { setForm(emptyForm); setShowForm(true); };

  const handleSave = async () => {
    if (!form.employeeId || !form.amount) { toast.error('کارمند و مبلغ الزامی است'); return; }
    try {
      setSaving(true);
      await createCommissionInStrapi(form);
      toast.success('کمیسیون ثبت شد');
      setShowForm(false); await loadData();
    } catch (e) { toast.error('خطا: ' + e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await deleteCommissionFromStrapi(deleteTarget.documentId); toast.success('حذف شد'); setDeleteTarget(null); await loadData(); }
    catch (e) { toast.error('خطا: ' + e.message); }
  };

  const employeeSummaries = {};
  commissions.forEach((c) => {
    const eId = c.employeeId;
    if (!employeeSummaries[eId]) employeeSummaries[eId] = { id: eId, commissions: [], total: 0 };
    employeeSummaries[eId].commissions.push(c);
    employeeSummaries[eId].total += Number(c.amount || 0);
  });

  const columns = [
    { header: 'کارمند', render: (row) => getName(row.employeeId) },
    { header: 'نوع', render: (row) => <span className={`badge ${row.type === 'invoice' ? 'badge-blue' : 'badge-amber'}`}>{row.type === 'invoice' ? 'فاکتور' : 'تعمیر'}</span> },
    { header: 'مرجع', accessor: 'reference' },
    { header: 'تاریخ', render: (row) => formatJalaliDate(row.date) },
    { header: 'مبلغ', render: (row) => formatCurrency(row.amount) },
    { header: 'توضیحات', accessor: 'description' },
    { header: 'عملیات', render: (row) => (
      <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }} className="btn-ghost" style={{ padding: '4px 8px', fontSize: 12, color: 'var(--danger)' }}>🗑️</button>
    )},
  ];

  return (
    <div>
      <PageHeader title="مدیریت کمیسیون‌ها" subtitle="ERP • کمیسیون" actions={<Button onClick={openNew}>+ کمیسیون جدید</Button>} />

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <StatCard value={commissions.length} label="کل کمیسیون‌ها" color="amber" icon="🏆" loading={loading} />
        <StatCard value={formatCurrency(totalComm)} label="جمع کمیسیون‌ها" color="green" icon="💰" loading={loading} />
        <StatCard value={Object.keys(employeeSummaries).length} label="کارمندان دارای کمیسیون" color="blue" icon="👥" loading={loading} />
      </div>

      {Object.values(employeeSummaries).map((summary) => (
        <div key={summary.id} className="panel-card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <strong style={{ color: 'var(--text-primary)', fontSize: 15 }}>{getName(summary.id)}</strong>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{formatCurrency(summary.total)}</span>
          </div>
          {summary.commissions.map((c) => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
              <span>{c.reference} - {c.description}</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(c.amount)}</span>
            </div>
          ))}
        </div>
      ))}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>فیلتر:</span>
        <select className="input-field" style={{ width: 'auto', minWidth: 180 }} value={filterEmployee} onChange={(e) => setFilterEmployee(e.target.value)}>
          <option value="all">همه</option>
          {employeeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      <Table columns={columns} data={filtered} loading={loading} emptyMessage="هیچ کمیسیونی یافت نشد" />

      <Modal open={showForm} onClose={() => setShowForm(false)} title="کمیسیون جدید"
        footer={<><Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? 'در حال ذخیره...' : 'ثبت کمیسیون'}</Button><Button variant="ghost" onClick={() => setShowForm(false)}>انصراف</Button></>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Select label="کارمند" options={employeeOptions} value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
          <Select label="نوع" options={[{ value: 'invoice', label: 'فاکتور فروش' }, { value: 'repair', label: 'تعمیرات' }]} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <Input label="مرجع" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="شماره فاکتور/تعمیر" />
          <Input label="مبلغ" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
          <Input label="تاریخ" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Input label="توضیحات" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} message="آیا از حذف این کمیسیون اطمینان دارید؟" />
    </div>
  );
}
