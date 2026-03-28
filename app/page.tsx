'use client';

import { useState } from 'react';

export default function Home() {
  const [emailInput, setEmailInput] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  const generateReply = async (tone: 'professional' | 'friendly' | 'decline') => {
    if (!emailInput.trim()) {
      setError('Please paste an email first');
      return;
    }

    setLoading(true);
    setError('');
    setReply('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailContent: emailInput, tone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate reply');
      }

      const data = await response.json();
      setReply(data.reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!reply) return;

    try {
      await navigator.clipboard.writeText(reply);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-dark-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            AI Email Responder
          </h1>
          <p className="text-dark-300 text-lg">
            Generate professional, friendly, or polite email replies instantly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="flex flex-col">
            <label htmlFor="email-input" className="text-sm font-semibold text-dark-200 mb-3">
              Paste the Email You Received
            </label>
            <textarea
              id="email-input"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Paste the email you want to reply to here..."
              className="flex-1 w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-dark-50 placeholder-dark-500 resize-none"
              minRows={12}
            />

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              <button
                onClick={() => generateReply('professional')}
                disabled={loading}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-dark-600 text-white font-semibold rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-dark-900"
              >
                {loading ? 'Generating...' : '💼 Professional'}
              </button>

              <button
                onClick={() => generateReply('friendly')}
                disabled={loading}
                className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-dark-600 text-white font-semibold rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-dark-900"
              >
                {loading ? 'Generating...' : '😊 Friendly'}
              </button>

              <button
                onClick={() => generateReply('decline')}
                disabled={loading}
                className="px-4 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-dark-600 text-white font-semibold rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-dark-900"
              >
                {loading ? 'Generating...' : '🙏 Polite Decline'}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col">
            <label htmlFor="reply-output" className="text-sm font-semibold text-dark-200 mb-3">
              AI-Generated Reply
            </label>

            {error && (
              <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-lg text-red-100">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <textarea
              id="reply-output"
              value={reply}
              readOnly
              placeholder="Your AI-generated reply will appear here..."
              className="flex-1 w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-dark-50 placeholder-dark-500 resize-none"
              minRows={12}
            />

            {/* Copy Button */}
            {reply && (
              <button
                onClick={copyToClipboard}
                className="mt-4 w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-dark-900"
              >
                {copyFeedback ? '✅ Copied to Clipboard!' : '📋 Copy to Clipboard'}
              </button>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 bg-dark-800 border border-dark-700 rounded-lg">
          <h3 className="text-lg font-semibold text-dark-100 mb-3">💡 How It Works</h3>
          <ul className="space-y-2 text-dark-300">
            <li>• <strong>Professional:</strong> Formal, structured replies for business communications</li>
            <li>• <strong>Friendly:</strong> Warm, conversational replies while staying professional</li>
            <li>• <strong>Polite Decline:</strong> Respectful refusals that maintain goodwill</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-dark-500 text-sm">
          <p>Powered by Google Gemini 1.5 Flash API</p>
        </div>
      </div>
    </div>
  );
}
