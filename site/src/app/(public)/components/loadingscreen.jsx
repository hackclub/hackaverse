"use client"

import React, { useEffect } from 'react';

export default function SkeletonLoadingScreen({ onComplete }) {
    // Create a grid of skeleton items
    const skeletonItems = Array.from({ length: 140 }, (_, i) => i);

    // Calculate columns per row (adjust based on your grid)
    const columnsPerRow = 14; // xl:grid-cols-14

    const [fadeOut, setFadeOut] = React.useState(false);

    useEffect(() => {
        // Calculate the total animation time
        // Last item's diagonal index + animation delay per item + animation duration
        const lastItem = skeletonItems.length - 1;
        const lastRow = Math.floor(lastItem / columnsPerRow);
        const lastCol = lastItem % columnsPerRow;
        const maxDiagonalIndex = lastRow + lastCol;
        const fadeInTime = (maxDiagonalIndex * 0.04 + 0.5) * 1000; // Convert to milliseconds

        const fadeOutTimer = setTimeout(() => {
            setFadeOut(true);
        }, fadeInTime);

        const completeTimer = setTimeout(() => {
            if (onComplete) onComplete();
        }, fadeInTime + 500); // Add 500ms for fade out animation

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div className="min-h-screen w-full bg-black overflow-hidden">
            {/* Grid of animated logo placeholders */}
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 gap-6">
                {skeletonItems.map((item) => {
                    // Calculate row and column for diagonal wave
                    const row = Math.floor(item / columnsPerRow);
                    const col = item % columnsPerRow;
                    const diagonalIndex = row + col;

                    return (
                        <div
                            key={item}
                            className="opacity-0 animate-fadeIn"
                            style={{
                                animationDelay: `${diagonalIndex * 0.04}s`,
                                animationFillMode: 'forwards'
                            }}
                        >
                            {/* Alternating logos */}
                            <img
                                src={item % 2 === 0 ? "/Roblox_Tilt_Black.svg" : "https://assets.hackclub.com/icon-rounded.svg"}
                                alt={item % 2 === 0 ? "Roblox logo" : "Hack Club icon"}
                                className={`w-20 h-20 opacity-30 ${item % 2 !== 0 ? 'rotate-12' : ''} ${item % 2 === 0 ? 'invert' : ''}`}
                            />
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                        transform: scale(0);
                    }
                    50% {
                        opacity: 0.5;
                        transform: scale(1.1);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
            `}</style>
        </div>
    );
}