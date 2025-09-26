// src/app/api/login/route.js
import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const { jwt } = body;

  if (!jwt) {
    return NextResponse.json(
      { message: "JWT token not found" },
      { status: 400 }
    );
  }

  const cookie = serialize("strapi_jwt", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return new Response(JSON.stringify({ message: "Login successful" }), {
    status: 200,
    headers: { "Set-Cookie": cookie },
  });
}
