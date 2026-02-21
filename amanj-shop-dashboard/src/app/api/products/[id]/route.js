// src/app/api/products/[id]/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

async function getAuthToken() {
  try {
    const cookieToken = (await cookies()).get("strapi_jwt")?.value;
    if (cookieToken) return cookieToken;
  } catch (e) {
    // ignore
  }

  if (process.env.STRAPI_API_TOKEN) return process.env.STRAPI_API_TOKEN;
  return null;
}

export async function GET(request, { params }) {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }

  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ error: "No authentication token found" }, { status: 401 });
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/products/${id}?populate=deep`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { error: text || "Invalid response from Strapi" };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Failed to proxy product fetch" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }

  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ error: "No authentication token found" }, { status: 401 });
  }

  const body = await request.json();

  try {
    const res = await fetch(`${STRAPI_URL}/api/products/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { error: text || "Invalid response from Strapi" };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Failed to proxy product update" }, { status: 500 });
  }
}
