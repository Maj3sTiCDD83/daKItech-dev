// Gemini API Helper (TTS / LLM)
import { GoogleGenAI } from "@google/genai";
import { ApiLogger } from "../utils/logger";

let aiClient: GoogleGenAI | null = null;
let previewAudioContext: AudioContext | null = null;

export async function getAiClient() {
    if (!aiClient) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY environment variable is required");
        }
        aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
}

export async function generateVoicePreview(voiceName: string, onPlayStart?: () => void, onPlayEnd?: () => void) {
    try {
        const ai = await getAiClient();
        
        let sampleText = "Hallo! Ich bin dein digitaler Assistent, bereit für das nächste Gespräch.";
        if (voiceName === 'Fenrir') sampleText = "Guten Tag. Ich bin bereit, die Kundenanfragen professionell für Sie abzuwickeln.";
        else if (voiceName === 'Kore') sampleText = "Hallo! Wie kann ich dir und deinem Team heute helfen?";
        else if (voiceName === 'Zephyr') sampleText = "Hi! Ich bin Zephyr. Lass uns direkt mit dem nächsten Call starten.";
        else if (voiceName === 'Aoede') sampleText = "Herzlich willkommen. Ich stehe Ihnen professionell zur Seite.";

        let ttsVoiceName = voiceName;

        ApiLogger.log("Gemini API", "TTS Voice Preview Request", { model: "gemini-3.1-flash-tts-preview", text: sampleText, voice: ttsVoiceName }, 'request');

        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-tts-preview",
            contents: [{ parts: [{ text: sampleText }] }],
            config: {
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: ttsVoiceName,
                        },
                    },
                },
            },
        });

        ApiLogger.log("Gemini API", "TTS Voice Preview Response", "Audio Object Received", 'response');

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            if (!previewAudioContext) {
                previewAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
            }
            if (previewAudioContext.state === 'suspended') {
                await previewAudioContext.resume();
            }

            const binaryString = window.atob(base64Audio);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const int16Array = new Int16Array(bytes.buffer);
            const float32Array = new Float32Array(int16Array.length);
            for (let i = 0; i < int16Array.length; i++) {
                float32Array[i] = int16Array[i] / 32768.0;
            }
            
            const audioBuffer = previewAudioContext.createBuffer(1, float32Array.length, 24000);
            audioBuffer.getChannelData(0).set(float32Array);
            
            const source = previewAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(previewAudioContext.destination);
            
            source.onended = () => {
                if (onPlayEnd) onPlayEnd();
            };

            if (onPlayStart) onPlayStart();
            source.start(0);
        } else {
             if (onPlayEnd) onPlayEnd();
        }
    } catch (error) {
        console.error("Fehler bei der Vorschau:", error);
        if (onPlayEnd) onPlayEnd();
    }
}
