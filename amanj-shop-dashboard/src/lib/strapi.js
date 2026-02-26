// src/lib/strapi.js
import { cookies } from "next/headers";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function getStrapiData(path) {

  const cookieStore = cookies();
  const token = cookieStore.get("strapi_jwt")?.value;

  if (!token) {
    console.error("No authentication token found for server-side request");
    return { data: null, error: "No authentication token found" };
  }

  try {
    const res = await fetch(`${STRAPI_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`Failed to fetch data from strapi: ${res.statusText}`);
      return { data: null, error: `Failed to fetch: ${res.statusText}` };
    }

    const data = await res.json();
    return data; // Return the full response
  } catch (error) {
    console.error("An error occurred in getStrapiData:", error);
    return { data: null, error: "Failed to fetch data from Strapi" };
  }
}
