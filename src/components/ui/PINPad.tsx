"use client";

import { cn } from "@/lib/utils";
import { Delete } from "lucide-react";
import React, { useEffect, useState } from "react";

interface PINPadProps {
    onComplete: (pin: string) => void;
    length?: number;
}

export function PINPad({ onComplete, length = 4 }: PINPadProps) {
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);

    const handlePress = (num: string) => {
        if (pin.length < length) {
            const newPin = pin + num;
            setPin(newPin);
            if (newPin.length === length) {
                onComplete(newPin);
            }
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
        setError(false);
    };

    // Expose reset method via ref or just let parent handle state reset if needed
    // For now, simple internal state

    return (
        <div className="w-full max-w-sm mx-auto p-4">
            {/* Dots Display */}
            <div className="flex justify-center gap-4 mb-8">
                {Array.from({ length }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "w-4 h-4 rounded-full transition-all duration-200",
                            i < pin.length
                                ? "bg-elf-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.5)] scale-110"
                                : "bg-gray-700",
                            error && "bg-red-500 animate-shake"
                        )}
                    />
                ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                        key={num}
                        onClick={() => handlePress(num.toString())}
                        className="h-20 w-20 mx-auto rounded-full bg-elf-panel border border-gray-700 text-2xl font-bold text-white hover:bg-elf-neon-blue/20 hover:border-elf-neon-blue hover:text-elf-neon-blue transition-all active:scale-95 flex items-center justify-center"
                    >
                        {num}
                    </button>
                ))}
                <div /> {/* Spacer */}
                <button
                    onClick={() => handlePress("0")}
                    className="h-20 w-20 mx-auto rounded-full bg-elf-panel border border-gray-700 text-2xl font-bold text-white hover:bg-elf-neon-blue/20 hover:border-elf-neon-blue hover:text-elf-neon-blue transition-all active:scale-95 flex items-center justify-center"
                >
                    0
                </button>
                <button
                    onClick={handleDelete}
                    className="h-20 w-20 mx-auto rounded-full bg-transparent text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                >
                    <Delete size={32} />
                </button>
            </div>
        </div>
    );
}
