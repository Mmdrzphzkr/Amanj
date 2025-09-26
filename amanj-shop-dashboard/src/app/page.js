// src/app/page.js
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function HomePage() {
  // 1. Check for the authentication cookie on the server
  const token = cookies().get("strapi_jwt")?.value;

  // 2. Decide where to redirect the user
  if (token) {
    // If the user has a token, they are logged in.
    // Send them to the main dashboard page.
    redirect("/dashboard");
  } else {
    // If there's no token, they are not logged in.
    // Send them to the login page.
    redirect("/login");
  }
}
