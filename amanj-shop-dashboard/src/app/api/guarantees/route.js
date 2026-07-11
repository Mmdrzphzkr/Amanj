import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI_URL = (
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000"
  ).replace(/\/+$/, "");

const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (STRAPI_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  }
  return headers;
}

function getUploadHeaders() {
  const headers = {};
  if (STRAPI_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  }
  return headers;
}

export async function GET() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${STRAPI_URL}/api/guarantees?populate=*&sort[0]=createdAt:desc`, { headers });
    if (!res.ok) {
      return NextResponse.json({ message: "Failed to fetch guarantees" }, { status: 500 });
    }
    const json = await res.json();
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authHeaders = await getAuthHeaders();
    const uploadHeaders = await getUploadHeaders();
    const formData = await req.formData();

    const serialNumber = formData.get("serialNumber")?.toString().trim();
    const deviceName = formData.get("deviceName")?.toString().trim();
    const customerPhoneNumber = formData.get("customerPhoneNumber")?.toString().trim();
    const warrantyDuration = Number(formData.get("warrantyDuration"));
    const warrantyType = formData.get("warrantyType")?.toString().trim();
    const startDate = formData.get("startDate")?.toString().trim();
    const endDate = formData.get("endDate")?.toString().trim();
    const deviceImage = formData.get("deviceImage");

    if (!serialNumber || !deviceName || !customerPhoneNumber || !warrantyDuration || !warrantyType) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (!["Normal", "VIP"].includes(warrantyType)) {
      return NextResponse.json({ message: "Invalid warranty type" }, { status: 400 });
    }

    const existsRes = await fetch(
      `${STRAPI_URL}/api/guarantees?filters[serialNumber][$eq]=${encodeURIComponent(serialNumber)}`,
      { headers: authHeaders, cache: "no-store" }
    );
    const existsJson = await existsRes.json();
    if (existsJson?.data?.length > 0) {
      return NextResponse.json({ message: "Serial number already exists" }, { status: 409 });
    }

    const effectiveStart = startDate || new Date().toISOString().slice(0, 10);
    const effectiveEnd = endDate || (() => {
      const d = new Date();
      d.setMonth(d.getMonth() + warrantyDuration);
      return d.toISOString().slice(0, 10);
    })();

    let uploadedImageId = null;

    if (deviceImage && typeof deviceImage === "object") {
      const uploadForm = new FormData();
      uploadForm.append("files", deviceImage);
      const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
        method: "POST",
        headers: uploadHeaders,
        body: uploadForm,
      });
      if (!uploadRes.ok) {
        return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
      }
      const uploadJson = await uploadRes.json();
      uploadedImageId = uploadJson?.[0]?.id || null;
    }

    const payload = {
      data: {
        serialNumber, deviceName, customerPhoneNumber,
        warrantyDuration, warrantyType,
        startDate: effectiveStart,
        endDate: effectiveEnd,
        ...(uploadedImageId ? { deviceImage: uploadedImageId } : {}),
      },
    };

    const createRes = await fetch(`${STRAPI_URL}/api/guarantees`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(payload),
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      return NextResponse.json({ message: "Failed to create guarantee", error: err }, { status: 500 });
    }

    const created = await createRes.json();
    return NextResponse.json({ message: "Guarantee created successfully", data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
