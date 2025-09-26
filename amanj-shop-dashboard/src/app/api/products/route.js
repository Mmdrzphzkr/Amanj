// src/app/api/products/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function POST(request) {
  const token = (await cookies()).get("strapi_jwt")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "No authentication token found" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const res = await fetch(`${STRAPI_URL}/api/products`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return NextResponse.json(data);
}
