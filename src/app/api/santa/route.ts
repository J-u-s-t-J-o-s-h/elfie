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
        const elevenLabsVoiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Fallback to Rachel if not set, user should change this

        // 1. MOCK MODE: If keys are missing, return a dummy response
        if (!openaiKey || !elevenLabsKey) {
            console.log("Missing API keys, using Mock Mode");
            // Simulate delay
            await new Promise((resolve) => setTimeout(resolve, 2000));

            return NextResponse.json({
                text: "Ho ho ho! I'm currently in Mock Mode because my API keys are missing. But I hear you loud and clear! Merry Christmas!",
                audio: MOCK_AUDIO_BASE64,
                contentType: "audio/mp3",
                isMock: true
            });
        }

        // 2. REAL MODE: OpenAI for Text Generation
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
                        content: "You are Santa Claus. You are jolly, warm, and kind. Keep your responses relatively short (2-3 sentences max) so the conversation flows naturally. Use 'Ho ho ho' sparingly. You are talking to a child."
                    },
                    { role: "user", content: text }
                ],
                max_tokens: 150,
            }),
        });

        const completionData = await completion.json();

        if (completionData.error) {
            throw new Error(`OpenAI Error: ${completionData.error.message}`);
        }

        const santaResponse = completionData.choices[0].message.content;

        // 3. REAL MODE: ElevenLabs for Text-to-Speech
        const ttsResponse = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": elevenLabsKey,
                },
                body: JSON.stringify({
                    text: santaResponse,
                    model_id: "eleven_monolingual_v1",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                    },
                }),
            }
        );

        if (!ttsResponse.ok) {
            const errorText = await ttsResponse.text();
            throw new Error(`ElevenLabs Error: ${errorText}`);
        }

        const audioBuffer = await ttsResponse.arrayBuffer();
        const audioBase64 = Buffer.from(audioBuffer).toString("base64");

        return NextResponse.json({
            text: santaResponse,
            audio: audioBase64,
            contentType: "audio/mpeg",
            isMock: false
        });

    } catch (error: any) {
        console.error("Error in /api/santa:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
