// Filename: src/app/dashboard/layout.js
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardLayoutClient from "@/components/DashboardLayoutClient";

export default async function DashboardLayout({ children }) {
  const cookieStore = cookies();
  const token = await cookieStore.get("strapi_jwt")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    // DashboardLayoutClient is a client component wrapping the DashboardShell
    <DashboardLayoutClient>{children}</DashboardLayoutClient>
  );
}

