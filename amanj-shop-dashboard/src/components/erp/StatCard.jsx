export default function StatCard({ icon, value, label, color = 'amber', loading = false }) {
  const colorMap = {
    amber: { bg: 'var(--accent-dim)', text: 'var(--accent)' },
    blue: { bg: 'var(--info-dim)', text: 'var(--info)' },
    green: { bg: 'var(--success-dim)', text: 'var(--success)' },
    red: { bg: 'var(--danger-dim)', text: 'var(--danger)' },
    purple: { bg: 'rgba(168,85,247,0.12)', text: '#a855f7' },
    cyan: { bg: 'rgba(6,182,212,0.12)', text: '#06b6d4' },
  };
  const colors = colorMap[color] || colorMap.amber;

  return (
    <div className="stat-card" style={{ opacity: loading ? 0.7 : 1 }}>
      <div className="stat-icon" style={{ background: colors.bg, color: colors.text }}>{icon}</div>
      <div className="stat-value">{loading ? <div className="stat-skeleton stat-skeleton--value" /> : value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
