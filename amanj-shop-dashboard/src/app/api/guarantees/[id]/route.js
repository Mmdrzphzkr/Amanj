import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI_URL = (
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000"
  ).replace(/\/+$/, "");

async function getToken() {
  const cookieStore = cookies();
  return cookieStore.get("strapi_jwt")?.value;
}

export async function PUT(req, { params }) {
  try {
    const token = await getToken();
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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
    const token = await getToken();
    const { id } = params;

    const res = await fetch(`${STRAPI_URL}/api/guarantees/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ message: "Failed to delete guarantee" }, { status: 500 });
    }

    return NextResponse.json({ message: "Guarantee deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
