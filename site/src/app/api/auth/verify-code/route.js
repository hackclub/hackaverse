import { NextResponse } from "next/server";
import { verifyCode, createUserSession } from "@/lib/auth";

export async function POST(request) {
    try {
        const { email, code } = await request.json();

        // Validate inputs
        if (!email || !code) {
            return NextResponse.json(
                { error: 'Email and code are required' },
                { status: 400 }
            );
        }

        // Verify the code
        const result = verifyCode(email, code);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        // Create session
        await createUserSession(email);

        return NextResponse.json({
            success: true,
            message: 'Successfully verified!'
        });

    } catch (error) {
        console.error('Verify code error:', error);
        return NextResponse.json(
            { error: 'Failed to verify code' },
            { status: 500 }
        );
    }
}