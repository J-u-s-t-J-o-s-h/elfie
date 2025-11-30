"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import initialCameras from "@/data/fakeCameras.json";
import initialEvents from "@/data/fakeEvents.json";
import initialAlerts from "@/data/fakeAlerts.json";

// Types
export interface Camera {
    id: number;
    name: string;
    status: "LIVE" | "RECORDED" | "OFFLINE";
    timestamp: string;
    motionDetected: boolean;
    videoUrl?: string;
}

export interface Event {
    id: string;
    date: string;
    time: string;
    title: string;
    description: string;
    thumbnail?: string;
    videoUrl?: string;
    duration: string;
}

export interface Alert {
    id: string;
    type: "warning" | "info" | "critical";
    message: string;
    time: string;
}

interface StorageContextType {
    cameras: Camera[];
    events: Event[];
    alerts: Alert[];
    addEvent: (event: Event) => void;
    addAlert: (alert: Alert) => void;
    updateCameraStatus: (id: number, status: Camera["status"]) => void;
    updateCameraFeed: (id: number, videoUrl: string) => void;
    securityLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    setSecurityLevel: (level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL") => void;
    resetData: () => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: React.ReactNode }) {
    const [cameras, setCameras] = useState<Camera[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [securityLevel, setSecurityLevel] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("LOW");
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const loadData = () => {
            const storedCameras = localStorage.getItem("elfcam_cameras");
            const storedEvents = localStorage.getItem("elfcam_events");
            const storedAlerts = localStorage.getItem("elfcam_alerts");
            const storedSecurityLevel = localStorage.getItem("elfcam_security_level");

            if (storedCameras) {
                setCameras(JSON.parse(storedCameras));
            } else {
                setCameras(initialCameras as Camera[]);
            }

            if (storedEvents) {
                setEvents(JSON.parse(storedEvents));
            } else {
                setEvents(initialEvents as Event[]);
            }

            if (storedAlerts) {
                setAlerts(JSON.parse(storedAlerts));
            } else {
                setAlerts(initialAlerts as Alert[]);
            }

            if (storedSecurityLevel) {
                setSecurityLevel(storedSecurityLevel as any);
            }

            setIsLoaded(true);
        };

        loadData();
    }, []);

    // Save to localStorage whenever data changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("elfcam_cameras", JSON.stringify(cameras));
            localStorage.setItem("elfcam_events", JSON.stringify(events));
            localStorage.setItem("elfcam_alerts", JSON.stringify(alerts));
            localStorage.setItem("elfcam_security_level", securityLevel);
        }
    }, [cameras, events, alerts, securityLevel, isLoaded]);

    const addEvent = (event: Event) => {
        setEvents((prev) => [event, ...prev]);
    };

    const addAlert = (alert: Alert) => {
        setAlerts((prev) => [alert, ...prev]);
    };

    const updateCameraStatus = (id: number, status: Camera["status"]) => {
        setCameras((prev) =>
            prev.map((cam) => (cam.id === id ? { ...cam, status } : cam))
        );
    };

    const updateCameraFeed = (id: number, videoUrl: string) => {
        setCameras((prev) =>
            prev.map((cam) => (cam.id === id ? { ...cam, videoUrl } : cam))
        );
    };

    const resetData = () => {
        setCameras(initialCameras as Camera[]);
        setEvents(initialEvents as Event[]);
        setAlerts(initialAlerts as Alert[]);
        setSecurityLevel("LOW");
        localStorage.removeItem("elfcam_cameras");
        localStorage.removeItem("elfcam_events");
        localStorage.removeItem("elfcam_alerts");
        localStorage.removeItem("elfcam_security_level");
    };

    if (!isLoaded) {
        return null; // Or a loading spinner
    }

    return (
        <StorageContext.Provider
            value={{
                cameras,
                events,
                alerts,
                addEvent,
                addAlert,
                updateCameraStatus,
                updateCameraFeed,
                securityLevel,
                setSecurityLevel,
                resetData,
            }}
        >
            {children}
        </StorageContext.Provider>
    );
}

export function useStorage() {
    const context = useContext(StorageContext);
    if (context === undefined) {
        throw new Error("useStorage must be used within a StorageProvider");
    }
    return context;
}
