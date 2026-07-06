'use client';

import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'تأیید حذف', message = 'آیا از حذف این آیتم اطمینان دارید؟', variant = 'danger', confirmText = 'حذف', cancelText = 'انصراف' }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{message}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 16 }}>
        <Button variant={variant} onClick={onConfirm}>{confirmText}</Button>
        <Button variant="ghost" onClick={onClose}>{cancelText}</Button>
      </div>
    </Modal>
  );
}
