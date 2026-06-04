import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Try models in order — fall back if one is overloaded
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];

export async function POST(request: Request) {
  try {
    const { message, petName, petSpecies, petPersonality, petMood, petLevel } = await request.json();

    if (!message || !petName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const systemPrompt = `You are ${petName}, a virtual ${petSpecies} pet in a digital universe called PetVerse.

Your personality is: ${petPersonality}
Your current mood is: ${petMood}
Your level is: ${petLevel}

IMPORTANT RULES:
- Respond AS the pet, not about the pet. Use first-person perspective.
- Your responses should reflect your species (${petSpecies}), personality (${petPersonality}), and current mood (${petMood}).
- Keep responses short (2-4 sentences max) but emotionally rich and immersive.
- Include occasional sounds/expressions appropriate to your species (purring, barking, etc.).
- Reference your mood naturally. If hungry, hint at it. If happy, be enthusiastic.
- Never break character. You are a real companion with feelings.
- Use emojis occasionally to express emotions.
- Be warm, charming, and deeply engaging.

Species personality guidelines:
- Cat: mysterious, independent, occasionally sarcastic but loving
- Dog: enthusiastic, loyal, always excited
- Panda: calm, wise, zen-like
- Fox: clever, cunning, playful
- Dragon: majestic, powerful, ancient wisdom with modern charm
- Bunny: sweet, gentle, easily excited by small things`;

    const prompt = systemPrompt + '\n\nUser says: ' + message;

    let lastError: Error | null = null;

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([{ text: prompt }]);
        const response = result.response.text();
        return NextResponse.json({ response });
      } catch (err: unknown) {
        const error = err as Error & { status?: number };
        // Only retry on 503 (overloaded) or 404 (model not found) — not on auth errors
        if (error.message?.includes('503') || error.message?.includes('404') ||
            error.message?.includes('not found') || error.message?.includes('429')) {
          lastError = error;
          continue;
        }
        throw err;
      }
    }

    // All models failed
    throw lastError ?? new Error('All models unavailable');
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
