"use client";

import React, { useEffect, useState } from "react";

interface Snowflake {
    id: number;
    left: string;
    animationDuration: string;
    opacity: number;
    size: string;
}

export function Snow() {
    const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

    useEffect(() => {
        // Generate snowflakes on client side only to avoid hydration mismatch
        const flakes = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`, // 2-5s
            opacity: Math.random(),
            size: `${Math.random() * 0.5 + 0.2}rem`,
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute top-[-10%] bg-white rounded-full animate-fall"
                    style={{
                        left: flake.left,
                        width: flake.size,
                        height: flake.size,
                        opacity: flake.opacity,
                        animationDuration: flake.animationDuration,
                        animationDelay: `${Math.random() * 5}s`,
                    }}
                />
            ))}
        </div>
    );
}
