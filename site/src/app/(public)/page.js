"use client"

import { useState } from "react";
import LoadingScreen from "@/components/loading/LoadingScreen";
import LoginButton from "@/components/ui/LoginButton";
import EmailSignupForm from "@/components/auth/EmailSignupForm";


export default function PublicLanding() {
    const [loadingComplete, setLoadingComplete] = useState(false);

    return (
        <main className="relative">
            {!loadingComplete && (
                <LoadingScreen onComplete={() => {
                    setLoadingComplete(true);
                }} />
            )}
            {loadingComplete && (
                <div className="animate-fadeIn">
                <section className="relative h-screen overflow-hidden bg-black text-white">
                        {/* Background Video & Overlay */}
                        <div className="absolute inset-0 z-0">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="h-full w-full object-cover"
                                src="https://cdn.buttercms.com/7wYKj7iCQaGwcyosHdyq"
                            />
                            <div className="absolute inset-0 bg-black/75" />
                        </div>

                        {/* Bottom Left Content */}
                        <div className="absolute bottom-[145px] left-[72px] z-9">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl">
                                Hackverse
                                <br />
                                We ship user's + limited edition item's
                            </h1>

                            <EmailSignupForm />
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}