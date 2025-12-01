
"use client";

import { cn } from "@/lib/utils";
import { Mic, MicOff, Phone, PhoneOff, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface SantaCallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type CallStatus = "IDLE" | "LISTENING" | "THINKING" | "SPEAKING";

const SILENT_AUDIO = "data:audio/wav;base64,UklGRigAAABXQVZFfm00IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

export function SantaCallModal({ isOpen, onClose }: SantaCallModalProps) {
    const [status, setStatus] = useState<CallStatus>("IDLE");
    const [transcript, setTranscript] = useState("");
    const [santaText, setSantaText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
        console.log(msg);
    };

    const recognitionRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.lang = "en-US";

                recognitionRef.current.onstart = () => {
                    addLog("Recognition started");
                    setStatus("LISTENING");
                    setError(null);
                };

                recognitionRef.current.onresult = (event: any) => {
                    const text = event.results[0][0].transcript;
                    addLog(`Recognition result: ${text}`);
                    setTranscript(text);
                    handleUserMessage(text);
                };

                recognitionRef.current.onerror = (event: any) => {
                    addLog(`Recognition error: ${event.error}`);
                    console.error("Speech recognition error", event.error);
                    setStatus("IDLE");
                    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
                        setError("Microphone access denied. Please allow access in settings.");
                    } else {
                        setError("Microphone error. Please try again.");
                    }
                };

                recognitionRef.current.onend = () => {
                    addLog("Recognition ended");
                    if (status === "LISTENING") {
                        setStatus("IDLE");
                    }
                };
            } else {
                addLog("SpeechRecognition not supported");
                setError("Voice chat not supported in this browser.");
            }
        }
    }, []);

    const startListening = () => {
        addLog("startListening called");
        // Unlock audio for iOS/Mobile by playing silent sound on user interaction
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
        audioRef.current.src = SILENT_AUDIO;
        audioRef.current.play()
            .then(() => addLog("Audio unlocked successfully"))
            .catch(e => addLog(`Audio unlock failed: ${e.message}`));

        if (recognitionRef.current && status === "IDLE") {
            try {
                recognitionRef.current.start();
            } catch (e: any) {
                addLog(`Start recognition failed: ${e.message}`);
                console.error(e);
            }
        }
    };

    const stopListening = () => {
        addLog("stopListening called");
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setStatus("IDLE");
        }
    };

    const handleUserMessage = async (text: string) => {
        setStatus("THINKING");
        addLog("Sending API request...");

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

            const response = await fetch("/api/santa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            addLog(`API Response status: ${response.status}`);

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "API Error");
            }

            // Get text from header
            const santaResponseText = response.headers.get("X-Santa-Text") || "...";
            setSantaText(santaResponseText);
            addLog(`Santa says: ${santaResponseText}`);

            // Get audio as blob
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            addLog("Playing audio stream...");
            playAudio(audioUrl);

        } catch (err: any) {
            addLog(`API Error: ${err.message}`);
            console.error(err);
            setError("Santa is having trouble hearing you.");
            setStatus("IDLE");
        }
    };

    const playAudio = (audioUrl: string) => {
        setStatus("SPEAKING");

        if (!audioRef.current) {
            audioRef.current = new Audio();
        }

        const audio = audioRef.current;
        audio.src = audioUrl;

        audio.onended = () => {
            addLog("Audio playback ended");
            setStatus("IDLE");
            URL.revokeObjectURL(audioUrl); // Cleanup
        };

        audio.play()
            .then(() => addLog("Audio playback started"))
            .catch(e => addLog(`Audio playback error: ${e.message}`));
    };

    const handleClose = () => {
        stopListening();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-md bg-elf-panel border border-red-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center p-8 gap-8">

                {/* Close Button */}
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="text-center">
                    <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-xs font-bold tracking-widest mb-4 animate-pulse">
                        SECURE LINE: NORTH POLE
                    </div>
                    <h2 className="text-2xl font-bold text-white">Talking to Santa</h2>
                </div>

                {/* Visualizer / Avatar */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Rings */}
                    <div className={cn(
                        "absolute inset-0 border-2 border-red-500/20 rounded-full transition-all duration-1000",
                        status === "SPEAKING" ? "animate-ping opacity-50" : "scale-100"
                    )} />
                    <div className={cn(
                        "absolute inset-4 border-2 border-red-500/40 rounded-full transition-all duration-1000 delay-100",
                        status === "SPEAKING" ? "animate-ping opacity-50" : "scale-100"
                    )} />

                    {/* Center Icon */}
                    <div className={cn(
                        "w-32 h-32 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-transform duration-300",
                        status === "SPEAKING" ? "scale-110" : "scale-100"
                    )}>
                        <Phone size={48} className="text-white" />
                    </div>
                </div>

                {/* Status Text */}
                <div className="h-16 text-center flex flex-col justify-center">
                    {status === "LISTENING" && <p className="text-elf-neon-blue font-mono animate-pulse">Listening...</p>}
                    {status === "THINKING" && <p className="text-yellow-400 font-mono animate-bounce">Consulting the Nice List...</p>}
                    {status === "SPEAKING" && <p className="text-green-400 font-mono">Santa is speaking...</p>}
                    {status === "IDLE" && !error && <p className="text-gray-400">Tap the mic to speak</p>}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>

                {/* Transcript (Optional) */}
                {transcript && (
                    <div className="text-center text-sm text-gray-500 italic max-w-xs">
                        "{transcript}"
                    </div>
                )}

                {/* Controls */}
                <div className="flex gap-4">
                    <button
                        onClick={status === "LISTENING" ? stopListening : startListening}
                        className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg",
                            status === "LISTENING"
                                ? "bg-red-500 text-white hover:bg-red-600 scale-110"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                        )}
                    >
                        {status === "LISTENING" ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>

                    <button
                        onClick={handleClose}
                        className="w-16 h-16 rounded-full bg-gray-800 text-red-500 hover:bg-red-500/10 border border-gray-700 hover:border-red-500/50 flex items-center justify-center transition-all duration-200"
                    >
                        <PhoneOff size={24} />
                    </button>
                </div>

                {/* Debug Logs */}
                <details className="w-full mt-4 border-t border-gray-800 pt-4">
                    <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300">Debug Logs</summary>
                    <div className="h-32 overflow-y-auto bg-black/50 p-2 rounded text-[10px] font-mono text-green-400 mt-2">
                        {logs.map((log, i) => (
                            <div key={i}>{log}</div>
                        ))}
                    </div>
                </details>

            </div>
        </div>
    );
}

