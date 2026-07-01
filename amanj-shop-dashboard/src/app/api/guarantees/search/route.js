//src/app/api/guarantee/search/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI_URL = (
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000"
  ).replace(/\/+$/, "");;

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const serialNumber = searchParams.get("serialNumber")?.trim();
        const phone = searchParams.get("phone")?.trim();

        if (!serialNumber || !phone) {
            return NextResponse.json(
                { message: "serialNumber and phone are required" },
                { status: 400 }
            );
        }

        const res = await fetch(
            `${STRAPI_URL}/api/guarantees?filters[serialNumber][$eq]=${serialNumber}&filters[customerPhoneNumber][$eq]=${phone}`,
            {
                 cache: "no-store"
            }
        );

        if (!res.ok) {
            return NextResponse.json(
                { message: "Failed to fetch guarantee" },
                { status: 500 }
            );
        }

        const json = await res.json();
        const item = json?.data?.[0];

        if (!item) {
            return NextResponse.json(
                { message: "Guarantee not found" },
                { status: 404 }
            );
        }

        const endDate = new Date(item.endDate);
        const now = new Date();

        const diffMs = endDate - now;
        const remainingDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

        return NextResponse.json({
            message: "Guarantee found",
            data: {
                ...item,
                remainingDays,
                isExpired: diffMs <= 0,
            },
        });
    } catch (error) {
        console.error("Guarantee search error:", error);
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}
