import { cookies } from "next/headers";

/**
 * Generate a random 6-digit verification code
 */
export function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store verification code in memory (replace with database in production)
 * In production, use Redis or a database table with expiry
 */
const verificationCodes = new Map();

/**
 * Save verification code with expiry (5 minutes)
 */
export function saveVerificationCode(email, code) {
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    verificationCodes.set(email.toLowerCase(), {
        code,
        expiresAt,
        attempts: 0
    });
}

/**
 * Verify code and check if it's valid
 */
export function verifyCode(email, code) {
    const stored = verificationCodes.get(email.toLowerCase());

    if (!stored) {
        return { success: false, error: 'No code found for this email' };
    }

    if (Date.now() > stored.expiresAt) {
        verificationCodes.delete(email.toLowerCase());
        return { success: false, error: 'Code expired' };
    }

    if (stored.attempts >= 3) {
        verificationCodes.delete(email.toLowerCase());
        return { success: false, error: 'Too many attempts' };
    }

    if (stored.code !== code) {
        stored.attempts++;
        return { success: false, error: 'Invalid code' };
    }

    // Success! Clean up the code
    verificationCodes.delete(email.toLowerCase());
    return { success: true };
}

/**
 * Create a session for authenticated user
 */
export async function createUserSession(email) {
    const cookieStore = await cookies();
    const session = {
        email,
        createdAt: Date.now()
    };

    cookieStore.set("user_session", JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
    });
}

/**
 * Get current user session
 */
export async function getUserSession() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");

    if (!sessionCookie?.value) {
        return null;
    }

    try {
        return JSON.parse(sessionCookie.value);
    } catch {
        return null;
    }
}

/**
 * Clear user session
 */
export async function clearUserSession() {
    const cookieStore = await cookies();
    cookieStore.delete("user_session");
}