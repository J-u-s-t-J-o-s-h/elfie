import { SantaCallModal } from "@/components/santa/SantaCallModal";
import { useStorage } from "@/context/StorageContext";
import { Bell, Phone } from "lucide-react";
import React, { useState } from "react";

export function TopNav() {
    const { securityLevel } = useStorage();
    const [isCallModalOpen, setIsCallModalOpen] = useState(false);

    const getLevelColor = (level: string) => {
        switch (level) {
            case "CRITICAL": return "text-red-500 bg-red-500/10 border-red-500/20";
            case "HIGH": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
            case "MEDIUM": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
            default: return "text-green-500 bg-green-500/10 border-green-500/20";
        }
    };

    const colorClass = getLevelColor(securityLevel);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-elf-dark/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 md:pl-72 md:pr-8">
                <div className="flex items-center gap-2 md:hidden pl-12">
                    <span className="text-xl font-bold text-elf-neon-blue tracking-tighter">ELFCAM</span>
                </div>

                <div className="flex-1 flex justify-end items-center gap-4">
                    {/* Call Santa Button */}
                    <button
                        onClick={() => setIsCallModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full transition-colors shadow-lg shadow-red-900/20"
                    >
                        <Phone size={16} />
                        <span className="hidden sm:inline font-bold text-sm">Call Santa</span>
                    </button>

                    <div className={`hidden md:flex items-center gap-2 px-3 py-1 border rounded-full ${colorClass}`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${securityLevel === "CRITICAL" ? "bg-red-500" : securityLevel === "HIGH" ? "bg-orange-500" : securityLevel === "MEDIUM" ? "bg-yellow-500" : "bg-green-500"}`} />
                        <span className="text-xs font-bold tracking-wider">DEFCON: {securityLevel}</span>
                    </div>

                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-mono text-gray-400">2025-12-24</div>
                        <div className="text-xs font-mono text-gray-600">23:42:15 UTC</div>
                    </div>
                </div>
            </header>

            <SantaCallModal isOpen={isCallModalOpen} onClose={() => setIsCallModalOpen(false)} />
        </>
    );
}
