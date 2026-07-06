'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createInvoiceInStrapi, getInvoicesFromStrapi } from '../erpApi';
import PageHeader from '@/components/erp/PageHeader';
import StatCard from '@/components/erp/StatCard';
import Button from '@/components/erp/Button';
import { formatCurrency } from '@/components/erp/helpers';
import toast from 'react-hot-toast';

const emptyForm = {
  customerName: '', items: '', amount: '', note: '',
};

export default function InvoicesPage() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadRecords(); }, []);

  const loadRecords = async () => {
    try { setLoading(true); const data = await getInvoicesFromStrapi(); setRecords(data); }
    catch (e) { toast.error(e.message || 'بارگذاری با خطا مواجه شد'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.items.trim() || !form.amount) { toast.error('پر کردن فیلدهای الزامی'); return; }
    try {
      setSaving(true);
      await createInvoiceInStrapi({ customerName: form.customerName.trim(), items: form.items.trim(), amount: form.amount, note: form.note.trim() });
      setForm(emptyForm);
      await loadRecords();
      toast.success('فاکتور در استرپی ثبت شد');
    } catch (e) { toast.error(e.message || 'خطا در ثبت'); }
    finally { setSaving(false); }
  };

  const totalAmount = records.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div>
      <PageHeader
        title="فاکتورهای استرپی"
        subtitle="ERP • اتصال به استرپی"
        actions={<Link href="/dashboard/erp" className="btn-ghost">بازگشت به ERP</Link>}
      />

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <StatCard value={records.length} label="تعداد فاکتور" color="amber" icon="📄" />
        <StatCard value={formatCurrency(totalAmount)} label="مجموع فروش" color="green" icon="💰" />
      </div>

      <div className="dashboard-grid">
        <div className="panel-card">
          <div className="panel-card__header">افزودن فاکتور جدید (Strapi)</div>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="label">نام مشتری</label>
              <input className="input-field" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="علی رضایی" />
            </div>
            <div className="form-group">
              <label className="label">مبلغ</label>
              <input className="input-field" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="۲۵۰۰۰۰۰" />
            </div>
            <div className="form-group full">
              <label className="label">آیتم‌ها</label>
              <input className="input-field" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} placeholder="قهوه‌ساز مدل X، لوازم جانبی" />
            </div>
            <div className="form-group full">
              <label className="label">یادداشت</label>
              <textarea className="input-field" rows="3" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="توضیحات" />
            </div>
            <div className="form-group full" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" disabled={saving}>{saving ? 'در حال ثبت...' : 'ثبت فاکتور'}</Button>
            </div>
          </form>
        </div>

        <div className="panel-card">
          <div className="panel-card__header">آخرین فاکتورها</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {loading ? (
              <div style={{ color: 'var(--text-secondary)', padding: '8px 0' }}>در حال بارگذاری...</div>
            ) : records.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', padding: '8px 0' }}>هنوز فاکتوری ثبت نشده</div>
            ) : (
              records.slice(0, 6).map((record) => (
                <div key={record.id} className="module-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <strong>{record.customerName}</strong>
                    <span className="badge badge-amber">{formatCurrency(record.amount)}</span>
                  </div>
                  <span>{record.items}</span>
                  <small style={{ color: 'var(--text-muted)' }}>{record.createdAt}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
