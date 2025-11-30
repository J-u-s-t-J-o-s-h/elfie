"use client";

import { useStorage } from "@/context/StorageContext";
import { cn } from "@/lib/utils";
import { Shield, X } from "lucide-react";
import React from "react";

interface SecurityLevelModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LEVELS = [
    { id: "LOW", label: "SAFE", color: "text-green-500", bg: "bg-green-500/20", border: "border-green-500/50" },
    { id: "MEDIUM", label: "CAUTION", color: "text-yellow-500", bg: "bg-yellow-500/20", border: "border-yellow-500/50" },
    { id: "HIGH", label: "HIGH ALERT", color: "text-orange-500", bg: "bg-orange-500/20", border: "border-orange-500/50" },
    { id: "CRITICAL", label: "LOCKDOWN", color: "text-red-500", bg: "bg-red-500/20", border: "border-red-500/50" },
] as const;

export function SecurityLevelModal({ isOpen, onClose }: SecurityLevelModalProps) {
    const { securityLevel, setSecurityLevel } = useStorage();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-elf-panel border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Shield className="text-elf-neon-blue" />
                        Set Security Level
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {LEVELS.map((level) => (
                        <button
                            key={level.id}
                            onClick={() => {
                                setSecurityLevel(level.id);
                                onClose();
                            }}
                            className={cn(
                                "w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-200",
                                securityLevel === level.id
                                    ? `${level.bg} ${level.border} scale-[1.02]`
                                    : "bg-black/40 border-gray-800 hover:bg-gray-800"
                            )}
                        >
                            <span className={cn("font-bold tracking-wider", level.color)}>
                                {level.label}
                            </span>
                            {securityLevel === level.id && (
                                <div className={cn("w-3 h-3 rounded-full animate-pulse", level.color.replace("text-", "bg-"))} />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
