"use client";

import { Card } from "@/components/ui/Card";
import { Calendar, Clock, PlayCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

interface EventCardProps {
    id: string;
    date: string;
    time: string;
    title: string;
    description: string;
    thumbnail?: string;
    duration: string;
}

export function EventCard({
    id,
    date,
    time,
    title,
    description,
    thumbnail,
    duration,
}: EventCardProps) {
    return (
        <Link href={`/events/${id}`}>
            <Card className="group hover:border-elf-neon-blue/50 transition-all duration-300 cursor-pointer overflow-hidden bg-black/40">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-full md:w-48 aspect-video bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/30 transition-colors">
                            <PlayCircle size={48} className="text-white/50 group-hover:text-elf-neon-blue transition-colors" />
                        </div>
                        {/* Placeholder for actual image */}
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-xs font-mono text-white rounded">
                            {duration}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 py-2">
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-2 font-mono">
                            <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>{date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{time}</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-elf-neon-blue transition-colors">
                            {title}
                        </h3>
                        <p className="text-gray-400 line-clamp-2">{description}</p>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
