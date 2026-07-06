export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header">
      <div>
        {subtitle && <div className="dashboard-kicker">{subtitle}</div>}
        <h1 className="page-title">{title}</h1>
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
}
