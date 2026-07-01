export const ERP_STORAGE_KEYS = {
  invoices: "erp-invoices",
  services: "erp-services",
  payroll: "erp-payroll",
};

export function readErpItems(key, fallback = []) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error("Failed to read ERP storage", error);
    return fallback;
  }
}

export function writeErpItems(key, value) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to write ERP storage", error);
  }
}
