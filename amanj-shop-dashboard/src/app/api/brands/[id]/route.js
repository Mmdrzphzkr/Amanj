import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

// Handles PUT requests to update a brand
export async function PUT(request, { params }) {
  const { id } = params;
  const token = cookies().get("strapi_jwt")?.value;
  if (!token) return new Response("Not authorized", { status: 401 });

  const body = await request.json();

  const res = await fetch(`${STRAPI_URL}/api/brands/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: body }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}

// Handles DELETE requests (optional, but good to have)
export async function DELETE(request, { params }) {
  const { id } = params;
  const token = cookies().get("strapi_jwt")?.value;
  if (!token) return new Response("Not authorized", { status: 401 });

  const res = await fetch(`${STRAPI_URL}/api/brands/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
