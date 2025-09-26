// src/app/api/logout/route.js
import { NextResponse } from "next/server";
import { serialize } from "cookie";

const COOKIE_NAME = process.env.STRAPI_COOKIE_NAME || "strapi_jwt";

export async function POST() {
  // To clear cookie, set maxAge=0 and empty value
  const cookie = serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", cookie);
  return res;
}
