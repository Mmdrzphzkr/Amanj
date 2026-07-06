export function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="label">{label}</label>}
      <input className={`input-field ${error ? 'border-[var(--danger)]' : ''}`} {...props} />
      {error && <span style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{error}</span>}
    </div>
  );
}

export function Select({ label, options = [], error, className = '', ...props }) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="label">{label}</label>}
      <select className={`input-field ${error ? 'border-[var(--danger)]' : ''}`} {...props}>
        <option value="">انتخاب کنید...</option>
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const labelText = typeof opt === 'string' ? opt : opt.label;
          return <option key={value} value={value}>{labelText}</option>;
        })}
      </select>
      {error && <span style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{error}</span>}
    </div>
  );
}

export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="label">{label}</label>}
      <textarea className={`input-field ${error ? 'border-[var(--danger)]' : ''}`} {...props} />
      {error && <span style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{error}</span>}
    </div>
  );
}
