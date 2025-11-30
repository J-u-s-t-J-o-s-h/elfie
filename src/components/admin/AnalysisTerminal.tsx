"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface AnalysisTerminalProps {
    onComplete: () => void;
}

const LOG_STEPS = [
    "Initializing ElfDetection Protocol v4.2...",
    "Scanning video frame buffer...",
    "Analyzing thermal signatures...",
    ">>> ANOMALY DETECTED AT FRAME 244",
    "Cross-referencing North Pole database...",
    "Decrypting magical residue...",
    "Triangulating cookie crumb trajectory...",
    "Enhancing image resolution (Magic Upscale)...",
    "Verifying naughty/nice status...",
    "ANALYSIS COMPLETE. CONFIDENCE: 98%"
];

export function AnalysisTerminal({ onComplete }: AnalysisTerminalProps) {
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep < LOG_STEPS.length) {
                setLogs((prev) => [...prev, LOG_STEPS[currentStep]]);
                setProgress(((currentStep + 1) / LOG_STEPS.length) * 100);
                currentStep++;
            } else {
                clearInterval(interval);
                setTimeout(onComplete, 1000); // Wait a bit after completion
            }
        }, 800); // Add a log every 800ms

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Visual Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-xs font-mono text-elf-neon-blue mb-2">
                    <span>PROCESSING...</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-elf-neon-blue transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Terminal Window */}
            <div className="bg-black border border-gray-800 rounded-lg p-6 font-mono text-sm h-80 overflow-y-auto shadow-[0_0_30px_rgba(0,243,255,0.1)] relative">
                <div className="absolute inset-0 pointer-events-none scanline-overlay opacity-20" />
                <div className="space-y-2 relative z-10">
                    {logs.map((log, i) => (
                        <div key={i} className="text-green-500 animate-in fade-in slide-in-from-left-2 duration-300">
                            <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                            {log && log.startsWith(">>>") ? (
                                <span className="text-elf-neon-blue font-bold animate-pulse">{log}</span>
                            ) : (
                                log
                            )}
                        </div>
                    ))}
                    <div className="animate-pulse text-green-500">_</div>
                </div>
            </div>
        </div>
    );
}
