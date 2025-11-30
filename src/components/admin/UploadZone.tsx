"use client";

import { cn } from "@/lib/utils";
import { Upload, FileVideo } from "lucide-react";
import React, { useState, useRef } from "react";

interface UploadZoneProps {
    onFileSelect: (file: File) => void;
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                "w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group",
                isDragging
                    ? "border-elf-neon-blue bg-elf-neon-blue/10 scale-[1.02]"
                    : "border-gray-700 bg-elf-panel hover:border-gray-500 hover:bg-gray-800"
            )}
        >
            <input
                type="file"
                ref={inputRef}
                onChange={handleInputChange}
                accept="video/*,image/*"
                className="hidden"
            />

            <div className={cn(
                "p-6 rounded-full bg-gray-900 mb-4 transition-transform duration-300",
                isDragging ? "scale-110" : "group-hover:scale-110"
            )}>
                <Upload size={48} className={cn(
                    "transition-colors duration-300",
                    isDragging ? "text-elf-neon-blue" : "text-gray-400 group-hover:text-white"
                )} />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
                {isDragging ? "Drop Magic Here!" : "Upload Footage"}
            </h3>
            <p className="text-gray-400 text-center max-w-xs">
                Drag and drop your "caught" video file, or tap to browse.
            </p>
        </div>
    );
}
