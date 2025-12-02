import { SantaMap } from "@/components/tracker/SantaMap";
import { TopNav } from "@/components/ui/TopNav";
import { SideNav } from "@/components/ui/SideNav";

export default function TrackerPage() {
    return (
        <div className="min-h-screen bg-elf-dark text-white font-sans selection:bg-elf-neon-green/30">
            <TopNav />
            <SideNav />

            <main className="pt-20 pl-4 md:pl-72 pr-4 pb-4 h-dvh flex flex-col">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white tracking-tight font-[family-name:var(--font-festive)]">
                        Global Santa Tracker
                    </h1>
                    <p className="text-gray-400">Real-time satellite feed from North Pole Command</p>
                </div>

                <div className="flex-1 min-h-0">
                    <SantaMap />
                </div>
            </main>
        </div>
    );
}
