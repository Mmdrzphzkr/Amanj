// src/lib/strapi-frontend.js
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000";

export async function fetchStrapiData(path) {
  const url = `${STRAPI_URL}${path}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate data every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data; // Strapi nests data under a 'data' key
  } catch (error) {
    console.error("Error fetching from Strapi:", error);
    return null; // Return null on error
  }
}
