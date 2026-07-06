'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const erpNavItems = [
  { href: '/dashboard/erp', label: 'داشبورد ERP', icon: '📊' },
  { href: '/dashboard/erp/sales', label: 'فروش و فاکتور', icon: '💰' },
  { href: '/dashboard/erp/repairs', label: 'تعمیرات', icon: '🔧' },
  { href: '/dashboard/erp/inventory', label: 'انبار و کالا', icon: '📦' },
  { href: '/dashboard/erp/employees', label: 'کارکنان', icon: '👥' },
  { href: '/dashboard/erp/commissions', label: 'کمیسیون‌ها', icon: '🏆' },
  { href: '/dashboard/erp/payroll', label: 'حقوق و دستمزد', icon: '💵' },
  { href: '/dashboard/erp/invoices', label: 'فاکتورهای استرپی', icon: '📋' },
  { href: '/dashboard/erp/services', label: 'خدمات استرپی', icon: '🛠️' },
  { href: '/dashboard/erp/settings', label: 'تنظیمات', icon: '⚙️' },
];

export default function ErpLayoutClient({ children }) {
  const pathname = usePathname();

  return (
    <div className="dashboard-page">
      {/* Sub-navigation */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 4,
        padding: '8px 12px', background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
        marginBottom: 16,
      }}>
        {erpNavItems.map((item) => {
          const isActive = item.href === '/dashboard/erp'
            ? pathname === '/dashboard/erp'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 'var(--radius-md)',
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="fade-up">
        {children}
      </div>
    </div>
  );
}
