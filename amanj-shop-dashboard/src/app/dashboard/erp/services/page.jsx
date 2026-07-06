'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createServiceInStrapi, getServicesFromStrapi } from '../erpApi';
import PageHeader from '@/components/erp/PageHeader';
import StatCard from '@/components/erp/StatCard';
import Button from '@/components/erp/Button';
import { formatCurrency } from '@/components/erp/helpers';
import toast from 'react-hot-toast';

const emptyForm = {
  customerName: '', serviceName: '', amount: '', note: '',
};

export default function ServicesPage() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadRecords(); }, []);

  const loadRecords = async () => {
    try { setLoading(true); const data = await getServicesFromStrapi(); setRecords(data); }
    catch (e) { toast.error(e.message || 'بارگذاری با خطا مواجه شد'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.serviceName.trim() || !form.amount) { toast.error('پر کردن فیلدهای الزامی'); return; }
    try {
      setSaving(true);
      await createServiceInStrapi({ customerName: form.customerName.trim(), serviceName: form.serviceName.trim(), amount: form.amount, note: form.note.trim() });
      setForm(emptyForm);
      await loadRecords();
      toast.success('خدمت در استرپی ثبت شد');
    } catch (e) { toast.error(e.message || 'خطا در ثبت'); }
    finally { setSaving(false); }
  };

  const totalAmount = records.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div>
      <PageHeader
        title="خدمات استرپی"
        subtitle="ERP • اتصال به استرپی"
        actions={<Link href="/dashboard/erp" className="btn-ghost">بازگشت به ERP</Link>}
      />

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <StatCard value={records.length} label="خدمات ثبت‌شده" color="amber" icon="🛠️" />
        <StatCard value={formatCurrency(totalAmount)} label="جمع خدمات" color="green" icon="💰" />
      </div>

      <div className="dashboard-grid">
        <div className="panel-card">
          <div className="panel-card__header">ثبت خدمت جدید (Strapi)</div>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="label">نام مشتری</label>
              <input className="input-field" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="مریم احمدی" />
            </div>
            <div className="form-group">
              <label className="label">نوع خدمت</label>
              <input className="input-field" value={form.serviceName} onChange={(e) => setForm({ ...form, serviceName: e.target.value })} placeholder="تعویض فیلتر" />
            </div>
            <div className="form-group full">
              <label className="label">مبلغ</label>
              <input className="input-field" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="۸۵۰۰۰۰" />
            </div>
            <div className="form-group full">
              <label className="label">توضیحات</label>
              <textarea className="input-field" rows="3" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="شرح کار انجام‌شده" />
            </div>
            <div className="form-group full" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" disabled={saving}>{saving ? 'در حال ثبت...' : 'ثبت خدمت'}</Button>
            </div>
          </form>
        </div>

        <div className="panel-card">
          <div className="panel-card__header">خدمات اخیر</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {loading ? (
              <div style={{ color: 'var(--text-secondary)', padding: '8px 0' }}>در حال بارگذاری...</div>
            ) : records.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', padding: '8px 0' }}>هنوز خدمتی ثبت نشده</div>
            ) : (
              records.slice(0, 6).map((record) => (
                <div key={record.id} className="module-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <strong>{record.serviceName}</strong>
                    <span className="badge badge-blue">{formatCurrency(record.amount)}</span>
                  </div>
                  <span>{record.customerName}</span>
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
