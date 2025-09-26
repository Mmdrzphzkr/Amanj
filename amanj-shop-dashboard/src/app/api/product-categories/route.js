// src/app/api/product-categories/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function POST(request) {
  const cookieStore = cookies();
  const token = cookieStore.get("strapi_jwt")?.value;
  if (!token) return new Response("Not authorized", { status: 401 });

  const body = await request.json();

  const res = await fetch(`${STRAPI_URL}/api/product-categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: body }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
