import { toPersianNumber } from './helpers';

export default function Table({ columns = [], data = [], onRowClick, emptyMessage = 'داده‌ای یافت نشد', loading = false }) {
  if (loading) {
    return (
      <div className="table-wrapper">
        <table>
          <thead><tr>{columns.map((col, i) => <th key={i}>{col.header}</th>)}</tr></thead>
          <tbody>
            {[1,2,3,4,5].map((row) => (
              <tr key={row}>
                {columns.map((_, ci) => (
                  <td key={ci}>
                    <div style={{ height: 16, width: '60%', background: 'var(--bg-hover)', borderRadius: 4, animation: 'pulse 1.6s infinite' }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
        <div>{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th style={{ width: 40 }}>#</th>
            {columns.map((col, i) => (
              <th key={i} className={col.className}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} onClick={() => onRowClick?.(row)} style={{ cursor: onRowClick ? 'pointer' : undefined }}>
              <td style={{ color: 'var(--text-muted)' }}>{toPersianNumber(rowIndex + 1)}</td>
              {columns.map((col, ci) => (
                <td key={ci} className={col.cellClassName}>
                  {col.render ? col.render(row, rowIndex) : (col.accessor ? row[col.accessor] : '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
