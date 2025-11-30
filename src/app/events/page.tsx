"use client";

import { EventList } from "@/components/events/EventList";
import { SideNav } from "@/components/ui/SideNav";
import { TopNav } from "@/components/ui/TopNav";
import { useStorage } from "@/context/StorageContext";

export default function EventsPage() {
    const { events } = useStorage();

    return (
        <div className="min-h-screen bg-elf-dark text-white">
            <TopNav />
            <SideNav />

            <main className="pt-20 px-4 md:pl-72 md:pr-8 max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-elf-neon-blue tracking-tight mb-2">
                        Recorded Events
                    </h1>
                    <p className="text-gray-400">
                        Archive of detected elf activity and anomalies.
                    </p>
                </header>

                <EventList events={events} />
            </main>
        </div>
    );
}
