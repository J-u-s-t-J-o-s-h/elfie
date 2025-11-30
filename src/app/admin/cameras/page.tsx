"use client";

import { TopNav } from "@/components/ui/TopNav";
import { useStorage } from "@/context/StorageContext";
import { ChevronLeft, Upload, Video } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";

export default function ManageCamerasPage() {
    const { cameras, updateCameraFeed } = useStorage();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const selectedCameraId = useRef<number | null>(null);

    const handleUploadClick = (id: number) => {
        selectedCameraId.current = id;
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && selectedCameraId.current !== null) {
            const videoUrl = URL.createObjectURL(file);
            updateCameraFeed(selectedCameraId.current, videoUrl);
            // Reset
            selectedCameraId.current = null;
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="min-h-screen bg-elf-dark text-white">
            <TopNav />

            <main className="pt-24 px-4 max-w-5xl mx-auto pb-20">
                {/* Header */}
                <div className="flex items-center gap-4 mb-12">
                    <Link
                        href="/admin/panel"
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-elf-neon-blue">
                            Manage Camera Feeds
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Upload video loops to simulate live camera feeds.
                        </p>
                    </div>
                </div>

                {/* Hidden Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="video/*"
                    className="hidden"
                />

                {/* Camera Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cameras.map((camera) => (
                        <div
                            key={camera.id}
                            className="bg-elf-panel border border-gray-700 rounded-xl overflow-hidden group hover:border-elf-neon-blue/50 transition-all duration-300"
                        >
                            {/* Preview Area */}
                            <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                                {camera.videoUrl ? (
                                    <video
                                        src={camera.videoUrl}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                ) : (
                                    <div className="text-gray-700 font-mono text-2xl opacity-20 select-none">
                                        NO SIGNAL
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => handleUploadClick(camera.id)}
                                        className="px-6 py-3 bg-elf-neon-blue text-black font-bold rounded-lg hover:scale-105 transition-transform flex items-center gap-2"
                                    >
                                        <Upload size={20} />
                                        Upload Loop
                                    </button>
                                </div>

                                <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-xs font-mono text-white">
                                    CAM-{String(camera.id).padStart(2, "0")}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-white">{camera.name}</h3>
                                    <p className="text-xs text-gray-400 font-mono mt-1">
                                        {camera.videoUrl ? "LIVE FEED ACTIVE" : "STATIC SIGNAL"}
                                    </p>
                                </div>
                                <div className={`w-3 h-3 rounded-full ${camera.videoUrl ? "bg-green-500 animate-pulse" : "bg-gray-600"}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
