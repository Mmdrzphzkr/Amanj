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

export function jalaliToGregorian(jy, jm, jd) {
  const j_month_days = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  const g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  jy -= 979;
  let j_day_no = 365 * jy + ~~(jy / 33) * 8 + ~~((jy % 33 + 3) / 4);
  for (let i = 0; i < jm - 1; i++) j_day_no += j_month_days[i];
  j_day_no += jd;

  j_day_no += 80;

  let g_day_no = j_day_no;
  let gy = 1600 + 400 * ~~(g_day_no / 146097);
  g_day_no %= 146097;
  gy += 100 * ~~(g_day_no / 36524);
  g_day_no %= 36524;
  gy += 4 * ~~(g_day_no / 1461);
  g_day_no %= 1461;
  gy += ~~(g_day_no / 365);
  g_day_no %= 365;

  if (g_day_no === 0) { gy--; g_day_no = 365; }

  const isLeap = (gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0);
  let gm = 0;
  for (let i = 0; i < 12; i++) {
    const dim = g_days_in_month[i] + (i === 1 && isLeap ? 1 : 0);
    if (g_day_no <= dim) { gm = i + 1; break; }
    g_day_no -= dim;
  }
  return { year: gy, month: gm, day: g_day_no };
}

export function isJalaliLeapYear(jy) {
  const p = ((jy - 1) % 33) + 1;
  return p === 1 || p === 5 || p === 9 || p === 13 || p === 17 || p === 22 || p === 26 || p === 30;
}

export function daysInJalaliMonth(jy, jm) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isJalaliLeapYear(jy) ? 30 : 29;
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
  { value: 'commission_only', label: 'فقط کمیسیون' },
];

export const productCategories = [
  { value: 'coffee_machine', label: 'دستگاه قهوه‌ساز' },
  { value: 'accessory', label: 'لوازم جانبی' },
  { value: 'spare_part', label: 'قطعات یدکی' },
];
