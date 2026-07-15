// src/app/api/products/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { validateProductInput } from "@/lib/validation";
import { rateLimit, getClientIp, getRateLimitHeaders } from "@/lib/rateLimit";

const STRAPI_URL = (
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
  ).replace(/\/+$/, "");

export async function POST(request) {
  // Rate limiting: 20 product creations per minute
  const clientIp = getClientIp(request);
  const rateLimitKey = `products:${clientIp}`;
  const { allowed, remaining, resetTime } = rateLimit(rateLimitKey, 20, 60000);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: getRateLimitHeaders(remaining, resetTime),
      }
    );
  }

  const token = (await cookies()).get("strapi_jwt")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "No authentication token found" },
      {
        status: 401,
        headers: getRateLimitHeaders(remaining, resetTime),
      }
    );
  }

  try {
    const body = await request.json();

    // Validate input
    const validation = validateProductInput(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        {
          status: 400,
          headers: getRateLimitHeaders(remaining, resetTime),
        }
      );
    }

    // Validate body size (1MB limit)
    const bodySize = JSON.stringify(body).length;
    if (bodySize > 1024 * 1024) {
      return NextResponse.json(
        { error: "Request body too large" },
        {
          status: 413,
          headers: getRateLimitHeaders(remaining, resetTime),
        }
      );
    }

    const res = await fetch(`${STRAPI_URL}/api/products`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: body }),
    });

    const data = await res.json();

    return NextResponse.json(data, {
      headers: getRateLimitHeaders(remaining, resetTime),
    });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: getRateLimitHeaders(remaining, resetTime),
      }
    );
  }
}
