import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI_URL = "http://localhost:8000"

export async function POST(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("strapi_jwt")?.value;
    const formData = await req.formData();

    const serialNumber = formData.get("serialNumber")?.toString().trim();
    const deviceName = formData.get("deviceName")?.toString().trim();
    const customerPhoneNumber = formData.get("customerPhoneNumber")?.toString().trim();
    const warrantyDuration = Number(formData.get("warrantyDuration"));
    const warrantyType = formData.get("warrantyType")?.toString().trim();
    const deviceImage = formData.get("deviceImage");

    if (!serialNumber || !deviceName || !customerPhoneNumber || !warrantyDuration || !warrantyType) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["Normal", "VIP"].includes(warrantyType)) {
      return NextResponse.json(
        { message: "Invalid warranty type" },
        { status: 400 }
      );
    }

    // 1) check duplicate serial
    const existsRes = await fetch(
      `${STRAPI_URL}/api/guarantees?filters[serialNumber][$eq]=${encodeURIComponent(serialNumber)}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }, cache: "no-store"
      }
    );

    const existsJson = await existsRes.json();
    if (existsJson?.data?.length > 0) {
      return NextResponse.json(
        { message: "Serial number already exists" },
        { status: 409 }
      );
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + warrantyDuration);

    let uploadedImageId = null;

    // 2) upload image if exists
    if (deviceImage && typeof deviceImage === "object") {
      const uploadForm = new FormData();
      uploadForm.append("files", deviceImage);

      const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: uploadForm,
      });

      if (!uploadRes.ok) {
        return NextResponse.json(
          { message: "Image upload failed" },
          { status: 500 }
        );
      }

      const uploadJson = await uploadRes.json();
      uploadedImageId = uploadJson?.[0]?.id || null;
    }

    const payload = {
      data: {
        serialNumber,
        deviceName,
        customerPhoneNumber,
        warrantyDuration,
        warrantyType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),

        ...(uploadedImageId ? { deviceImage: uploadedImageId } : {}),
      },
    };

    const createRes = await fetch(`${STRAPI_URL}/api/guarantees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      return NextResponse.json(
        { message: "Failed to create guarantee", error: err },
        { status: 500 }
      );
    }

    const created = await createRes.json();

    return NextResponse.json(
      {
        message: "Guarantee created successfully",
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Guarantees POST error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
