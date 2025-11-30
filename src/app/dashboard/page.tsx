"use client";

import { AlertFeed } from "@/components/ui/AlertFeed";
import { SideNav } from "@/components/ui/SideNav";
import { TimelineBar } from "@/components/ui/TimelineBar";
import { TopNav } from "@/components/ui/TopNav";
import { CameraGrid } from "@/components/cameras/CameraGrid";
import { useStorage } from "@/context/StorageContext";

export default function DashboardPage() {
    const { cameras } = useStorage();

    return (
        <div className="min-h-screen bg-elf-dark text-white overflow-hidden">
            <TopNav />
            <SideNav />
            <AlertFeed />

            <main className="pt-16 md:pl-64 h-screen flex flex-col relative">
                <div className="flex-1 overflow-hidden relative">
                    <CameraGrid cameras={cameras} />
                </div>
                <TimelineBar />
            </main>
        </div>
    );
}
