// src/app/api/login/route.js
import { serialize } from "cookie";
import { NextResponse } from "next/server";
import { rateLimit, getClientIp, getRateLimitHeaders } from "@/lib/rateLimit";
import { validateLoginInput } from "@/lib/validation";

export async function POST(request) {
  // Rate limiting: 5 attempts per minute
  const clientIp = getClientIp(request);
  const rateLimitKey = `login:${clientIp}`;
  const { allowed, remaining, resetTime } = rateLimit(rateLimitKey, 5, 60000);

  if (!allowed) {
    return NextResponse.json(
      { message: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: getRateLimitHeaders(remaining, resetTime),
      }
    );
  }

  try {
    const body = await request.json();
    const { jwt } = body;

    if (!jwt) {
      return NextResponse.json(
        { message: "JWT token not found" },
        {
          status: 400,
          headers: getRateLimitHeaders(remaining, resetTime),
        }
      );
    }

    const cookie = serialize("strapi_jwt", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return new Response(JSON.stringify({ message: "Login successful" }), {
      status: 200,
      headers: {
        "Set-Cookie": cookie,
        ...getRateLimitHeaders(remaining, resetTime),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request body" },
      {
        status: 400,
        headers: getRateLimitHeaders(remaining, resetTime),
      }
    );
  }
}
