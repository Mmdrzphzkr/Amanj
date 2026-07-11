'use client';

import { useState, useEffect } from 'react';
import { useErp } from '@/context/ErpContext';
import { getInvoicesFromStrapi, getRepairsFromStrapi, getProductsFromStrapi, getEmployeesFromStrapi, getCommissionsFromStrapi, getPayrollsFromStrapi } from './erpApi';
import StatCard from '@/components/erp/StatCard';
import { formatCurrency, getStatusColor } from '@/components/erp/helpers';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ErpDashboard() {
  const { state } = useErp();
  const [invoices, setInvoices] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [i, r, p, e, c] = await Promise.all([
          getInvoicesFromStrapi().catch(() => []),
          getRepairsFromStrapi().catch(() => []),
          getProductsFromStrapi().catch(() => []),
          getEmployeesFromStrapi().catch(() => []),
          getCommissionsFromStrapi().catch(() => []),
        ]);
        setInvoices(i); setRepairs(r); setProducts(p); setEmployees(e); setCommissions(c);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const paidSales = invoices.filter((i) => i.statuses === 'paid').reduce((s, i) => s + Number(i.totalAmount || 0), 0);
  const repairRevenue = repairs.filter((r) => r.statuses === 'delivered' || r.statuses === 'completed').reduce((s, r) => s + Number(r.totalCost || 0), 0);
  const pendingRepairs = repairs.filter((r) => r.statuses === 'pending' || r.statuses === 'in_progress').length;
  const lowStockItems = products.filter((p) => Number(p.stock) <= Number(p.minStock)).length;

  // Monthly chart data (last 6 months)
  const now = new Date();
  const jalaliMonths = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
  const monthData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthInvoices = invoices.filter((inv) => inv.date?.startsWith(monthStr));
    const monthRepairs = repairs.filter((r) => r.date?.startsWith(monthStr));
    monthData.push({
      name: jalaliMonths[d.getMonth()] || monthStr,
      فروش: monthInvoices.reduce((s, inv) => s + Number(inv.totalAmount || 0), 0) / 1000000,
      تعمیرات: monthRepairs.reduce((s, r) => s + Number(r.totalCost || 0), 0) / 1000000,
    });
  }

  const statusCounts = {};
  repairs.forEach((r) => { statusCounts[r.statuses] = (statusCounts[r.statuses] || 0) + 1; });
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const PIE_COLORS = ['#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6', '#ef4444'];

  const recentInvoices = [...invoices].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 5);
  const recentRepairs = [...repairs].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 5);

  const statusLabels = {
    draft: 'پیش‌نویس', pending: 'در انتظار', paid: 'پرداخت شده', canceled: 'لغو شده',
    in_progress: 'در حال تعمیر', completed: 'تکمیل شده', delivered: 'تحویل شده',
  };

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero__content">
          <div className="dashboard-kicker">ERP • داشبورد مدیریتی</div>
          <h1>{state.settings?.companyName || 'سیستم مدیریت'}</h1>
          <p>خلاصه وضعیت فروش، تعمیرات، انبار و حقوق کارکنان</p>
          <div className="dashboard-actions">
            <Link href="/dashboard/erp/sales" className="btn-primary">💰 مدیریت فروش</Link>
            <Link href="/dashboard/erp/repairs" className="btn-ghost">🔧 مدیریت تعمیرات</Link>
          </div>
        </div>
        <div className="dashboard-hero__status">
          <div className="dashboard-status-pill">● سیستم آنلاین</div>
          <div className="dashboard-status-card">
            <span>تاریخ امروز</span>
            <strong>{new Date().toLocaleDateString('fa-IR')}</strong>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title">آمار کلی</h2>
        <div className="stats-grid">
          <StatCard value={formatCurrency(paidSales)} label="فروش قطعی" color="amber" icon="💰" loading={loading} />
          <StatCard value={formatCurrency(repairRevenue)} label="درآمد تعمیرات" color="green" icon="🔧" loading={loading} />
          <StatCard value={pendingRepairs} label="تعمیرات در انتظار" color="blue" icon="⏳" loading={loading} />
          <StatCard value={lowStockItems} label="موجودی بحرانی" color="red" icon="⚠️" loading={loading} />
        </div>
      </section>

      <div className="dashboard-grid">
        <div className="panel-card">
          <div className="panel-card__header">📊 فروش و تعمیرات (۶ ماه اخیر)</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
              <Bar dataKey="فروش" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="تعمیرات" fill="var(--info)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel-card">
          <div className="panel-card__header">🎯 وضعیت تعمیرات</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                {pieData.map((_, idx) => (<Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            {pieData.map((entry, idx) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: PIE_COLORS[idx % PIE_COLORS.length], display: 'inline-block' }} />
                {statusLabels[entry.name] || entry.name}: {entry.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: 16 }}>
        <div className="panel-card">
          <div className="panel-card__header">📄 آخرین فاکتورها</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentInvoices.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 13, padding: '8px 0' }}>هنوز فاکتوری ثبت نشده</div>
            ) : recentInvoices.map((inv) => (
              <div key={inv.id} className="module-item" style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 13 }}>{inv.customerName}</strong>
                  <span className={`badge ${getStatusColor(inv.statuses)}`} style={{ fontSize: 11 }}>{statusLabels[inv.statuses] || inv.statuses}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                  <span>{inv.invoiceNumber}</span>
                  <span>{formatCurrency(inv.totalAmount || 0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel-card">
          <div className="panel-card__header">🔧 آخرین تعمیرات</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentRepairs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 13, padding: '8px 0' }}>هنوز تعمیری ثبت نشده</div>
            ) : recentRepairs.map((r) => (
              <div key={r.id} className="module-item" style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 13 }}>{r.customerName}</strong>
                  <span className={`badge ${getStatusColor(r.statuses)}`} style={{ fontSize: 11 }}>{statusLabels[r.statuses] || r.statuses}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                  <span>{r.repairNumber} - {r.brand || ''} {r.model || ''}</span>
                  <span>{formatCurrency(r.totalCost || 0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {employees.filter((e) => e.active !== false).length > 0 && (
        <section style={{ marginTop: 16 }}>
          <h2 className="section-title">👥 تیم فعال</h2>
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {employees.filter((e) => e.active !== false).map((emp) => {
              const empComm = commissions.filter((c) => String(c.employeeId) === String(emp.id)).reduce((s, c) => s + Number(c.amount || 0), 0);
              return (
                <div key={emp.id} className="stat-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--accent), #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: 'var(--bg-base)', flexShrink: 0 }}>{emp.name?.[0] || '?'}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{emp.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{emp.position || '—'}</div>
                    {empComm > 0 && <div style={{ fontSize: 11, color: 'var(--accent)' }}>🏆 {formatCurrency(empComm)}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
