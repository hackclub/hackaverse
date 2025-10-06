import * as client from "openid-client";
import { cookies } from "next/headers";

let cachedConfig = null;

/**
 * Get or create the OpenID Connect configuration
 */
export async function getOAuthConfig() {
    if (cachedConfig) {
        return cachedConfig;
    }

    const clientId = process.env.ROBLOX_CLIENT_ID;
    const clientSecret = process.env.ROBLOX_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error("Missing ROBLOX_CLIENT_ID or ROBLOX_CLIENT_SECRET environment variables");
    }

    const server = new URL("https://apis.roblox.com/oauth/");

    const config = await client.discovery(
        server,
        clientId,
        clientSecret,
    );

    cachedConfig = config;
    return config;
}

/**
 * Get the redirect URI for OAuth callbacks
 */
export function getRedirectUri() {
    const port = process.env.PORT || 3000;
    const host = process.env.NEXT_PUBLIC_URL || `http://localhost:${port}`;
    return `${host}/oauth/callback`;
}

/**
 * Get the OAuth scope
 */
export function getScope() {
    return "openid profile";
}

/**
 * Get the current session from cookies
 */
export async function getSession() {
    const cookieStore = await cookies();
    const tokenSetCookie = cookieStore.get("tokenSet");

    if (!tokenSetCookie?.value) {
        return null;
    }

    try {
        return JSON.parse(tokenSetCookie.value);
    } catch {
        return null;
    }
}

/**
 * Set the session in cookies
 */
export async function setSession(tokenSet) {
    const cookieStore = await cookies();
    cookieStore.set("tokenSet", JSON.stringify(tokenSet), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
}

/**
 * Clear the session from cookies
 */
export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete("tokenSet");
}

/**
 * Get user info from the current session
 */
export async function getUserInfo() {
    const session = await getSession();

    if (!session?.access_token) {
        return null;
    }

    const config = await getOAuthConfig();

    try {
        const userinfoEndpoint = config.serverMetadata().userinfo_endpoint;
        if (!userinfoEndpoint) {
            throw new Error("Userinfo endpoint not found in server metadata");
        }

        const response = await client.fetchProtectedResource(
            config,
            session.access_token,
            new URL(userinfoEndpoint),
            "GET",
        );

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user info:", error);
        return null;
    }
}