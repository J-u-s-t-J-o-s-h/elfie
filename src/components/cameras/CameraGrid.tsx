"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { CameraFeed } from "./CameraFeed";
import { Modal } from "../ui/Modal";

// Placeholder type
interface Camera {
    id: number;
    name: string;
    status: "LIVE" | "RECORDED" | "OFFLINE";
    timestamp: string;
    motionDetected: boolean;
}

interface CameraGridProps {
    cameras: Camera[];
}

export function CameraGrid({ cameras }: CameraGridProps) {
    const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full p-4 pb-20 overflow-y-auto">
                {cameras.map((cam) => (
                    <div key={cam.id} className="aspect-video w-full">
                        <CameraFeed
                            {...cam}
                            className="w-full h-full"
                            onExpand={() => setSelectedCamera(cam)}
                        />
                    </div>
                ))}
            </div>

            <Modal
                isOpen={!!selectedCamera}
                onClose={() => setSelectedCamera(null)}
                title={selectedCamera?.name}
            >
                {selectedCamera && (
                    <div className="w-full h-full min-h-[60vh] flex flex-col">
                        <div className="flex-1 relative bg-black rounded-lg overflow-hidden">
                            <CameraFeed
                                {...selectedCamera}
                                className="absolute inset-0"
                                // Disable expand in modal
                                onExpand={undefined}
                            />
                        </div>
                        <div className="mt-4 flex justify-between items-center px-2">
                            <div className="text-sm text-gray-400 font-mono">
                                Camera ID: {selectedCamera.id}
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-elf-panel border border-gray-700 rounded hover:bg-elf-neon-blue/10 text-sm text-white transition-colors">
                                    Take Snapshot
                                </button>
                                <button className="px-4 py-2 bg-elf-panel border border-gray-700 rounded hover:bg-elf-neon-blue/10 text-sm text-white transition-colors">
                                    Report Incident
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}
