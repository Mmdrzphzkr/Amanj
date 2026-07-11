'use client';

import { useState, useEffect } from 'react';
import { getEmployeesFromStrapi, createEmployeeInStrapi, updateEmployeeInStrapi, deleteEmployeeFromStrapi, getCommissionsFromStrapi } from '../erpApi';
import PageHeader from '@/components/erp/PageHeader';
import StatCard from '@/components/erp/StatCard';
import Modal from '@/components/erp/Modal';
import { Input, Select } from '@/components/erp/Input';
import Button from '@/components/erp/Button';
import ConfirmDialog from '@/components/erp/ConfirmDialog';
import { formatCurrency, salaryTypes } from '@/components/erp/helpers';
import toast from 'react-hot-toast';

const emptyForm = { name: '', phone: '', position: '', salaryType: 'monthly', baseSalary: 0, commissionRate: 0, active: true };

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [emps, comms] = await Promise.all([getEmployeesFromStrapi(), getCommissionsFromStrapi()]);
      setEmployees(emps); setCommissions(comms);
    } catch (e) { toast.error('خطا در بارگذاری: ' + e.message); }
    finally { setLoading(false); }
  };

  const activeEmployees = employees.filter((e) => e.active !== false);

  const openNew = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const openEdit = (emp) => { setForm({ ...emp }); setEditing(emp.documentId); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('نام الزامی است'); return; }
    try {
      setSaving(true);
      if (editing) { await updateEmployeeInStrapi(editing, form); toast.success('به‌روزرسانی شد'); }
      else { await createEmployeeInStrapi(form); toast.success('ثبت شد'); }
      setShowForm(false); setEditing(null); await loadData();
    } catch (e) { toast.error('خطا: ' + e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await deleteEmployeeFromStrapi(deleteTarget.documentId); toast.success('حذف شد'); setDeleteTarget(null); await loadData(); }
    catch (e) { toast.error('خطا: ' + e.message); }
  };

  const getEmployeeCommissions = (empId) => commissions.filter((c) => c.employeeId === Number(empId));
  const getTotalCommission = (empId) => getEmployeeCommissions(empId).reduce((s, c) => s + Number(c.amount || 0), 0);

  return (
    <div>
      <PageHeader title="مدیریت کارکنان" subtitle="ERP • کارکنان" actions={<Button onClick={openNew}>+ کارگر جدید</Button>} />

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <StatCard value={employees.length} label="کل کارکنان" color="amber" icon="👥" loading={loading} />
        <StatCard value={activeEmployees.length} label="فعال" color="green" icon="✅" loading={loading} />
        <StatCard value={employees.length - activeEmployees.length} label="غیرفعال" color="red" icon="⛔" loading={loading} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {!loading && employees.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>👥</div><div>هیچ کارگری ثبت نشده</div>
          </div>
        )}
        {employees.map((emp) => {
          const empCommissions = getEmployeeCommissions(emp.id);
          const totalComm = getTotalCommission(emp.id);
          return (
            <div key={emp.id} className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--accent), #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: '#0d0f14', flexShrink: 0 }}>{emp.name?.[0] || '?'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{emp.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{emp.position || '—'}</div>
                </div>
                <span className={`badge ${emp.active !== false ? 'badge-green' : 'badge-red'}`}>{emp.active !== false ? 'فعال' : 'غیرفعال'}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <span>📞 {emp.phone || '—'}</span>
                <span>💼 {salaryTypes.find((s) => s.value === emp.salaryType)?.label || emp.salaryType}</span>
                {Number(emp.baseSalary) > 0 && <span>💰 {formatCurrency(emp.baseSalary)}</span>}
              </div>
              {empCommissions.length > 0 && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                  <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{empCommissions.length} کمیسیون</span> — جمع: {formatCurrency(totalComm)}
                </div>
              )}
              <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                <Button variant="secondary" size="sm" onClick={() => openEdit(emp)}>✏️ ویرایش</Button>
                <Button variant="danger" size="sm" onClick={() => setDeleteTarget(emp)}>🗑️ حذف</Button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'ویرایش کارگر' : 'کارگر جدید'}
        footer={<><Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? 'در حال ذخیره...' : (editing ? 'به‌روزرسانی' : 'ثبت کارگر')}</Button><Button variant="ghost" onClick={() => setShowForm(false)}>انصراف</Button></>}
      >
        <div className="form-grid">
          <Input label="نام و نام خانوادگی" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="تلفن" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="سمت" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          <Select label="نوع حقوق" options={salaryTypes} value={form.salaryType} onChange={(e) => setForm({ ...form, salaryType: e.target.value })} />
          <Input label="حقوق پایه" type="number" value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: Number(e.target.value) })} />
          <Input label="نرخ کمیسیون تعمیرات (%)" type="number" step="0.1" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: Number(e.target.value) })} placeholder="مثال: 15 برای ۱۵٪" />
          <div className="form-group">
            <label className="label">فعال</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingTop: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-primary)', cursor: 'pointer' }}>
                <input type="radio" name="active" checked={form.active !== false} onChange={() => setForm({ ...form, active: true })} /> فعال
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-primary)', cursor: 'pointer' }}>
                <input type="radio" name="active" checked={form.active === false} onChange={() => setForm({ ...form, active: false })} /> غیرفعال
              </label>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        message={`آیا از حذف "${deleteTarget?.name || ''}" اطمینان دارید؟`} />
    </div>
  );
}
