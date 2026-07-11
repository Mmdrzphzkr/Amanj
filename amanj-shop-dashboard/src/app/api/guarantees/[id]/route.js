import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI_URL = (
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000"
  ).replace(/\/+$/, "");

const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

async function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (STRAPI_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  } else {
    const cookieStore = cookies();
    const jwt = cookieStore.get("strapi_jwt")?.value;
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
  }
  return headers;
}

export async function POST(req, { params }) {
  const authHeaders = await getAuthHeaders();
  const { id } = params;
  const formData = await req.formData();
  const _method = formData.get("_method");

  if (_method === "DELETE") {
    const res = await fetch(`${STRAPI_URL}/api/guarantees/${id}`, {
      method: "DELETE", headers: authHeaders,
    });
    if (!res.ok) return NextResponse.json({ message: "Failed to delete guarantee" }, { status: 500 });
    return NextResponse.json({ message: "Guarantee deleted successfully" });
  }

  const payload = {
    data: {
      serialNumber: formData.get("serialNumber")?.toString().trim(),
      deviceName: formData.get("deviceName")?.toString().trim(),
      customerPhoneNumber: formData.get("customerPhoneNumber")?.toString().trim(),
      warrantyDuration: Number(formData.get("warrantyDuration")),
      warrantyType: formData.get("warrantyType")?.toString().trim(),
      startDate: formData.get("startDate")?.toString().trim(),
      endDate: formData.get("endDate")?.toString().trim(),
    },
  };

  Object.keys(payload.data).forEach((k) => {
    if (!payload.data[k] && payload.data[k] !== 0) delete payload.data[k];
  });

  const res = await fetch(`${STRAPI_URL}/api/guarantees/${id}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json({ message: "Failed to update guarantee", error: err }, { status: 500 });
  }

  const updated = await res.json();
  return NextResponse.json({ message: "Guarantee updated successfully", data: updated });
}

export async function PUT(req, { params }) {
  try {
    const headers = await getAuthHeaders();
    const { id } = params;
    const formData = await req.formData();

    const payload = {
      data: {
        serialNumber: formData.get("serialNumber")?.toString().trim(),
        deviceName: formData.get("deviceName")?.toString().trim(),
        customerPhoneNumber: formData.get("customerPhoneNumber")?.toString().trim(),
        warrantyDuration: Number(formData.get("warrantyDuration")),
        warrantyType: formData.get("warrantyType")?.toString().trim(),
        startDate: formData.get("startDate")?.toString().trim(),
        endDate: formData.get("endDate")?.toString().trim(),
      },
    };

    Object.keys(payload.data).forEach((k) => {
      if (!payload.data[k] && payload.data[k] !== 0) delete payload.data[k];
    });

    const res = await fetch(`${STRAPI_URL}/api/guarantees/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ message: "Failed to update guarantee", error: err }, { status: 500 });
    }

    const updated = await res.json();
    return NextResponse.json({ message: "Guarantee updated successfully", data: updated });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const headers = await getAuthHeaders();
    const { id } = params;

    const res = await fetch(`${STRAPI_URL}/api/guarantees/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      return NextResponse.json({ message: "Failed to delete guarantee" }, { status: 500 });
    }

    return NextResponse.json({ message: "Guarantee deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
