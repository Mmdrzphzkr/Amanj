export function CardSkeleton({ count = 4 }) {
  return (
    <div className="stats-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="stat-card">
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--bg-hover)', animation: 'pulse 1.6s infinite' }} />
          <div style={{ width: '60%', height: 28, borderRadius: 8, background: 'var(--bg-hover)', animation: 'pulse 1.6s infinite', marginTop: 8 }} />
          <div style={{ width: '40%', height: 14, borderRadius: 4, background: 'var(--bg-hover)', animation: 'pulse 1.6s infinite' }} />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead><tr>{[1,2,3,4,5].map((i) => <th key={i}>...</th>)}</tr></thead>
        <tbody>
          {Array.from({ length: rows }).map((_, ri) => (
            <tr key={ri}>
              {[1,2,3,4,5].map((ci) => (
                <td key={ci}><div style={{ height: 14, width: '70%', background: 'var(--bg-hover)', borderRadius: 4, animation: 'pulse 1.6s infinite' }} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
