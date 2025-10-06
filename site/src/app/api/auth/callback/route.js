import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as client from "openid-client";
import { getOAuthConfig, setSession } from "@/lib/oauth";

export async function GET(request) {
    try {
        const config = await getOAuthConfig();
        const cookieStore = await cookies();

        // Get state, nonce, and code verifier from cookies
        const state = cookieStore.get("oauth_state")?.value;
        const nonce = cookieStore.get("oauth_nonce")?.value;
        const codeVerifier = cookieStore.get("oauth_code_verifier")?.value;

        if (!state || !nonce || !codeVerifier) {
            return NextResponse.json(
                { error: "Missing state, nonce, or code verifier" },
                { status: 400 }
            );
        }

        // Get the callback URL
        const currentUrl = new URL(request.url);

        // Exchange authorization code for tokens
        const tokens = await client.authorizationCodeGrant(
            config,
            currentUrl,
            {
                pkceCodeVerifier: codeVerifier,
                expectedState: state,
                expectedNonce: nonce,
            }
        );

        // Clear temporary cookies
        cookieStore.delete("oauth_state");
        cookieStore.delete("oauth_nonce");
        cookieStore.delete("oauth_code_verifier");

        // Store token set in session
        await setSession(tokens);

        // Redirect to app page
        return NextResponse.redirect(new URL("/app", request.url));
    } catch (error) {
        console.error("OAuth callback error:", error);
        return NextResponse.json(
            { error: "Authentication failed" },
            { status: 500 }
        );
    }
}