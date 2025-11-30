"use client";

import { PINPad } from "@/components/ui/PINPad";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AdminLoginPage() {
    const router = useRouter();

    useEffect(() => {
        // Clear auth on load
        localStorage.removeItem("adminAuthorized");
    }, []);

    const handlePinComplete = (pin: string) => {
        // Mock validation
        if (pin === "1234") {
            localStorage.setItem("adminAuthorized", "true");
            router.push("/admin/panel");
        } else {
            alert("Incorrect PIN");
            // Ideally reset PIN pad here, but for now alert is enough for skeleton
        }
    };

    return (
        <div className="min-h-screen bg-elf-dark flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-elf-neon-blue tracking-widest mb-2">
                        RESTRICTED ACCESS
                    </h1>
                    <p className="text-gray-500 font-mono text-sm">
                        ENTER PARENTAL OVERRIDE CODE
                    </p>
                </div>

                <div className="bg-elf-panel/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
                    <PINPad onComplete={handlePinComplete} />
                </div>

                <div className="text-center mt-8">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="text-gray-500 hover:text-white text-sm underline underline-offset-4"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
