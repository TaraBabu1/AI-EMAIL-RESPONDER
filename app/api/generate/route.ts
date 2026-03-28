import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const systemPrompts = {
  professional:
    'You are a professional email assistant. Generate a concise, formal email reply. Keep it under 150 words. Focus on clarity, professionalism, and actionable next steps. Use proper business language.',
  friendly:
    'You are a friendly email assistant. Generate a warm, approachable email reply. Keep it under 150 words. Use a conversational tone while remaining professional. Show genuine interest and enthusiasm.',
  decline:
    'You are a polite email assistant. Generate a graceful decline or refusal email. Keep it under 150 words. Be respectful, appreciative, and offer an alternative if possible. Maintain goodwill while declining clearly.',
};

type ToneType = 'professional' | 'friendly' | 'decline';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailContent, tone } = body;

    if (!emailContent || !emailContent.trim()) {
      return NextResponse.json(
        { error: 'Email content is required' },
        { status: 400 }
      );
    }

    if (!tone || !['professional', 'friendly', 'decline'].includes(tone)) {
      return NextResponse.json(
        { error: 'Invalid tone. Must be: professional, friendly, or decline' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = systemPrompts[tone as ToneType];

    const prompt = `${systemPrompt}

Here is the email I received:
${emailContent}

Generate only the reply email body. Do not include "Subject:" or any other metadata. Just the email content.`;

    // Use a known available model in this project.
    // These are observed from ListModels for the API key used in this environment.
    const fallbackModels = [
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'gemini-2.0-flash',
      'gemini-2.0-flash-001',
      'gemini-2.0-flash-lite-001',
    ];

    let result;
    let lastError: Error | null = null;

    for (const candidate of fallbackModels) {
      try {
        const candidateModel = genAI.getGenerativeModel(
          { model: candidate },
          { apiVersion: 'v1' }
        );
        result = await candidateModel.generateContent(prompt);
        lastError = null;
        break;
      } catch (innerError) {
        lastError = innerError instanceof Error ? innerError : new Error(String(innerError));
        console.warn(`Model ${candidate} failed, trying next:`, lastError.message);
      }
    }

    if (!result) {
      throw lastError || new Error('No suitable AI model available.');
    }

    const response = result.response;
    const reply = response.text();

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    console.error('Error generating reply:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to generate reply',
      },
      { status: 500 }
    );
  }
}
