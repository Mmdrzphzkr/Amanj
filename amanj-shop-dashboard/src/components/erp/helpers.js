const persianDigits = { '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹' };

export function toPersianNumber(num) {
  if (num == null) return '';
  return String(num).replace(/\d/g, (d) => persianDigits[d] || d);
}

export function formatCurrency(amount) {
  const num = Number(amount || 0);
  return `${new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(num)} تومان`;
}

export function formatNumber(num) {
  return new Intl.NumberFormat('fa-IR').format(Number(num || 0));
}

export function toJalali(gy, gm, gd) {
  const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = 355666 + (365 * gy) + ~~((gy + 3) / 4) - ~~((gy + 99) / 100) + ~~((gy + 399) / 400) + gd + gdm[gm - 1];
  days -= (gy - 1600) - 1;
  days -= (gy2 - 1600) - 1;
  days += (gy2 - 1600) / 4 | 0;
  days -= (gy2 - 1600) / 100 | 0;
  days += (gy2 - 1600) / 400 | 0;
  days -= 100;
  let jy = 0, jm = 0, jd = 0;
  jy = 1177;
  days -= 1;
  let i;
  for (i = 0; i < 1200; i++) {
    const yearDays = (jy % 4 === 3) ? 366 : 365;
    if (days < yearDays) break;
    days -= yearDays;
    jy++;
  }
  const jmDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  if (jy % 4 === 3) jmDays[11] = 30;
  for (i = 0; i < 12; i++) {
    if (days < jmDays[i]) break;
    days -= jmDays[i];
    jm++;
  }
  jm++;
  jd = days + 1;
  return { year: jy, month: jm, day: jd };
}

export function formatJalaliDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    const j = toJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    return `${j.year}/${String(j.month).padStart(2, '0')}/${String(j.day).padStart(2, '0')}`;
  } catch { return dateStr; }
}

export function getTodayJalali() {
  const d = new Date();
  const j = toJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return `${j.year}/${String(j.month).padStart(2, '0')}/${String(j.day).padStart(2, '0')}`;
}

export function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

export const jalaliMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function getStatusColor(statuses) {
  const colors = {
    draft: 'badge-amber',
    pending: 'badge-blue',
    paid: 'badge-green',
    completed: 'badge-green',
    cancelled: 'badge-red',
    active: 'badge-green',
    inactive: 'badge-red',
  };
  return colors[statuses] || 'badge-amber';
}

export const invoiceStatuses = [
  { value: 'draft', label: 'پیش‌نویس' },
  { value: 'pending', label: 'در انتظار پرداخت' },
  { value: 'paid', label: 'پرداخت شده' },
  { value: 'cancelled', label: 'لغو شده' },
];

export const repairStatuses = [
  { value: 'pending', label: 'در انتظار بررسی' },
  { value: 'in_progress', label: 'در حال تعمیر' },
  { value: 'completed', label: 'تکمیل شده' },
  { value: 'delivered', label: 'تحویل شده' },
  { value: 'cancelled', label: 'لغو شده' },
];

export const paymentMethods = [
  { value: 'cash', label: 'نقدی' },
  { value: 'card', label: 'کارت خوان' },
  { value: 'online_gateway', label: 'درگاه اینترنتی' },
  { value: 'check', label: 'چک' },
  { value: 'transfer', label: 'حواله' },
];

export const salaryTypes = [
  { value: 'daily', label: 'روزانه' },
  { value: 'monthly', label: 'ماهانه' },
  { value: 'contract', label: 'پیمانی' },
];

export const productCategories = [
  { value: 'coffee_machine', label: 'دستگاه قهوه‌ساز' },
  { value: 'accessory', label: 'لوازم جانبی' },
  { value: 'spare_part', label: 'قطعات یدکی' },
];
