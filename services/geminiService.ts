import { GoogleGenAI, Type, Modality, LiveServerMessage } from "@google/genai";
import { Verse } from "../types";

// Helper to clean JSON strings from Markdown code blocks
const cleanJson = (text: string): string => {
  let cleaned = text.trim();
  // Remove markdown code blocks if present
  cleaned = cleaned.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
  return cleaned.trim();
};

// --- 1. Recitation Recognition (Audio -> Verse) ---
export const identifyRecitation = async (base64Audio: string, mimeType: string): Promise<Verse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Listen to this Quranic recitation. 
    Identify the exact Surah (chapter) and Ayah (verse) being recited.
    Return the result in JSON format.
    Fields required: surahNumber, ayahNumber, surahNameAr, surahNameEn, arabicText, translation, transliteration.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            surahNumber: { type: Type.INTEGER },
            ayahNumber: { type: Type.INTEGER },
            surahNameAr: { type: Type.STRING },
            surahNameEn: { type: Type.STRING },
            arabicText: { type: Type.STRING },
            translation: { type: Type.STRING },
            transliteration: { type: Type.STRING },
          },
          required: ["surahNumber", "ayahNumber", "surahNameAr", "surahNameEn", "arabicText", "translation", "transliteration"]
        }
      }
    });

    if (response.text) {
      const cleanedText = cleanJson(response.text);
      return JSON.parse(cleanedText) as Verse;
    }
  } catch (error) {
    console.error("Recitation identification failed:", error);
    throw new Error("Could not identify recitation. Please try again clearly.");
  }
  throw new Error("Could not identify recitation");
};

// --- 2. Scholar Chat (Thinking Mode) ---
export const askScholar = async (history: {role: string, parts: {text: string}[]}[], question: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-pro-preview";
  
  const chat = ai.chats.create({
    model: model,
    history: history,
    config: {
      thinkingConfig: { thinkingBudget: 16000 },
    }
  });

  const result = await chat.sendMessage({ message: question });
  return result.text;
};

// --- 3. Text to Speech ---
export const generateSpeech = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash-preview-tts";
  
  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [{ text: text }]
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Puck' }
        }
      }
    }
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio generated");
  return base64Audio;
};

// --- 4. Live API Setup ---
export const connectLiveSession = async (
  onAudioData: (base64: string) => void,
  onClose: () => void
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash-native-audio-preview-09-2025";
  
  return ai.live.connect({
    model: model,
    callbacks: {
      onopen: () => {
        console.log("Live session opened");
      },
      onmessage: (message: LiveServerMessage) => {
        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          onAudioData(base64Audio);
        }
      },
      onclose: () => {
        console.log("Live session closed");
        onClose();
      },
      onerror: (err) => {
        console.error("Live session error", err);
        onClose();
      }
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
      },
      systemInstruction: "You are a helpful Quran tutor. Listen to the user recite (or speak) and help them improve, or discuss verses. Be polite, encouraging, and respectful."
    }
  });
};

// --- 5. Image Generation ---
export const generateIslamicArt = async (prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-pro-image-preview";

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        {
          text: `Generate an Islamic geometric art piece based on this description: ${prompt}`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size,
      },
    },
  });

  const candidates = response.candidates;
  if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts) {
     for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            return `data:image/png;base64,${base64EncodeString}`;
        }
     }
  }

  throw new Error("No image generated.");
};
