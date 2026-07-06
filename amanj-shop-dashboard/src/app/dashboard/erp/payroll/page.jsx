'use client';

import { useState, useEffect } from 'react';
import { getPayrollsFromStrapi, createPayrollInStrapi, deletePayrollFromStrapi, getEmployeesFromStrapi, getCommissionsFromStrapi } from '../erpApi';
import PageHeader from '@/components/erp/PageHeader';
import StatCard from '@/components/erp/StatCard';
import Modal from '@/components/erp/Modal';
import Table from '@/components/erp/Table';
import Button from '@/components/erp/Button';
import { formatCurrency, getTodayJalali } from '@/components/erp/helpers';
import toast from 'react-hot-toast';

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [saving, setSaving] = useState(false);
  const [bonusMap, setBonusMap] = useState({});
  const [deductionMap, setDeductionMap] = useState({});

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { setLoading(true); const [p, e, c] = await Promise.all([getPayrollsFromStrapi(), getEmployeesFromStrapi(), getCommissionsFromStrapi()]); setPayrolls(p); setEmployees(e.filter((emp) => emp.active !== false)); setCommissions(c); }
    catch (err) { toast.error('خطا در بارگذاری: ' + err.message); }
    finally { setLoading(false); }
  };

  const totalPaid = payrolls.reduce((s, p) => s + Number(p.totalSalary || 0), 0);

  const openGenerator = () => {
    const map = {};
    employees.forEach((emp) => { map[emp.id] = { bonus: 0, deduction: 0 }; });
    setBonusMap(map); setDeductionMap(map); setShowGenerator(true);
  };

  const getEmployeeCommissions = (empId) => commissions.filter((c) => String(c.employeeId) === String(empId));
  const calcFinalSalary = (emp) => {
    const base = Number(emp.baseSalary || 0);
    const totalComm = getEmployeeCommissions(emp.id).reduce((s, c) => s + Number(c.amount || 0), 0);
    const bonus = Number(bonusMap[emp.id]?.bonus || 0);
    const deduction = Number(deductionMap[emp.id]?.deduction || 0);
    return base + totalComm + bonus - deduction;
  };

  const confirmPayroll = async () => {
    try {
      setSaving(true);
      const period = getTodayJalali().slice(0, 7);
      for (const emp of employees) {
        const finalSalary = calcFinalSalary(emp);
        if (finalSalary <= 0) continue;
        const exists = payrolls.find((p) => String(p.employeeId) === String(emp.id) && p.period === period);
        if (exists) continue;
        await createPayrollInStrapi({
          employeeId: emp.id,
          period,
          baseSalary: Number(emp.baseSalary || 0),
          commissionTotal: getEmployeeCommissions(emp.id).reduce((s, c) => s + Number(c.amount || 0), 0),
          bonus: Number(bonusMap[emp.id]?.bonus || 0),
          deduction: Number(deductionMap[emp.id]?.deduction || 0),
          totalSalary: finalSalary,
          date: new Date().toISOString().slice(0, 10),
          status: 'paid',
        });
      }
      toast.success(`حقوق ${employees.length} نفر ثبت شد`);
      setShowGenerator(false);
      await loadData();
    } catch (e) { toast.error('خطا: ' + e.message); }
    finally { setSaving(false); }
  };

  const columns = [
    { header: 'کارگر', accessor: 'employeeName' },
    { header: 'دوره', accessor: 'period' },
    { header: 'حقوق پایه', render: (row) => formatCurrency(row.baseSalary) },
    { header: 'کمیسیون', render: (row) => formatCurrency(row.commissionTotal || 0) },
    { header: 'پاداش', render: (row) => formatCurrency(row.bonus || 0) },
    { header: 'کسورات', render: (row) => formatCurrency(row.deduction || 0) },
    { header: 'خالص', render: (row) => <strong style={{ color: 'var(--accent)' }}>{formatCurrency(row.totalSalary)}</strong> },
    { header: 'تاریخ', render: (row) => row.date?.slice(0, 10) || '—' },
    { header: '', render: (row) => <button onClick={(e) => { e.stopPropagation(); setShowDetail(row); }} className="btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }}>📋</button> },
  ];

  return (
    <div>
      <PageHeader title="حقوق و دستمزد" subtitle="ERP • حقوق"
        actions={!showGenerator && <Button onClick={openGenerator}>🧮 محاسبه حقوق ماهانه</Button>} />

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <StatCard value={payrolls.length} label="فیش‌های صادر شده" color="amber" icon="📄" loading={loading} />
        <StatCard value={employees.length} label="کارگران فعال" color="blue" icon="👷" loading={loading} />
        <StatCard value={formatCurrency(totalPaid)} label="جمع حقوق پرداختی" color="green" icon="💰" loading={loading} />
      </div>

      {payrolls.length > 0 ? (
        <Table columns={columns} data={payrolls} loading={loading} emptyMessage="هیچ فیش حقوقی صادر نشده" />
      ) : (
        <div className="panel-card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>💵</div>
          <p style={{ color: 'var(--text-secondary)' }}>هنوز فیش حقوقی صادر نشده است.</p>
        </div>
      )}

      <Modal open={showGenerator} onClose={() => setShowGenerator(false)} title="محاسبه حقوق ماهانه" size="xl"
        footer={<><Button variant="primary" onClick={confirmPayroll} disabled={saving}>{saving ? 'در حال ذخیره...' : '✅ تأیید و ذخیره'}</Button><Button variant="ghost" onClick={() => setShowGenerator(false)}>انصراف</Button></>}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>#</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>نام</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>پایه</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>کمیسیون</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>پاداش</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>کسورات</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>خالص</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => {
                const commTotal = getEmployeeCommissions(emp.id).reduce((s, c) => s + Number(c.amount || 0), 0);
                const finalSalary = calcFinalSalary(emp);
                return (
                  <tr key={emp.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{emp.name}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>{formatCurrency(emp.baseSalary || 0)}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', color: 'var(--info)' }}>{formatCurrency(commTotal)}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <input type="number" className="input-field" style={{ width: 80, padding: '4px 8px', fontSize: 12, textAlign: 'center' }}
                        value={bonusMap[emp.id]?.bonus || 0}
                        onChange={(e) => setBonusMap({ ...bonusMap, [emp.id]: { ...bonusMap[emp.id], bonus: Number(e.target.value) } })} />
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <input type="number" className="input-field" style={{ width: 80, padding: '4px 8px', fontSize: 12, textAlign: 'center' }}
                        value={deductionMap[emp.id]?.deduction || 0}
                        onChange={(e) => setDeductionMap({ ...deductionMap, [emp.id]: { ...deductionMap[emp.id], deduction: Number(e.target.value) } })} />
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 800, color: 'var(--accent)' }}>{formatCurrency(finalSalary)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--bg-surface)' }}>
                <td colSpan={6} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700 }}>جمع کل:</td>
                <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: 'var(--accent)' }}>
                  {formatCurrency(employees.reduce((s, emp) => s + calcFinalSalary(emp), 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Modal>

      <Modal open={!!showDetail} onClose={() => setShowDetail(null)} title="جزئیات فیش حقوقی" size="md">
        {showDetail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><strong style={{ color: 'var(--text-secondary)' }}>کارگر:</strong> {showDetail.employeeName}</div>
              <div><strong style={{ color: 'var(--text-secondary)' }}>دوره:</strong> {showDetail.period}</div>
              <div><strong style={{ color: 'var(--text-secondary)' }}>حقوق پایه:</strong> {formatCurrency(showDetail.baseSalary)}</div>
              <div><strong style={{ color: 'var(--text-secondary)' }}>کمیسیون:</strong> {formatCurrency(showDetail.commissionTotal || 0)}</div>
              <div><strong style={{ color: 'var(--text-secondary)' }}>پاداش:</strong> {formatCurrency(showDetail.bonus || 0)}</div>
              <div><strong style={{ color: 'var(--text-secondary)' }}>کسورات:</strong> {formatCurrency(showDetail.deduction || 0)}</div>
            </div>
            <div style={{ borderTop: '2px solid var(--accent)', paddingTop: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>خالص پرداختی</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>{formatCurrency(showDetail.totalSalary)}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
