"use client";

import { SecurityLevelModal } from "@/components/admin/SecurityLevelModal";
import { Card } from "@/components/ui/Card";
import { TopNav } from "@/components/ui/TopNav";
import { useStorage } from "@/context/StorageContext";
import { Camera, FileVideo, Settings, Shield, Trash2, Upload, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function AdminPanelPage() {
    const router = useRouter();
    const { resetData, addEvent, addAlert } = useStorage();
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

    useEffect(() => {
        const isAuthorized = localStorage.getItem("adminAuthorized");
        if (!isAuthorized) {
            router.push("/admin");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("adminAuthorized");
        router.push("/dashboard");
    };

    const handleReset = () => {
        if (confirm("ARE YOU SURE? This will wipe all events and camera feeds.")) {
            resetData();
            alert("System reset complete.");
        }
    };

    const handleGenerateMagic = () => {
        const titles = ["Elf Sighting", "Reindeer Tracks", "Magic Dust Found", "Chimney Noise"];
        const title = titles[Math.floor(Math.random() * titles.length)];
        const now = new Date();

        addEvent({
            id: uuidv4(),
            date: now.toISOString().split("T")[0],
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: title,
            description: "Automatically generated magical anomaly detected by system sensors.",
            duration: "00:30",
            thumbnail: "/placeholder-event-1.jpg"
        });

        addAlert({
            id: uuidv4(),
            type: "info",
            message: `GENERATED: ${title}`,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        alert("Magic generated! Check the dashboard.");
    };

    const ACTIONS = [
        {
            icon: Upload,
            label: "Upload Footage",
            desc: "Add new nightly recordings",
            color: "text-blue-400",
            action: () => router.push("/admin/upload")
        },
        {
            icon: Wand2,
            label: "Generate Magic",
            desc: "Create AI elf events",
            color: "text-purple-400",
            action: handleGenerateMagic
        },
        {
            icon: Shield,
            label: "Security Level",
            desc: "Adjust sensitivity",
            color: "text-green-400",
            action: () => setIsSecurityModalOpen(true)
        },
        {
            icon: Camera,
            label: "Manage Cameras",
            desc: "Rename or disable feeds",
            color: "text-yellow-400",
            action: () => router.push("/admin/cameras")
        },
        { icon: FileVideo, label: "Archive", desc: "Manage storage", color: "text-orange-400" },
        {
            icon: Trash2,
            label: "Reset System",
            desc: "Clear all data",
            color: "text-red-400",
            action: handleReset
        },
    ];

    return (
        <div className="min-h-screen bg-elf-dark text-white">
            <TopNav />
            <SecurityLevelModal isOpen={isSecurityModalOpen} onClose={() => setIsSecurityModalOpen(false)} />

            <main className="pt-24 px-4 max-w-5xl mx-auto pb-20">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-elf-neon-blue">Parent Control Panel</h1>
                        <p className="text-gray-400 mt-1">Manage the magic behind the scenes.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                        Logout
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ACTIONS.map((action) => (
                        <Card
                            key={action.label}
                            className="group hover:border-elf-neon-blue/50 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                            onClick={action.action}
                        >
                            <div className="flex flex-col items-center text-center gap-4 py-4">
                                <div className={`p-4 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors ${action.color}`}>
                                    <action.icon size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">{action.label}</h3>
                                    <p className="text-sm text-gray-400">{action.desc}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-elf-panel rounded-xl border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Settings size={20} />
                        System Status
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                            <span className="text-gray-400">Storage Used</span>
                            <span className="font-mono text-elf-neon-blue">45% (12.4 GB)</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                            <span className="text-gray-400">Last Sync</span>
                            <span className="font-mono text-elf-neon-blue">Just now</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                            <span className="text-gray-400">Active Cameras</span>
                            <span className="font-mono text-elf-neon-blue">4 / 4</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
