// src/lib/strapi.js
import { cookies } from "next/headers";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function getStrapiData(path) {
  const token = await cookies().get("strapi_jwt")?.value;
  console.log("getStrapiData token:", token);
  if (!token) {
    console.error("No JWT token found in cookies");
    return { data: null, error: "No authentication token found" };
  }

  const res = await fetch(`${STRAPI_URL}${path}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch data from strapi:", res.statusText);
    return { data: null, error: `Failed to fetch: ${res.statusText}` };
  }

  return res.json();
}
