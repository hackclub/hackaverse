import { NextResponse } from "next/server";
import * as client from "openid-client";
import { cookies } from "next/headers";
import { getOAuthConfig, getRedirectUri, getScope } from "@/lib/oauth";

export async function GET() {
    try {
        const config = await getOAuthConfig();

        // Generate PKCE code verifier and challenge
        const codeVerifier = client.randomPKCECodeVerifier();
        const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
        const state = client.randomState();
        const nonce = client.randomNonce();

        // Store state, nonce, and code verifier in cookies for verification in callback
        const cookieStore = await cookies();
        cookieStore.set("oauth_state", state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 600, // 10 minutes
            path: "/",
        });
        cookieStore.set("oauth_nonce", nonce, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 600, // 10 minutes
            path: "/",
        });
        cookieStore.set("oauth_code_verifier", codeVerifier, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 600, // 10 minutes
            path: "/",
        });

        const authorizationUrl = client.buildAuthorizationUrl(config, {
            redirect_uri: getRedirectUri(),
            scope: getScope(),
            state,
            nonce,
            code_challenge: codeChallenge,
            code_challenge_method: "S256",
        });

        return NextResponse.redirect(authorizationUrl);
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Failed to initiate login" },
            { status: 500 }
        );
    }
}