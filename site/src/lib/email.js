import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email, code) {
    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  SMTP not configured - logging to console');
        console.log('📧 VERIFICATION CODE FOR:', email);
        console.log('🔢 CODE:', code);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        return { success: true };
    }

    // Send email using nodemailer
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM || 'Hackverse <dhamari@hackclub.com>',
            to: email,
            subject: 'Your verification code',
            text: `Hi,

Your verification code is: ${code}

This code will expire in 5 minutes.

If you didn't request this, you can safely ignore this email.

- Hackverse`
        });

        console.log('✅ Email sent successfully to:', email);
        return { success: true };
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        return { success: false, error: error.message };
    }
}