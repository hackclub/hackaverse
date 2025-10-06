'use client';

import { useState } from 'react';

export default function EmailSignupForm() {
    const [step, setStep] = useState('email'); // 'email' or 'code'
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/auth/send-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send code');
            }

            setMessage('Check your email for the code!');
            setStep('code');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Invalid code');
            }

            // Redirect to Roblox group
            window.location.href = 'https://www.roblox.com/communities/528718423';
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToEmail = () => {
        setStep('email');
        setCode('');
        setError('');
        setMessage('');
    };

    if (step === 'code') {
        return (
            <div className="mt-6 space-y-2">
                <p className="text-lg sm:text-xl text-white font-sans">
                    check {email} for your code
                </p>
                <form
                    className="flex items-center w-full max-w-sm sm:max-w-md p-1.5 bg-black/70 border-4 border-white rounded-full shadow-lg"
                    onSubmit={handleVerifyCode}
                >
                    <input
                        type="text"
                        placeholder="123456"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        required
                        className="flex-grow bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 px-4 text-sm sm:text-base font-sans tracking-widest"
                        aria-label="Verification code"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={loading || code.length !== 6}
                        className="bg-white text-black font-sans font-bold uppercase rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base hover:opacity-90 active:scale-95 transition-all whitespace-nowrap disabled:opacity-50"
                    >
                        {loading ? 'verifying...' : '← verify'}
                    </button>
                </form>
                {error && <p className="text-sm text-red-400 font-sans">{error}</p>}
                <button
                    onClick={handleBackToEmail}
                    className="text-sm text-white/70 font-sans hover:text-white underline"
                >
                    ← use different email
                </button>
            </div>
        );
    }

    return (
        <div className="mt-6 space-y-2">
            <p className="text-lg sm:text-xl text-white font-sans">
                RSVP for early access list
            </p>
            <form
                className="flex items-center w-full max-w-sm sm:max-w-md p-1.5 bg-black/70 border-4 border-white rounded-full shadow-lg"
                onSubmit={handleSendCode}
            >
                <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-grow bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 px-4 text-sm sm:text-base font-sans"
                    aria-label="Email for signup"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-white text-black font-sans font-bold uppercase rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base hover:opacity-90 active:scale-95 transition-all whitespace-nowrap disabled:opacity-50"
                >
                    {loading ? 'sending...' : '← RSVP'}
                </button>
            </form>
            {message && <p className="text-sm text-green-400 font-sans">{message}</p>}
            {error && <p className="text-sm text-red-400 font-sans">{error}</p>}
            <p className="text-sm text-white/70 font-sans">
                we promise not to spam you
            </p>
        </div>
    );
}