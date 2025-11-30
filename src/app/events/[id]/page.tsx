"use client";

import { SideNav } from "@/components/ui/SideNav";
import { TopNav } from "@/components/ui/TopNav";
import { useStorage } from "@/context/StorageContext";
import { ChevronLeft, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import React from "react";

export default function EventDetailPage() {
    const params = useParams();
    const { events } = useStorage();

    // Wait for events to load or handle loading state if needed
    // For now, if events are empty (initial load), it might flash notFound
    // Ideally we check if loaded, but for skeleton this is fine.

    const id = params.id as string;
    const event = events.find((e) => e.id === id);

    if (!event && events.length > 0) {
        // Only show not found if we actually have data and still can't find it
        // Or we could show a loading state
        return (
            <div className="min-h-screen bg-elf-dark text-white flex items-center justify-center">
                <div className="text-elf-neon-blue animate-pulse">Searching Archives...</div>
            </div>
        )
    } else if (!event) {
        // If events are empty, we might be loading.
        // Let's just show loading for now to be safe
        return (
            <div className="min-h-screen bg-elf-dark text-white flex items-center justify-center">
                <div className="text-elf-neon-blue animate-pulse">Loading System...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-elf-dark text-white">
            <TopNav />
            <SideNav />

            <main className="pt-20 px-4 md:pl-72 md:pr-8 max-w-6xl mx-auto pb-20">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href="/events"
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{event.title}</h1>
                        <div className="flex gap-4 text-sm text-gray-400 font-mono mt-1">
                            <span>{event.date}</span>
                            <span>{event.time}</span>
                            <span>{event.duration}</span>
                        </div>
                    </div>
                </div>

                {/* Video Player */}
                <div className="aspect-video w-full bg-black rounded-xl border border-gray-800 relative overflow-hidden mb-8 group">
                    {event.videoUrl ? (
                        <video
                            src={event.videoUrl}
                            controls
                            className="w-full h-full object-contain"
                            autoPlay
                        />
                    ) : (
                        <>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-gray-600 font-mono">VIDEO PLAYBACK PLACEHOLDER</div>
                            </div>
                            <div className="absolute inset-0 pointer-events-none scanline-overlay opacity-20" />

                            {/* Controls Overlay (Only for placeholder) */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="h-1 bg-gray-700 rounded-full mb-4 overflow-hidden">
                                    <div className="h-full w-1/3 bg-elf-neon-blue" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-4">
                                        <button className="text-white hover:text-elf-neon-blue">Play</button>
                                        <button className="text-white hover:text-elf-neon-blue">Pause</button>
                                    </div>
                                    <div className="font-mono text-xs text-gray-400">00:15 / {event.duration}</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Details & Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-elf-panel p-6 rounded-xl border border-gray-700">
                            <h3 className="text-lg font-bold text-elf-neon-blue mb-2">Incident Report</h3>
                            <p className="text-gray-300 leading-relaxed">
                                {event.description}
                            </p>
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <h4 className="text-sm font-bold text-gray-400 mb-2">Detected Objects</h4>
                                <div className="flex gap-2 flex-wrap">
                                    <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">Elf (98%)</span>
                                    <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">Cookie (85%)</span>
                                    <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">Chimney (99%)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button className="w-full py-4 bg-elf-neon-blue text-black font-bold rounded-xl hover:bg-elf-neon-blue/90 transition-colors flex items-center justify-center gap-2">
                            <Download size={20} />
                            Download Report
                        </button>
                        <button className="w-full py-4 bg-elf-panel border border-gray-700 text-white font-bold rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                            <Share2 size={20} />
                            Share Footage
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
