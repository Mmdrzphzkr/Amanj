const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

async function strapiRequest(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}/api${path}`, {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error?.message || "درخواست به استرپی با خطا مواجه شد");
  }

  return payload;
}

function toPersianDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("fa-IR");
  } catch {
    return value;
  }
}

function normalizeInvoiceRecord(item) {
  const attrs = item?.attributes || {};
  const firstItem = attrs.items?.data?.[0]?.attributes;

  return {
    id: item?.id,
    customerName: attrs.customer?.data?.attributes?.full_name || "—",
    items: firstItem?.description || attrs.note || "آیتم ثبت‌شده",
    amount: Number(attrs.total_amount || 0),
    note: attrs.note || "",
    createdAt: toPersianDate(attrs.createdAt),
  };
}

function normalizeServiceRecord(item) {
  const attrs = item?.attributes || {};
  return {
    id: item?.id,
    customerName: attrs.customer?.data?.attributes?.full_name || "—",
    serviceName: attrs.service_title || "—",
    amount: Number(attrs.amount || 0),
    note: attrs.description || "",
    createdAt: toPersianDate(attrs.createdAt),
  };
}

function normalizePayrollRecord(item) {
  const attrs = item?.attributes || {};
  return {
    id: item?.id,
    workerName: attrs.employee?.data?.attributes?.full_name || "—",
    workDays: Number(attrs.work_days || 0),
    salaryPerDay: Number(attrs.daily_salary || 0),
    bonus: Number(attrs.bonus || 0),
    totalSalary: Number(attrs.total_salary || 0),
    note: attrs.note || "",
    createdAt: toPersianDate(attrs.createdAt),
  };
}

export async function getInvoicesFromStrapi() {
  const payload = await strapiRequest("/invoices?populate[customer][fields][0]=full_name&populate[items][fields][0]=description&sort=createdAt:desc");
  return (payload?.data || []).map(normalizeInvoiceRecord);
}

export async function createInvoiceInStrapi({ customerName, amount, items, note }) {
  const customerPayload = await strapiRequest("/customers", {
    method: "POST",
    body: {
      data: {
        full_name: customerName,
        phone: "-",
        notes: note || "",
      },
    },
  });

  const invoicePayload = await strapiRequest("/invoices", {
    method: "POST",
    body: {
      data: {
        invoice_number: `INV-${Date.now()}`,
        status: "pending",
        issue_date: new Date().toISOString(),
        subtotal: Number(amount),
        total_amount: Number(amount),
        payment_method: "online_gateway",
        note: note || "",
        customer: customerPayload?.data?.id,
      },
    },
  });

  await strapiRequest("/invoice-items", {
    method: "POST",
    body: {
      data: {
        invoice: invoicePayload?.data?.id,
        description: items || "آیتم ثبت‌شده",
        quantity: 1,
        unit_price: Number(amount),
        total_price: Number(amount),
      },
    },
  });

  return invoicePayload;
}

export async function getServicesFromStrapi() {
  const payload = await strapiRequest("/service-invoices?populate[customer][fields][0]=full_name&sort=createdAt:desc");
  return (payload?.data || []).map(normalizeServiceRecord);
}

export async function createServiceInStrapi({ customerName, serviceName, amount, note }) {
  const customerPayload = await strapiRequest("/customers", {
    method: "POST",
    body: {
      data: {
        full_name: customerName,
        phone: "-",
        notes: note || "",
      },
    },
  });

  return strapiRequest("/service-invoices", {
    method: "POST",
    body: {
      data: {
        invoice_number: `SRV-${Date.now()}`,
        customer: customerPayload?.data?.id,
        service_title: serviceName,
        description: note || "",
        amount: Number(amount),
        status: "pending",
      },
    },
  });
}

export async function getPayrollsFromStrapi() {
  const payload = await strapiRequest("/payroll-records?populate[employee][fields][0]=full_name&sort=createdAt:desc");
  return (payload?.data || []).map(normalizePayrollRecord);
}

export async function createPayrollInStrapi({ workerName, workDays, salaryPerDay, bonus, note }) {
  const employeePayload = await strapiRequest("/employees", {
    method: "POST",
    body: {
      data: {
        full_name: workerName,
        phone: "-",
        position: "کارگر",
      },
    },
  });

  const totalSalary = Number(workDays) * Number(salaryPerDay) + Number(bonus || 0);

  return strapiRequest("/payroll-records", {
    method: "POST",
    body: {
      data: {
        employee: employeePayload?.data?.id,
        period: new Date().toISOString().slice(0, 7),
        work_days: Number(workDays),
        daily_salary: Number(salaryPerDay),
        bonus: Number(bonus || 0),
        total_salary: totalSalary,
        status: "pending",
        note: note || "",
      },
    },
  });
}
