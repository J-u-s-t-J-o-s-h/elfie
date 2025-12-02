"use client";

import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { Gift, Navigation, MapPin } from "lucide-react";

// Fallback locations with Lat/Lon
const FALLBACK_LOCATIONS = [
    { name: "North Pole (Prep Mode)", lat: 90, lon: 0 },
];

interface SantaData {
    location: string;
    next: string;
    presentsDelivered: number;
    distance: number;
    status: string;
    lat?: number;
    lon?: number;
}

export function SantaMap() {
    const divRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [santaData, setSantaData] = useState<SantaData | null>(null);
    const [isSimulated, setIsSimulated] = useState(false);

    // Simulation state
    const [simIndex, setSimIndex] = useState(0);
    const [simGifts, setSimGifts] = useState(0);
    const [simDistance, setSimDistance] = useState(0);

    // Current coordinates (either from API or Simulation)
    const currentLat = isSimulated ? FALLBACK_LOCATIONS[0].lat : (santaData?.lat || 90);
    const currentLon = isSimulated ? FALLBACK_LOCATIONS[0].lon : (santaData?.lon || 0);

    const fetchData = async () => {
        try {
            const res = await fetch("https://santa-api.appspot.com/info?client=web&language=en");
            if (!res.ok) throw new Error("API Error");
            const data = await res.json();

            if (data && data.presentsDelivered > 0) {
                setSantaData({
                    location: data.location || "Unknown",
                    next: data.next || "Unknown",
                    presentsDelivered: data.presentsDelivered,
                    distance: data.distance || 0,
                    status: "LIVE FEED",
                    lat: data.location?.lat, // Assuming API returns lat/lon in location object, otherwise fallback
                    lon: data.location?.lng
                });
                setIsSimulated(false);
            } else {
                throw new Error("API Inactive");
            }
        } catch (error) {
            setIsSimulated(true);
        }
    };

    useEffect(() => {
        fetchData();
        const apiInterval = setInterval(fetchData, 10000);

        // No movement simulation needed for North Pole static state

        // Maybe slowly increment cookies eaten? :) 
        // For now, let's keep it static as requested.

        return () => {
            clearInterval(apiInterval);
        };
    }, []);

    const phiRef = useRef(0);
    const pointerInteracting = useRef(false);
    const pointerCurrent = useRef(0);
    const [webglError, setWebglError] = useState(false);

    // Ref to store current location for the animation loop
    const locationRef = useRef([currentLat, currentLon]);

    // Update the ref whenever location changes
    useEffect(() => {
        locationRef.current = [currentLat, currentLon];
    }, [currentLat, currentLon]);

    useEffect(() => {
        let width = 0;
        let height = 0;

        const onResize = () => {
            if (divRef.current && canvasRef.current) {
                width = divRef.current.offsetWidth;
                height = divRef.current.offsetHeight;
            }
        }

        window.addEventListener('resize', onResize)
        onResize()

        if (!canvasRef.current) return;

        // Pre-check WebGL support to prevent crashes on mobile
        const gl = canvasRef.current.getContext('webgl') || canvasRef.current.getContext('experimental-webgl');
        if (!gl) {
            console.error("WebGL not supported");
            setWebglError(true);
            return;
        }

        let globe: any;

        try {
            globe = createGlobe(canvasRef.current, {
                devicePixelRatio: 2,
                width: width * 2 || 1000,
                height: height * 2 || 1000,
                phi: phiRef.current,
                theta: 0.3, // Tilt it slightly
                dark: 1,
                diffuse: 1.2,
                mapSamples: 20000, // More dots
                mapBrightness: 8, // Brighter
                baseColor: [0.02, 0.17, 0.13], // #022c22 (elf-dark)
                markerColor: [0.98, 0.75, 0.14], // #fbbf24 (elf-gold)
                glowColor: [0.28, 0.85, 0.42], // #4ade80 (elf-neon-green)
                markers: [
                    { location: [currentLat, currentLon], size: 0.1 }
                ],
                onRender: (state) => {
                    // Rotate globe smoothly if not interacting
                    if (!pointerInteracting.current) {
                        phiRef.current += 0.001;
                    }
                    state.phi = phiRef.current;

                    // Update markers dynamically from ref
                    state.markers = [{ location: locationRef.current as [number, number], size: 0.1 }];

                    // Update width/height on render to handle resize smoothly without destroying
                    if (divRef.current) {
                        state.width = divRef.current.offsetWidth * 2;
                        state.height = divRef.current.offsetHeight * 2;
                    }
                },
            });
        } catch (e) {
            console.error("WebGL Error:", e);
            setWebglError(true);
        }

        return () => {
            if (globe) globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, []); // Run only once on mount

    // Determine what to show
    const currentLocName = isSimulated ? FALLBACK_LOCATIONS[0].name : santaData?.location;
    const nextLocName = isSimulated ? "Preparing for Takeoff..." : santaData?.next;
    const gifts = isSimulated ? 0 : santaData?.presentsDelivered || 0;
    const distance = isSimulated ? 0 : santaData?.distance || 0;

    return (
        <div className="w-full h-full flex flex-col gap-4 md:gap-6 overflow-y-auto md:overflow-hidden">
            {/* Stats Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 shrink-0">
                <div className="bg-elf-panel/50 border border-elf-neon-green/20 p-3 md:p-4 rounded-2xl flex items-center gap-3 md:gap-4">
                    <div className="p-2 md:p-3 bg-elf-neon-green/10 rounded-full text-elf-neon-green shrink-0">
                        <MapPin size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            Current Location
                            {isSimulated && <span className="text-[8px] md:text-[10px] bg-gray-700 px-1 rounded text-gray-300">SIMULATION</span>}
                        </div>
                        <div className="text-lg md:text-xl font-bold text-white animate-pulse truncate">{currentLocName}</div>
                        <div className="text-[10px] md:text-xs text-elf-neon-blue truncate">Next: {nextLocName}</div>
                    </div>
                </div>

                <div className="bg-elf-panel/50 border border-elf-alert/20 p-3 md:p-4 rounded-2xl flex items-center gap-3 md:gap-4">
                    <div className="p-2 md:p-3 bg-elf-alert/10 rounded-full text-elf-alert shrink-0">
                        <Gift size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                        <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider">Gifts Delivered</div>
                        <div className="text-lg md:text-xl font-bold text-white font-mono">
                            {gifts.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="bg-elf-panel/50 border border-elf-gold/20 p-3 md:p-4 rounded-2xl flex items-center gap-3 md:gap-4">
                    <div className="p-2 md:p-3 bg-elf-gold/10 rounded-full text-elf-gold shrink-0">
                        <Navigation size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                        <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider">Distance (km)</div>
                        <div className="text-lg md:text-xl font-bold text-white font-mono">
                            {distance.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3D Globe Area */}
            <div ref={divRef} className="relative flex-1 min-h-[300px] bg-[#0f172a] rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50 flex items-center justify-center">
                {webglError ? (
                    <div className="w-full h-full flex items-center justify-center opacity-50">
                        <svg className="w-3/4 h-3/4 text-elf-neon-green/20" viewBox="0 0 100 100" fill="currentColor">
                            <circle cx="50" cy="50" r="45" />
                            <path d="M10,50 Q30,20 50,50 T90,50" stroke="currentColor" strokeWidth="2" fill="none" />
                            <circle cx="50" cy="10" r="2" className="text-elf-gold animate-pulse" fill="currentColor" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-elf-neon-green font-mono text-sm">2D SATELLITE LINK ESTABLISHED</p>
                        </div>
                    </div>
                ) : (
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full opacity-90 transition-opacity duration-1000 cursor-grab active:cursor-grabbing"
                        style={{ width: '100%', height: '100%', touchAction: 'none' }}
                        onPointerDown={(e) => {
                            pointerInteracting.current = true;
                            pointerCurrent.current = e.clientX;
                        }}
                        onPointerUp={() => {
                            pointerInteracting.current = false;
                        }}
                        onPointerOut={() => {
                            pointerInteracting.current = false;
                        }}
                        onPointerMove={(e) => {
                            if (pointerInteracting.current) {
                                const delta = e.clientX - pointerCurrent.current;
                                pointerCurrent.current = e.clientX;
                                phiRef.current += delta * 0.005;
                            }
                        }}
                    />
                )}

                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md p-3 rounded-xl border border-elf-neon-green/50 flex items-center gap-3 pointer-events-none">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <div>
                        <p className="text-elf-neon-green text-xs font-bold tracking-wider">LIVE SATELLITE FEED</p>
                        <p className="text-[10px] text-gray-400">Tracking ID: SANTA-01</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
