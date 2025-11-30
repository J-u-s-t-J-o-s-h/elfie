"use client";

import { AnalysisTerminal } from "@/components/admin/AnalysisTerminal";
import { ReportEditor } from "@/components/admin/ReportEditor";
import { UploadZone } from "@/components/admin/UploadZone";
import { TopNav } from "@/components/ui/TopNav";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

type Step = "UPLOAD" | "ANALYSIS" | "EDITOR";

export default function UploadPage() {
    const [step, setStep] = useState<Step>("UPLOAD");
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setStep("ANALYSIS");
    };

    const handleAnalysisComplete = () => {
        setStep("EDITOR");
    };

    return (
        <div className="min-h-screen bg-elf-dark text-white">
            <TopNav />

            <main className="pt-24 px-4 max-w-4xl mx-auto pb-20">
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
                            Magic Injection Protocol
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Upload footage for AI analysis and dashboard integration.
                        </p>
                    </div>
                </div>

                {/* Steps */}
                <div className="relative min-h-[400px]">
                    {step === "UPLOAD" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <UploadZone onFileSelect={handleFileSelect} />
                        </div>
                    )}

                    {step === "ANALYSIS" && (
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                            <AnalysisTerminal onComplete={handleAnalysisComplete} />
                        </div>
                    )}

                    {step === "EDITOR" && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <ReportEditor file={file} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
