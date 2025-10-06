"use client"

import { useState } from "react";
import LoadingScreen from "./components/loadingscreen";


export default function PublicLanding() {
    const [loadingComplete, setLoadingComplete] = useState(false);

    return (
        <main className="relative">
            <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 ${loadingComplete ? 'opacity-0' : 'opacity-100'}`}>
                <LoadingScreen onComplete={() => {
                    setLoadingComplete(true);
                }} />
            </div>
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

                    {/* Centered Content */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                        {/*
                          The h1 tag gets base styles from globals.css (font-size, weight, line-height, letter-spacing).
                          We only need to add responsive overrides for font-size and ensure it's centered.
                        */}
                        <div className="w-full max-w-6xl px-6">
                            <h1 className="text-4xl text-center md:text-6xl lg:text-7xl">
                                One platform.
                                <br />
                                Millions of ways to engage.
                            </h1>
                        </div>
                    </div>
                </section>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-in;
                }
            `}</style>
        </main>
    );
}