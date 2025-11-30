"use client";

import React from "react";
import { EventCard } from "./EventCard";

interface Event {
    id: string;
    date: string;
    time: string;
    title: string;
    description: string;
    thumbnail?: string;
    duration: string;
}

interface EventListProps {
    events: Event[];
}

export function EventList({ events }: EventListProps) {
    return (
        <div className="space-y-4 pb-20">
            {events.map((event) => (
                <EventCard key={event.id} {...event} />
            ))}
        </div>
    );
}
