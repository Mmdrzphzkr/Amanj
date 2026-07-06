'use client';

import { formatCurrency, formatJalaliDate, toPersianNumber } from './helpers';

const printStyles = `
  @media print {
    body { direction: rtl; font-family: 'Vazirmatn', sans-serif; }
    .no-print { display: none !important; }
    @page { margin: 1cm; }
  }
`;

export default function PrintInvoice({ data, isRepair = false, settings }) {
  if (!data) return null;

  const title = isRepair ? 'فاکتور تعمیر' : 'صورتحساب فروش کالا و خدمات';

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) { alert('لطفاً مسدودکننده پنجره‌های بازشو را غیرفعال کنید.'); return; }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head><meta charset="UTF-8"><title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
      <style>body{font-family:'Vazirmatn',sans-serif;background:#fff;color:#222;margin:0;padding:20px;direction:rtl}
      ${printStyles}
      </style></head><body>
      ${document.getElementById('print-content')?.innerHTML || ''}
      <script>window.print();window.close();<\/script>
      </body></html>
    `);
    printWindow.document.close();
  };

  const items = data.items || [];
  const totalQty = items.reduce((s, i) => s + Number(i.quantity || 1), 0);

  return (
    <>
      <style>{printStyles}</style>
      <div className="no-print" style={{ marginBottom: 12 }}>
        <button onClick={handlePrint} className="btn-primary">🖨️ پرینت فاکتور</button>
      </div>

      <div id="print-content" style={{ background: '#fff', color: '#222', padding: 24, borderRadius: 8, border: '1px solid #ddd' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24, borderBottom: '2px solid #f59e0b', paddingBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#1a1a2e' }}>{settings?.companyName || 'شرکت قهوه‌ساز پارس'}</h1>
          <p style={{ fontSize: 12, color: '#666', margin: '4px 0' }}>{settings?.address || ''}</p>
          <p style={{ fontSize: 12, color: '#666', margin: 0 }}>تلفن: {settings?.phone || ''}</p>
          {settings?.nationalId && <p style={{ fontSize: 12, color: '#666', margin: '4px 0' }}>شناسه ملی: {settings.nationalId}</p>}
          {settings?.economicCode && <p style={{ fontSize: 12, color: '#666', margin: 0 }}>کد اقتصادی: {settings.economicCode}</p>}
        </div>

        <h2 style={{ textAlign: 'center', fontSize: 18, fontWeight: 700, color: '#f59e0b', margin: '0 0 16px' }}>{title}</h2>

        {/* Meta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 13 }}>
          <div><strong>شماره:</strong> {isRepair ? data.repairNumber : data.invoiceNumber}</div>
          <div><strong>تاریخ:</strong> {formatJalaliDate(data.date)}</div>
          <div><strong>روش پرداخت:</strong> {data.paymentMethod || '—'}</div>
        </div>

        {/* Customer */}
        <div style={{ background: '#f9f8f5', padding: 12, borderRadius: 6, marginBottom: 16, fontSize: 13 }}>
          <strong>مشتری:</strong> {data.customerName || '—'} &nbsp;|&nbsp; <strong>تلفن:</strong> {data.customerPhone || '—'}
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 16 }}>
          <thead>
            <tr style={{ background: '#f59e0b', color: '#fff' }}>
              <th style={{ padding: 8, textAlign: 'center' }}>#</th>
              <th style={{ padding: 8, textAlign: 'right' }}>شرح</th>
              <th style={{ padding: 8, textAlign: 'center' }}>تعداد</th>
              <th style={{ padding: 8, textAlign: 'left' }}>فی</th>
              <th style={{ padding: 8, textAlign: 'left' }}>تخفیف</th>
              <th style={{ padding: 8, textAlign: 'left' }}>مالیات</th>
              <th style={{ padding: 8, textAlign: 'left' }}>جمع</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id || i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 8, textAlign: 'center' }}>{toPersianNumber(i + 1)}</td>
                <td style={{ padding: 8 }}>{item.description || item.name || '—'}</td>
                <td style={{ padding: 8, textAlign: 'center' }}>{toPersianNumber(item.quantity || 1)}</td>
                <td style={{ padding: 8, textAlign: 'left', direction: 'ltr' }}>{toPersianNumber(Number(item.unitPrice || item.partsCost || 0).toLocaleString())}</td>
                <td style={{ padding: 8, textAlign: 'left' }}>{item.discount ? toPersianNumber(Number(item.discount).toLocaleString()) : '—'}</td>
                <td style={{ padding: 8, textAlign: 'left' }}>{item.tax ? toPersianNumber(Number(item.tax).toLocaleString()) : '—'}</td>
                <td style={{ padding: 8, textAlign: 'left', fontWeight: 700 }}>{toPersianNumber(Number(item.total || (item.partsCost + item.laborCost) * (item.quantity || 1)).toLocaleString())}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ borderTop: '2px solid #f59e0b', paddingTop: 12, textAlign: 'left', fontSize: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 300, marginRight: 'auto' }}>
            <span>تعداد اقلام: {toPersianNumber(items.length)}</span>
            <span>تعداد کل: {toPersianNumber(totalQty)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 300, marginRight: 'auto', marginTop: 4 }}>
            <span>جمع کل:</span>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#f59e0b' }}>
              {formatCurrency(data.totalAmount || data.totalCost || 0)}
            </span>
          </div>
        </div>

        {/* Note */}
        {data.note && (
          <div style={{ marginTop: 16, padding: 12, background: '#f9f8f5', borderRadius: 6, fontSize: 12 }}>
            <strong>توضیحات:</strong> {data.note}
          </div>
        )}

        {/* Signatures */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 16, borderTop: '1px dashed #ccc', fontSize: 12 }}>
          <div style={{ textAlign: 'center' }}><div style={{ marginBottom: 40 }}>امضاء فروشنده</div><div>——————————</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ marginBottom: 40 }}>مهر شرکت</div><div>——————————</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ marginBottom: 40 }}>امضاء خریدار</div><div>——————————</div></div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 10, color: '#999', borderTop: '1px solid #eee', paddingTop: 8 }}>
          <span>تاریخ چاپ: {new Date().toLocaleDateString('fa-IR')} - ERP قهوه‌ساز پارس</span>
        </div>
      </div>
    </>
  );
}
