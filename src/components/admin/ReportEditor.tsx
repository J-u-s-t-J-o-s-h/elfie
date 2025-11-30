"use client";

import { useStorage } from "@/context/StorageContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ReportEditorProps {
    file: File | null;
}

export function ReportEditor({ file }: ReportEditorProps) {
    const router = useRouter();
    const { addEvent, addAlert } = useStorage();

    const [title, setTitle] = useState("Suspicious Activity Detected");
    const [description, setDescription] = useState("Anomalous movement patterns identified near the chimney entry point.");
    const [isSaving, setIsSaving] = useState(false);

    const handlePublish = () => {
        setIsSaving(true);

        const newEventId = uuidv4();
        const now = new Date();

        // Create the event
        addEvent({
            id: newEventId,
            date: now.toISOString().split("T")[0],
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title,
            description,
            duration: "00:45", // Placeholder duration
            thumbnail: "/placeholder-event-1.jpg", // Placeholder thumbnail
            videoUrl: file ? URL.createObjectURL(file) : undefined
        });

        // Trigger a live alert
        addAlert({
            id: uuidv4(),
            type: "critical",
            message: `NEW INCIDENT: ${title}`,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        // Simulate network delay for "Publishing to Secure Server..."
        setTimeout(() => {
            router.push("/events");
        }, 1500);
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-elf-panel border border-gray-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Finalize Incident Report</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Event Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-elf-neon-blue focus:outline-none transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-elf-neon-blue focus:outline-none transition-colors resize-none"
                    />
                </div>

                <div className="pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold text-gray-400">AI Confidence Score</span>
                        <span className="text-elf-neon-green font-mono font-bold">98.4%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full w-[98%] bg-elf-neon-green" />
                    </div>
                </div>

                <button
                    onClick={handlePublish}
                    disabled={isSaving}
                    className="w-full py-4 bg-elf-neon-blue text-black font-bold rounded-xl hover:bg-elf-neon-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            Publishing to Secure Network...
                        </>
                    ) : (
                        "PUBLISH TO DASHBOARD"
                    )}
                </button>
            </div>
        </div>
    );
}
