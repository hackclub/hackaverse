import { NextResponse } from "next/server";
import { clearSession } from "@/lib/oauth";

export async function GET(request) {
    try {
        // Clear the session
        await clearSession();

        // Redirect to home page
        return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Failed to logout" },
            { status: 500 }
        );
    }
}