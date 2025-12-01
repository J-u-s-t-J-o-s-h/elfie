import { NextResponse } from "next/server";

// Mock response for when keys are missing
const MOCK_AUDIO_BASE64 = "SUQzBAAAAAABAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAZGFzaABUWFhYAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzbzZtcDQxAFRTU0UAAAAPAAADTGF2ZjU3LjU2LjEwMAAAAAAAAAAAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWgAAAA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="; // Silent MP3 with ID3

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        const openaiKey = process.env.OPENAI_API_KEY;
        const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
        const elevenLabsVoiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";

        // 1. MOCK MODE
        if (!openaiKey || !elevenLabsKey) {
            console.log("Missing API keys, using Mock Mode");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Return mock audio as a stream (simulated by just sending the base64 as a buffer)
            const audioBuffer = Buffer.from(MOCK_AUDIO_BASE64, 'base64');
            return new NextResponse(audioBuffer, {
                headers: {
                    "Content-Type": "audio/mpeg",
                    "X-Santa-Text": "Ho ho ho! Mock Mode active.",
                },
            });
        }

        // 2. Text Generation (Groq or OpenAI)
        let santaResponse = "";
        const groqKey = process.env.GROQ_API_KEY;

        if (groqKey) {
            // Use Groq (Faster)
            const completion = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${groqKey}`,
                },
                body: JSON.stringify({
                    model: "llama3-8b-8192", // Very fast model
                    messages: [
                        {
                            role: "system",
                            content: "You are Santa Claus. Keep responses VERY short (1-2 sentences). Be jolly."
                        },
                        { role: "user", content: text }
                    ],
                    max_tokens: 60,
                }),
            });

            const completionData = await completion.json();
            if (completionData.error) throw new Error(`Groq Error: ${completionData.error.message}`);
            santaResponse = completionData.choices[0].message.content;

        } else {
            // Use OpenAI (Fallback)
            const completion = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${openaiKey}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "You are Santa Claus. Keep responses VERY short (1-2 sentences). Be jolly."
                        },
                        { role: "user", content: text }
                    ],
                    max_tokens: 60,
                }),
            });

            const completionData = await completion.json();
            if (completionData.error) throw new Error(completionData.error.message);
            santaResponse = completionData.choices[0].message.content;
        }

        // 3. ElevenLabs Audio Streaming
        const ttsResponse = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}/stream?optimize_streaming_latency=3`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": elevenLabsKey,
                },
                body: JSON.stringify({
                    text: santaResponse,
                    model_id: "eleven_turbo_v2",
                    voice_settings: { stability: 0.5, similarity_boost: 0.75 },
                }),
            }
        );

        if (!ttsResponse.ok) {
            const errorText = await ttsResponse.text();
            throw new Error(`ElevenLabs Error: ${errorText}`);
        }

        // Return the audio stream directly
        // We pass the text in a header so the frontend can display it
        return new NextResponse(ttsResponse.body, {
            headers: {
                "Content-Type": "audio/mpeg",
                "X-Santa-Text": santaResponse, // Pass text in header
            },
        });

    } catch (error: any) {
        console.error("Error in /api/santa:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
