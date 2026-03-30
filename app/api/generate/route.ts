import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const systemPrompts = {
  professional:
    'You are a professional email assistant. Generate a concise, formal email reply. Keep it under 150 words. Focus on clarity, professionalism, and actionable next steps. Use proper business language.',
  friendly:
    'You are a friendly email assistant. Generate a warm, approachable email reply. Keep it under 150 words. Use a conversational tone while remaining professional. Show genuine interest and enthusiasm.',
  decline:
    'You are a polite email assistant. Generate a graceful decline or refusal email. Keep it under 150 words. Be respectful, appreciative, and offer an alternative if possible. Maintain goodwill while declining clearly.',
  assertive:
    'You are an assertive email assistant. Generate a confident, decisive email reply. Keep it under 150 words. Be direct, clear, and firm while maintaining respect and professionalism.',
};

type ToneType = 'professional' | 'friendly' | 'decline' | 'assertive';

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

    if (!tone || !['professional', 'friendly', 'decline', 'assertive'].includes(tone)) {
      return NextResponse.json(
        { error: 'Invalid tone. Must be: professional, friendly, decline, or assertive' },
        { status: 400 }
      );
    }

    const apiKey = (process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '').trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = systemPrompts[tone as ToneType];

    const prompt = `${systemPrompt}

Here is the email I received:
${emailContent}

Generate only the reply email body. Do not include "Subject:" or any other metadata. Just the email content.`;

    // Use a known available model in this project.
    // Priority order: try more stable models first
    const fallbackModels = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
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
        console.log(`Successfully used model: ${candidate}`);
        break;
      } catch (innerError) {
        lastError = innerError instanceof Error ? innerError : new Error(String(innerError));
        console.warn(`Model ${candidate} failed, trying next:`, lastError.message);
      }
    }

    if (!result) {
      throw lastError || new Error('No suitable AI model available. Please verify your API key and billing settings at https://console.cloud.google.com/');
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
