"use client";

import { cn } from "@/lib/utils";
import { Home, Calendar, ShieldAlert, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Events", href: "/events", icon: Calendar },
    { label: "Admin", href: "/admin", icon: ShieldAlert },
];

export function SideNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-3 bg-elf-panel/80 backdrop-blur-md border border-gray-700 rounded-full text-white md:hidden shadow-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-full w-64 bg-elf-dark/95 border-r border-gray-800 transform transition-transform duration-300 ease-in-out pt-20 md:pt-4 md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full px-4">
                    <div className="mb-8 px-2 hidden md:block">
                        <h1 className="text-2xl font-bold text-elf-neon-blue tracking-tighter">
                            ELFCAM<span className="text-white text-sm ml-1 font-normal">SECURE</span>
                        </h1>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200 group",
                                        isActive
                                            ? "bg-elf-neon-blue/10 text-elf-neon-blue border border-elf-neon-blue/20 shadow-[0_0_15px_rgba(0,243,255,0.1)]"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <item.icon
                                        size={24}
                                        className={cn(
                                            "transition-transform group-hover:scale-110",
                                            isActive && "animate-pulse"
                                        )}
                                    />
                                    <span className="font-medium text-lg">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="py-8 border-t border-gray-800">
                        <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-400 transition-colors">
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
