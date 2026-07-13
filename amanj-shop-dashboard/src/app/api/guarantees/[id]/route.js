import { NextResponse } from "next/server";

const STRAPI_URL = (
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

console.log('[GUARANTEE ROUTE] STRAPI_TOKEN:', STRAPI_TOKEN ? 'SET (' + STRAPI_TOKEN.slice(0, 10) + '...)' : 'NOT SET');

function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (STRAPI_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  }
  return headers;
}

function extractDataFromFormData(formData) {
  return {
    serialNumber: formData.get("serialNumber")?.toString().trim(),
    deviceName: formData.get("deviceName")?.toString().trim(),
    customerPhoneNumber: formData.get("customerPhoneNumber")?.toString().trim(),
    warrantyDuration: Number(formData.get("warrantyDuration")),
    warrantyType: formData.get("warrantyType")?.toString().trim(),
    startDate: formData.get("startDate")?.toString().trim(),
    endDate: formData.get("endDate")?.toString().trim(),
  };
}

async function parseRequest(req) {
  const contentType = req.headers.get('content-type') || '';
  console.log('[parseRequest] content-type:', contentType);
  if (contentType.includes('application/json')) {
    return await req.json();
  }
  return await req.formData();
}

async function handleUpdate(id, data, authHeaders) {
  const cleanData = { ...data };
  Object.keys(cleanData).forEach((k) => {
    if (!cleanData[k] && cleanData[k] !== 0) delete cleanData[k];
  });

  const res = await fetch(`${STRAPI_URL}/api/guarantees/${id}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({ data: cleanData }),
  });

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json(
      { message: "Failed to update guarantee", error: err },
      { status: 500 }
    );
  }

  const updated = await res.json();
  return NextResponse.json({
    message: "Guarantee updated successfully",
    data: updated,
  });
}

async function handleDelete(id, authHeaders) {
  const res = await fetch(`${STRAPI_URL}/api/guarantees/${id}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  if (!res.ok) {
    return NextResponse.json(
      { message: "Failed to delete guarantee" },
      { status: 500 }
    );
  }
  return NextResponse.json({ message: "Guarantee deleted successfully" });
}

export async function POST(req, { params }) {
  const authHeaders = getAuthHeaders();
  const { id } = await params;
  console.log('[POST] /api/guarantees/[id] - id:', id, 'method:', req.method, 'url:', req.url);

  const body = await parseRequest(req);
  let data, isDelete = false;

  if (body instanceof FormData) {
    data = extractDataFromFormData(body);
    isDelete = body.get("_method") === "DELETE";
  } else {
    data = body;
    isDelete = body._method === "DELETE";
  }

  console.log('[POST] isDelete:', isDelete, 'data keys:', Object.keys(data || {}));

  if (isDelete) {
    return handleDelete(id, authHeaders);
  }

  return handleUpdate(id, data, authHeaders);
}

export async function PUT(req, { params }) {
  try {
    const authHeaders = getAuthHeaders();
    const { id } = await params;
    console.log('[PUT] /api/guarantees/[id] - id:', id);

    const body = await parseRequest(req);
    let data;

    if (body instanceof FormData) {
      data = extractDataFromFormData(body);
    } else {
      data = body;
    }

    return handleUpdate(id, data, authHeaders);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const authHeaders = getAuthHeaders();
    const { id } = await params;
    console.log('[DELETE] /api/guarantees/[id] - id:', id);
    return handleDelete(id, authHeaders);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}