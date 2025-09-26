// src/app/api/me/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function GET(request) {
  console.log("--- Handling request in /api/me ---");

  // --- THE FIX IS HERE 👇 ---
  const cookieStore = cookies();
  const token = cookieStore.get("strapi_jwt")?.value;

  if (!token) {
    console.log("No token found in cookies.");
    return NextResponse.json({ user: null });
  }

  console.log("Found token, proceeding to fetch user from Strapi.");

  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`Strapi response status: ${res.status}`);

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Strapi returned an error:", errorBody);
      return NextResponse.json({ user: null });
    }

    const user = await res.json();
    console.log("Successfully fetched user:", user);
    return NextResponse.json({ user });
  } catch (error) {
    console.error("An error occurred while fetching from Strapi:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
