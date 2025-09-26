// src/app/api/products/[id]/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function PUT(request, { params }) {
  const [id] = params;
  const token = (await cookies()).get("strapi_jwt")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "No authentication token found" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const res = await fetch(`${STRAPI_URL}/api/products/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
