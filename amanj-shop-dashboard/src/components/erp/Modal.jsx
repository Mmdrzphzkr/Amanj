'use client';

import { useEffect, useState } from 'react';

const sizeMap = {
  sm: '360px',
  md: '480px',
  lg: '600px',
  xl: '780px',
  full: '95vw',
};

export default function Modal({ open, onClose, title, children, size = 'md', footer }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 200);
  };

  if (!open && !closing) return null;

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, opacity: closing ? 0 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: sizeMap[size] || sizeMap.md,
          maxHeight: '90vh', overflowY: 'auto',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-dropdown)',
          transform: closing ? 'scale(0.95) translateY(10px)' : 'scale(1) translateY(0)',
          transition: 'transform 0.2s, opacity 0.2s',
          opacity: closing ? 0 : 1,
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 20, borderRadius: 2, background: 'var(--accent)' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
          </div>
          <button onClick={handleClose} style={{
            background: 'var(--bg-hover)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', padding: '4px 10px', cursor: 'pointer',
            color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1,
          }}>✕</button>
        </div>
        <div style={{ padding: '16px 20px' }}>
          {children}
        </div>
        {footer && (
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 10,
            padding: '12px 20px', borderTop: '1px solid var(--border)',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
