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
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const j_d_m = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  gy -= 1600;
  gm -= 1;

  let g_day_no = 365 * gy + ~~((gy + 3) / 4) - ~~((gy + 99) / 100) + ~~((gy + 399) / 400);
  g_day_no += g_d_m[gm] + gd;
  if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0))) ++g_day_no;

  let j_day_no = g_day_no - 80;
  let j_np = ~~(j_day_no / 12053);
  j_day_no %= 12053;
  let jy = 979 + 33 * j_np + 4 * ~~(j_day_no / 1461);
  j_day_no %= 1461;

  if (j_day_no >= 366) {
    jy += ~~((j_day_no - 1) / 365);
    j_day_no = (j_day_no - 1) % 365;
  }

  let i;
  for (i = 0; i < 11 && j_day_no >= j_d_m[i]; ++i) {
    j_day_no -= j_d_m[i];
  }

  return { year: jy, month: i + 1, day: j_day_no + 1 };
}

export function formatJalaliDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    const j = toJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    return `${j.year}/${String(j.month).padStart(2, '0')}/${String(j.day).padStart(2, '0')}`;
  } catch { return '—'; }
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
    canceled: 'badge-red',
    active: 'badge-green',
    inactive: 'badge-red',
  };
  return colors[statuses] || 'badge-amber';
}

export const invoiceStatuses = [
  { value: 'draft', label: 'پیش‌نویس' },
  { value: 'pending', label: 'در انتظار پرداخت' },
  { value: 'paid', label: 'پرداخت شده' },
  { value: 'canceled', label: 'لغو شده' },
];

export const repairStatuses = [
  { value: 'pending', label: 'در انتظار بررسی' },
  { value: 'in_progress', label: 'در حال تعمیر' },
  { value: 'completed', label: 'تکمیل شده' },
  { value: 'delivered', label: 'تحویل شده' },
  { value: 'canceled', label: 'لغو شده' },
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
