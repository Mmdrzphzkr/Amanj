// src/app/api/upload/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function POST(request) {
  const token = cookies().get("strapi_jwt")?.value;
  if (!token) return new Response("Not authorized", { status: 401 });

  const formData = await request.formData();

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  return NextResponse.json(data);
}
