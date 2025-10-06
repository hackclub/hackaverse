import { NextResponse } from "next/server";
import { generateVerificationCode, saveVerificationCode } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request) {
    try {
        const { email } = await request.json();

        // Validate email
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email is required' },
                { status: 400 }
            );
        }

        // Generate code
        const code = generateVerificationCode();

        // Save code with expiry
        saveVerificationCode(email, code);

        // Send email
        const emailResult = await sendVerificationEmail(email, code);

        if (!emailResult.success) {
            return NextResponse.json(
                { error: 'Failed to send email' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Verification code sent to your email'
        });

    } catch (error) {
        console.error('Send code error:', error);
        return NextResponse.json(
            { error: 'Failed to send verification code' },
            { status: 500 }
        );
    }
}