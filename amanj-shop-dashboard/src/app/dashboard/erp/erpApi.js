const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "";

async function strapiRequest(path, options = {}) {
  const response = await fetch(`${STRAPI_URL}/api${path}`, {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.error?.message || "درخواست به استرپی با خطا مواجه شد",
    );
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

// ─── Normalizers ──────────────────────────────────────────

function normalizeInvoiceRecord(item) {
  const attrs = item || {};
  return {
    id: item?.id,
    invoiceNumber: attrs.invoice_number || "",
    date: attrs.issue_date || attrs.createdAt?.slice(0, 10) || "",
    customerName: attrs.customer?.full_name || "—",
    customerPhone: attrs.customer?.phone || "",
    items: (attrs.items || []).map((it) => ({
      id: it.id,
      description: it.description || "",
      quantity: Number(it.quantity || 1),
      unitPrice: Number(it.unit_price || 0),
      discount: Number(it.discount || 0),
      tax: Number(it.tax || 0),
      total: Number(it.total_price || 0),
    })),
    subtotal: Number(attrs.subtotal || 0),
    discount: Number(attrs.discount || 0),
    taxAmount: Number(attrs.tax_amount || 0),
    totalAmount: Number(attrs.total_amount || 0),
    paymentMethod: attrs.payment_method || "",
    statuses: attrs.statuses || "draft",
    note: attrs.note || "",
    createdAt: toPersianDate(attrs.createdAt),
  };
}

function normalizeProductRecord(item) {
  const attrs = item?.attributes || {};
  return {
    id: item?.id,
    name: attrs.name || "",
    category: attrs.category || "coffee_machine",
    sku: attrs.sku || "",
    purchasePrice: Number(attrs.purchase_price || 0),
    sellingPrice: Number(attrs.price || attrs.selling_price || 0),
    stock: Number(attrs.stock || 0),
    minStock: Number(attrs.min_stock || 0),
    supplier: attrs.supplier || "",
  };
}

function normalizeEmployeeRecord(item) {
  const attrs = item?.attributes || {};
  return {
    id: item?.id,
    name: attrs.full_name || "",
    phone: attrs.phone || "",
    position: attrs.position || "",
    salaryType: attrs.salary_type || "monthly",
    baseSalary: Number(attrs.base_salary || 0),
    active: attrs.active !== false,
  };
}

function normalizeRepairRecord(item) {
  const attrs = item?.attributes || {};
  return {
    id: item?.id,
    repairNumber: attrs.repair_number || "",
    date: attrs.date || attrs.createdAt?.slice(0, 10) || "",
    customerName: attrs.customer?.full_name || "—",
    customerPhone: attrs.customer?.phone || "",
    brand: attrs.brand || "",
    model: attrs.model || "",
    serialNumber: attrs.serial_number || "",
    problem: attrs.problem || "",
    technician: attrs.technician || "",
    receivedDate: attrs.received_date || "",
    deliveryDate: attrs.delivery_date || "",
    items: (attrs.items || []).map((it) => ({
      id: it.id,
      name: it.name || "",
      partsCost: Number(it.parts_cost || 0),
      laborCost: Number(it.labor_cost || 0),
      quantity: Number(it.quantity || 1),
      description: it.description || "",
      total: Number(it.total || 0),
    })),
    totalCost: Number(attrs.total_cost || 0),
    statuses: attrs.statuses || "pending",
    note: attrs.note || "",
    createdAt: toPersianDate(attrs.createdAt),
  };
}

function normalizeCommissionRecord(item) {
  const attrs = item || {};
  return {
    id: item?.id,
    employeeId: attrs.employee?.id || "",
    employeeName: attrs.employee?.full_name || "",
    type: attrs.type || "invoice",
    reference: attrs.reference || "",
    amount: Number(attrs.amount || 0),
    date: attrs.date || attrs.createdAt?.slice(0, 10) || "",
    description: attrs.description || "",
  };
}

function normalizePayrollRecord(item) {
  const attrs = item || {};
  return {
    id: item?.id,
    employeeId: attrs.employee?.id || "",
    employeeName: attrs.employee?.full_name || "—",
    period: attrs.period || "",
    baseSalary: Number(attrs.base_salary || 0),
    commissionTotal: Number(attrs.commission_total || 0),
    bonus: Number(attrs.bonus || 0),
    deduction: Number(attrs.deduction || 0),
    totalSalary: Number(attrs.total_salary || 0),
    date: attrs.date || attrs.createdAt?.slice(0, 10) || "",
    statuses: attrs.statuses || "paid",
    note: attrs.note || "",
    createdAt: toPersianDate(attrs.createdAt),
  };
}

function normalizeServiceRecord(item) {
  const attrs = item || {};
  return {
    id: item?.id,
    customerName: attrs.customer?.full_name || "—",
    serviceName: attrs.service_title || "—",
    amount: Number(attrs.amount || 0),
    note: attrs.description || "",
    createdAt: toPersianDate(attrs.createdAt),
  };
}

// ─── Invoices ─────────────────────────────────────────────

export async function getInvoicesFromStrapi() {
  const payload = await strapiRequest(
    "/invoices?populate[customer][fields][0]=full_name&populate[customer][fields][1]=phone&populate[items][fields][0]=description&populate[items][fields][1]=quantity&populate[items][fields][2]=unit_price&populate[items][fields][3]=discount&populate[items][fields][4]=total_price&sort=createdAt:desc",
  );
  return (payload?.data || []).map(normalizeInvoiceRecord);
}

export async function createInvoiceInStrapi({
  customerName,
  customerPhone,
  invoiceNumber,
  date,
  items,
  subtotal,
  discount,
  taxAmount,
  totalAmount,
  paymentMethod,
  statuses,
  note,
}) {
  let customerId = null;
  const existingCustomers = await strapiRequest(
    `/customers?filters[full_name][$eq]=${encodeURIComponent(customerName)}&fields[0]=id`,
  );
  if (existingCustomers?.data?.length > 0) {
    customerId = existingCustomers.data[0].id;
  } else {
    const custRes = await strapiRequest("/customers", {
      method: "POST",
      body: {
        data: {
          full_name: customerName,
          phone: customerPhone || "-",
          notes: note || "",
        },
      },
    });
    customerId = custRes?.data?.id;
  }

  const invoiceRes = await strapiRequest("/invoices", {
    method: "POST",
    body: {
      data: {
        invoice_number: invoiceNumber || `INV-${Date.now()}`,
        issue_date: date || new Date().toISOString().slice(0, 10),
        statuses: statuses || "draft",
        customer: customerId,
        subtotal: Number(subtotal || 0),
        discount: Number(discount || 0),
        total_amount: Number(totalAmount || 0),
        payment_method: paymentMethod || "cash",
        note: note || "",
      },
    },
  });
  const invoiceId = invoiceRes?.documentId;

  if (invoiceId && items?.length) {
    for (const item of items) {
      await strapiRequest("/invoice-items", {
        method: "POST",
        body: {
          data: {
            invoice: invoiceId,
            description: item.description || "آیتم",
            quantity: Number(item.quantity || 1),
            unit_price: Number(item.unitPrice || 0),
            discount: Number(item.discount || 0),
            total_price: Number(item.total || 0),
          },
        },
      });
    }
  }
  return invoiceRes;
}

export async function updateInvoiceInStrapi(
  id,
  {
    customerName,
    customerPhone,
    invoiceNumber,
    date,
    items,
    subtotal,
    discount,
    taxAmount,
    totalAmount,
    paymentMethod,
    statuses,
    note,
  },
) {
  let customerId = null;
  if (customerName) {
    const existingCustomers = await strapiRequest(
      `/customers?filters[full_name][$eq]=${encodeURIComponent(customerName)}&fields[0]=id`,
    );
    if (existingCustomers?.data?.length > 0) {
      customerId = existingCustomers.data[0].id;
    } else {
      const custRes = await strapiRequest("/customers", {
        method: "POST",
        body: {
          data: {
            full_name: customerName,
            phone: customerPhone || "-",
            notes: note || "",
          },
        },
      });
      customerId = custRes?.data?.id;
    }
  }

  const invoiceRes = await strapiRequest(`/invoices/${documentId}`, {
    method: "PUT",
    body: {
      data: {
        invoice_number: invoiceNumber,
        issue_date: date,
        statuses,
        customer: customerId,
        subtotal: Number(subtotal || 0),
        discount: Number(discount || 0),
        total_amount: Number(totalAmount || 0),
        payment_method: paymentMethod,
        note: note || "",
      },
    },
  });

  if (items?.length) {
    const existing = await strapiRequest(
      `/invoice-items?filters[invoice][id][$eq]=${id}&fields[0]=id`,
    );
    for (const old of existing?.data || []) {
      await strapiRequest(`/invoice-items/${old.id}`, { method: "DELETE" });
    }
    for (const item of items) {
      if (item.description) {
        await strapiRequest("/invoice-items", {
          method: "POST",
          body: {
            data: {
              invoice: id,
              description: item.description,
              quantity: Number(item.quantity || 1),
              unit_price: Number(item.unitPrice || 0),
              discount: Number(item.discount || 0),
              total_price: Number(item.total || 0),
            },
          },
        });
      }
    }
  }
  return invoiceRes;
}

export async function deleteInvoiceFromStrapi(id) {
  const existing = await strapiRequest(
    `/invoice-items?filters[invoice][id][$eq]=${id}&fields[0]=id`,
  );
  for (const old of existing?.data || []) {
    await strapiRequest(`/invoice-items/${old.id}`, { method: "DELETE" });
  }
  return strapiRequest(`/invoices/${id}`, { method: "DELETE" });
}

// ─── Repairs ──────────────────────────────────────────────

export async function getRepairsFromStrapi() {
  const payload = await strapiRequest(
    "/repairs?populate[customer][fields][0]=full_name&populate[customer][fields][1]=phone&populate[items][populate]=*&sort=createdAt:desc",
  );
  return (payload?.data || []).map(normalizeRepairRecord);
}

export async function createRepairInStrapi(data) {
  let customerId = null;
  if (data.customerName) {
    const existing = await strapiRequest(
      `/customers?filters[full_name][$eq]=${encodeURIComponent(data.customerName)}&fields[0]=id`,
    );
    if (existing?.data?.length > 0) {
      customerId = existing.data[0].id;
    } else {
      const custRes = await strapiRequest("/customers", {
        method: "POST",
        body: {
          data: {
            full_name: data.customerName,
            phone: data.customerPhone || "-",
            notes: data.note || "",
          },
        },
      });
      customerId = custRes?.data?.id;
    }
  }

  const repairRes = await strapiRequest("/repairs", {
    method: "POST",
    body: {
      data: {
        repair_number: data.repairNumber || `SRV-${Date.now()}`,
        date: data.date || new Date().toISOString().slice(0, 10),
        customer: customerId,
        brand: data.brand || "",
        model: data.model || "",
        serial_number: data.serialNumber || "",
        problem: data.problem || "",
        technician: data.technician || "",
        received_date: data.receivedDate || data.date,
        delivery_date: data.deliveryDate || null,
        total_cost: Number(data.totalCost || 0),
        statuses: data.statuses || "pending",
        note: data.note || "",
      },
    },
  });
  const repairId = repairRes?.data?.id;

  if (repairId && data.items?.length) {
    for (const item of data.items) {
      if (item.name) {
        await strapiRequest("/repair-items", {
          method: "POST",
          body: {
            data: {
              repair: repairId,
              name: item.name,
              parts_cost: Number(item.partsCost || 0),
              labor_cost: Number(item.laborCost || 0),
              quantity: Number(item.quantity || 1),
              description: item.description || "",
              total: Number(
                (Number(item.partsCost || 0) + Number(item.laborCost || 0)) *
                  Number(item.quantity || 1),
              ),
            },
          },
        });
      }
    }
  }
  return repairRes;
}

export async function updateRepairInStrapi(id, data) {
  let customerId = null;
  if (data.customerName) {
    const existing = await strapiRequest(
      `/customers?filters[full_name][$eq]=${encodeURIComponent(data.customerName)}&fields[0]=id`,
    );
    if (existing?.data?.length > 0) {
      customerId = existing.data[0].id;
    } else {
      const custRes = await strapiRequest("/customers", {
        method: "POST",
        body: {
          data: {
            full_name: data.customerName,
            phone: data.customerPhone || "-",
          },
        },
      });
      customerId = custRes?.data?.id;
    }
  }

  const repairRes = await strapiRequest(`/repairs/${documentId}`, {
    method: "PUT",
    body: {
      data: {
        repair_number: data.repairNumber,
        date: data.date,
        customer: customerId,
        brand: data.brand || "",
        model: data.model || "",
        serial_number: data.serialNumber || "",
        problem: data.problem || "",
        technician: data.technician || "",
        received_date: data.receivedDate,
        delivery_date: data.deliveryDate || null,
        total_cost: Number(data.totalCost || 0),
        statuses: data.statuses || "pending",
        note: data.note || "",
      },
    },
  });

  const existing = await strapiRequest(
    `/repair-items?filters[repair][id][$eq]=${id}&fields[0]=id`,
  );
  for (const old of existing?.data || []) {
    await strapiRequest(`/repair-items/${old.id}`, { method: "DELETE" });
  }
  if (data.items?.length) {
    for (const item of data.items) {
      if (item.name) {
        await strapiRequest("/repair-items", {
          method: "POST",
          body: {
            data: {
              repair: id,
              name: item.name,
              parts_cost: Number(item.partsCost || 0),
              labor_cost: Number(item.laborCost || 0),
              quantity: Number(item.quantity || 1),
              description: item.description || "",
              total: Number(
                (Number(item.partsCost || 0) + Number(item.laborCost || 0)) *
                  Number(item.quantity || 1),
              ),
            },
          },
        });
      }
    }
  }
  return repairRes;
}

export async function deleteRepairFromStrapi(id) {
  const existing = await strapiRequest(
    `/repair-items?filters[repair][id][$eq]=${id}&fields[0]=id`,
  );
  for (const old of existing?.data || []) {
    await strapiRequest(`/repair-items/${old.id}`, { method: "DELETE" });
  }
  return strapiRequest(`/repairs/${id}`, { method: "DELETE" });
}

// ─── Products (uses existing Strapi product content type) ──

export async function getProductsFromStrapi() {
  const payload = await strapiRequest(
    "/products?fields[0]=name&fields[1]=sku&fields[2]=price&fields[3]=stock&fields[4]=category&fields[5]=purchase_price&fields[6]=min_stock&fields[7]=supplier&sort=createdAt:desc",
  );
  return (payload?.data || []).map(normalizeProductRecord);
}

export async function createProductInStrapi(data) {
  return strapiRequest("/products", {
    method: "POST",
    body: {
      data: {
        name: data.name,
        category: data.category || "coffee_machine",
        sku: data.sku || "",
        price: Number(data.sellingPrice || 0),
        purchase_price: Number(data.purchasePrice || 0),
        stock: Number(data.stock || 0),
        min_stock: Number(data.minStock || 0),
        supplier: data.supplier || "",
      },
    },
  });
}

export async function updateProductInStrapi(id, data) {
  return strapiRequest(`/products/${documentId}`, {
    method: "PUT",
    body: {
      data: {
        name: data.name,
        category: data.category,
        sku: data.sku,
        price: Number(data.sellingPrice || 0),
        purchase_price: Number(data.purchasePrice || 0),
        stock: Number(data.stock || 0),
        min_stock: Number(data.minStock || 0),
        supplier: data.supplier,
      },
    },
  });
}

export async function deleteProductFromStrapi(id) {
  return strapiRequest(`/products/${id}`, { method: "DELETE" });
}

// ─── Employees ────────────────────────────────────────────

export async function getEmployeesFromStrapi() {
  const payload = await strapiRequest("/employees?sort=createdAt:desc");
  return (payload?.data || []).map(normalizeEmployeeRecord);
}

export async function createEmployeeInStrapi(data) {
  return strapiRequest("/employees", {
    method: "POST",
    body: {
      data: {
        full_name: data.name,
        phone: data.phone || "-",
        position: data.position || "",
        salary_type: data.salaryType || "monthly",
        base_salary: Number(data.baseSalary || 0),
        active: data.active !== false,
      },
    },
  });
}

export async function updateEmployeeInStrapi(id, data) {
  return strapiRequest(`/employees/${documentId}`, {
    method: "PUT",
    body: {
      data: {
        full_name: data.name,
        phone: data.phone,
        position: data.position,
        salary_type: data.salaryType,
        base_salary: Number(data.baseSalary || 0),
        active: data.active !== false,
      },
    },
  });
}

export async function deleteEmployeeFromStrapi(id) {
  return strapiRequest(`/employees/${id}`, { method: "DELETE" });
}

// ─── Commissions ──────────────────────────────────────────

export async function getCommissionsFromStrapi() {
  const payload = await strapiRequest(
    "/commissions?populate[employee][fields][0]=full_name&sort=createdAt:desc",
  );
  return (payload?.data || []).map(normalizeCommissionRecord);
}

export async function createCommissionInStrapi(data) {
  return strapiRequest("/commissions", {
    method: "POST",
    body: {
      data: {
        employee: data.employeeId,
        type: data.type || "invoice",
        reference: data.reference || "",
        amount: Number(data.amount || 0),
        date: data.date || new Date().toISOString().slice(0, 10),
        description: data.description || "",
      },
    },
  });
}

export async function deleteCommissionFromStrapi(id) {
  return strapiRequest(`/commissions/${id}`, { method: "DELETE" });
}

// ─── Payroll ──────────────────────────────────────────────

export async function getPayrollsFromStrapi() {
  const payload = await strapiRequest(
    "/payroll-records?populate[employee][fields][0]=full_name&sort=createdAt:desc",
  );
  return (payload?.data || []).map(normalizePayrollRecord);
}

export async function createPayrollInStrapi(data) {
  return strapiRequest("/payroll-records", {
    method: "POST",
    body: {
      data: {
        employee: data.employeeId,
        period: data.period || new Date().toISOString().slice(0, 7),
        base_salary: Number(data.baseSalary || 0),
        commission_total: Number(data.commissionTotal || 0),
        bonus: Number(data.bonus || 0),
        deduction: Number(data.deduction || 0),
        total_salary: Number(data.totalSalary || 0),
        date: data.date || new Date().toISOString().slice(0, 10),
        statuses: data.statuses || "paid",
        note: data.note || "",
      },
    },
  });
}

export async function deletePayrollFromStrapi(id) {
  return strapiRequest(`/payroll-records/${id}`, { method: "DELETE" });
}

// ─── Services ─────────────────────────────────────────────

export async function getServicesFromStrapi() {
  const payload = await strapiRequest(
    "/service-invoices?populate[customer][fields][0]=full_name&sort=createdAt:desc",
  );
  return (payload?.data || []).map(normalizeServiceRecord);
}

export async function createServiceInStrapi({
  customerName,
  serviceName,
  amount,
  note,
}) {
  const customerPayload = await strapiRequest("/customers", {
    method: "POST",
    body: { data: { full_name: customerName, phone: "-", notes: note || "" } },
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
        statuses: "pending",
      },
    },
  });
}

// ─── Settings ─────────────────────────────────────────────

export async function getSettingsFromStrapi() {
  try {
    const payload = await strapiRequest("/setting");
    return payload?.data?.attributes || null;
  } catch {
    return null;
  }
}

export async function updateSettingsInStrapi(data) {
  const existing = await getSettingsFromStrapi();
  if (existing) {
    return strapiRequest("/setting", {
      method: "PUT",
      body: { data },
    });
  }
  return strapiRequest("/setting", {
    method: "POST",
    body: { data },
  });
}
