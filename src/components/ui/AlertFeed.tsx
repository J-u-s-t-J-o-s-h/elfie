"use client";

import { cn } from "@/lib/utils";
import { Bell, ChevronRight, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";
import { Card } from "./Card";
import { useStorage } from "@/context/StorageContext";

export function AlertFeed() {
    const { alerts } = useStorage();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed top-20 right-0 z-40 p-3 bg-elf-panel border-l border-y border-gray-700 rounded-l-xl text-elf-neon-blue shadow-lg transition-transform duration-300",
                    isOpen ? "translate-x-80" : "translate-x-0"
                )}
            >
                {isOpen ? <ChevronRight size={24} /> : <Bell size={24} className="animate-pulse" />}
            </button>

            {/* Feed Panel */}
            <aside
                className={cn(
                    "fixed top-0 right-0 z-30 h-full w-80 bg-elf-dark/95 border-l border-gray-800 pt-20 px-4 transform transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Bell size={20} className="text-elf-neon-blue" />
                    System Alerts
                </h2>

                <div className="space-y-3 overflow-y-auto h-[calc(100vh-120px)] pb-20">
                    {alerts.map((alert) => (
                        <Card key={alert.id} className="bg-black/40 border-gray-800" noPadding>
                            <div className="p-3 flex gap-3 items-start">
                                <div className={cn(
                                    "mt-1 p-1 rounded-full",
                                    alert.type === "critical" ? "bg-red-500/20 text-red-500" :
                                        alert.type === "warning" ? "bg-yellow-500/20 text-yellow-500" :
                                            "bg-blue-500/20 text-blue-500"
                                )}>
                                    {alert.type === "critical" ? <AlertTriangle size={14} /> :
                                        alert.type === "warning" ? <AlertTriangle size={14} /> :
                                            <Info size={14} />}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-300 leading-tight">{alert.message}</p>
                                    <span className="text-xs text-gray-600 font-mono mt-1 block">{alert.time}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </aside>
        </>
    );
}
