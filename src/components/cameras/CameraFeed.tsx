"use client";

import { cn } from "@/lib/utils";
import { Maximize2, Radio, Eye } from "lucide-react";
import React, { useState } from "react";

interface CameraFeedProps {
    id: string | number;
    name: string;
    status: "LIVE" | "RECORDED" | "OFFLINE";
    timestamp: string;
    motionDetected: boolean;
    videoUrl?: string;
    onExpand?: () => void;
    className?: string;
}

export function CameraFeed({
    id,
    name,
    status,
    timestamp,
    motionDetected,
    videoUrl,
    onExpand,
    className,
}: CameraFeedProps) {
    const [nightVision, setNightVision] = useState(false);

    return (
        <div
            className={cn(
                "relative bg-black rounded-lg overflow-hidden border border-gray-800 group cursor-pointer transition-all duration-300 hover:border-elf-neon-blue/50",
                className
            )}
            onClick={onExpand}
        >
            {/* Video Placeholder */}
            <div className={cn(
                "absolute inset-0 bg-gray-900 flex items-center justify-center transition-all duration-500",
                nightVision && "night-vision bg-green-900/20"
            )}>
                {videoUrl ? (
                    <video
                        src={videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                ) : (
                    <div className="text-gray-700 font-mono text-4xl opacity-20 select-none">
                        CAM-{String(id).padStart(2, "0")}
                    </div>
                )}

                {/* Static Noise Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none static-noise" />
                {/* Scanline Overlay */}
                <div className="absolute inset-0 pointer-events-none scanline-overlay opacity-30" />
            </div>

            {/* Offline State */}
            {status === "OFFLINE" && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-2">
                        <Radio size={48} className="text-red-500 animate-pulse" />
                        <span className="text-red-500 font-mono font-bold tracking-widest">SIGNAL LOST</span>
                    </div>
                </div>
            )}

            {/* Overlays */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between z-20 pointer-events-none">
                {/* Top Bar */}
                <div className="flex justify-between items-start">
                    <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-white border border-white/10">
                        {timestamp}
                    </div>
                    <div
                        className={cn(
                            "px-2 py-1 rounded text-xs font-bold tracking-wider flex items-center gap-2",
                            status === "LIVE" ? "bg-red-500 text-white animate-pulse" :
                                status === "RECORDED" ? "bg-blue-500/80 text-white" :
                                    "bg-gray-700 text-gray-400"
                        )}
                    >
                        {status === "LIVE" && <div className="w-2 h-2 bg-white rounded-full" />}
                        {status}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-white drop-shadow-md">{name}</span>
                        {motionDetected && (
                            <div className="flex items-center gap-1 text-elf-neon-green text-xs font-bold animate-pulse">
                                <div className="w-2 h-2 bg-elf-neon-green rounded-full" />
                                MOTION DETECTED
                            </div>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setNightVision(!nightVision);
                        }}
                        className={cn(
                            "p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-auto mr-2",
                            nightVision ? "bg-elf-neon-green text-black" : "bg-black/50 hover:bg-elf-neon-green hover:text-black"
                        )}
                        title="Toggle Night Vision"
                    >
                        <Eye size={16} />
                    </button>
                    <button className="p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto hover:bg-elf-neon-blue hover:text-black">
                        <Maximize2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
