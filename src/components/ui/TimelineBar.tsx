"use client";

import { cn } from "@/lib/utils";
import React from "react";

export function TimelineBar() {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-elf-dark/90 backdrop-blur-md border-t border-gray-800 flex items-center px-4 md:pl-72 z-30">
            <div className="w-full h-12 relative flex items-center">
                {/* Track */}
                <div className="absolute inset-x-0 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-[30%] bg-elf-neon-blue/20" />
                </div>

                {/* Scrubber */}
                <div className="absolute left-[30%] top-1/2 -translate-y-1/2 w-4 h-8 bg-elf-neon-blue rounded-full shadow-[0_0_15px_rgba(0,243,255,0.5)] cursor-grab active:cursor-grabbing" />

                {/* Time Markers */}
                <div className="absolute inset-x-0 top-8 flex justify-between text-[10px] font-mono text-gray-500 select-none">
                    <span>20:00</span>
                    <span>21:00</span>
                    <span>22:00</span>
                    <span>23:00</span>
                    <span>00:00</span>
                    <span>01:00</span>
                    <span>02:00</span>
                    <span>03:00</span>
                    <span>04:00</span>
                </div>
            </div>
        </div>
    );
}
