export default function Button({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', type = 'button', icon: Icon }) {
  const base = 'inline-flex items-center justify-center gap-2 font-vazir font-bold rounded-[var(--radius-md)] transition-all duration-150 cursor-pointer no-underline border-none font-family-[inherit]';
  const variants = {
    primary: 'bg-[var(--accent)] text-[#0d0f14] hover:bg-[var(--accent-hover)] hover:-translate-y-px active:translate-y-0',
    secondary: 'bg-transparent text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
    danger: 'bg-[var(--danger-dim)] text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white',
    success: 'bg-[var(--success-dim)] text-[var(--success)] hover:bg-[var(--success)] hover:text-white',
    ghost: 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]',
    outline: 'bg-transparent border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-[18px] py-[10px] text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {Icon && <span>{typeof Icon === 'function' ? <Icon /> : Icon}</span>}
      {children}
    </button>
  );
}
