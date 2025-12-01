import { NextResponse } from "next/server";

// Mock response for when keys are missing
const MOCK_AUDIO_BASE64 = "SUQzBAAAAAABAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAZGFzaABUWFhYAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzbzZtcDQxAFRTU0UAAAAPAAADTGF2ZjU3LjU2LjEwMAAAAAAAAAAAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWgAAAA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="; // Silent MP3 with ID3

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        const hfToken = process.env.HUGGINGFACE_API_KEY;
        const liquidKey = process.env.LIQUID_API_KEY;
        const apiKey = hfToken || liquidKey;

        // 1. MOCK MODE (if no keys)
        if (!apiKey) {
            console.log("Missing API keys, using Mock Mode");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const audioBuffer = Buffer.from(MOCK_AUDIO_BASE64, 'base64');
            return new NextResponse(audioBuffer, {
                headers: {
                    "Content-Type": "audio/mpeg",
                    "X-Santa-Text": "Ho ho ho! Mock Mode active (No API Key found).",
                },
            });
        }

        // 2. LiquidAI / Hugging Face Inference
        // Model: LiquidAI/LFM2-Audio-1.5B
        // We'll try the standard HF Inference API URL
        const MODEL_ID = "LiquidAI/LFM2-Audio-1.5B";
        // Updated to new router endpoint (api-inference.huggingface.co is deprecated)
        const API_URL = `https://router.huggingface.co/hf-inference/models/${MODEL_ID}`;

        console.log(`Sending request to ${MODEL_ID}...`);

        // Note: The specific payload format for this model might vary.
        // Standard TTS usually expects {"inputs": "text"}.
        // Since this is a foundation model, we might need to specify the task or format.
        // We will try the standard "inputs" payload first.

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: text,
                parameters: {
                    // Optional parameters if needed
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("HF API Error:", errorText);
            throw new Error(`Hugging Face API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        // 3. Return Audio
        // The HF Inference API returns the raw audio bytes.
        // We pass the original text back in the header so the UI can show it (since we don't have a separate text generation step anymore, 
        // or rather, we are using the user's text as the "Santa Text" for now, 
        // OR we are assuming the model generates speech from the input text directly).

        // WAIT: The previous logic generated text *then* speech. 
        // If we just pass the user's text to TTS, Santa just repeats what the user said?
        // The user request was "use this model". LFM2-Audio is a "speech-to-speech" or "text-to-speech" model.
        // If it's a foundation model, maybe it *generates* the response too?
        // "End-to-end audio foundation model... conversational tasks".
        // This implies we send the USER audio/text, and it returns SANTA audio.
        // So sending the user text `text` is correct, and the audio returned is the *response*.

        // We need to know what the *text* of the response was to show it in the UI.
        // Standard audio-to-audio models don't always return the transcript.
        // For now, we will set X-Santa-Text to "Santa is speaking..." or similar, 
        // unless we can parse a multipart response (unlikely for standard HF API).

        return new NextResponse(response.body, {
            headers: {
                "Content-Type": "audio/mpeg", // Or audio/wav, depending on model output
                "X-Santa-Text": "(Audio response)",
            },
        });

    } catch (error: any) {
        console.error("Error in /api/santa:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
