import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Email Responder',
  description: 'Generate professional, friendly, or polite email replies using AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark-900 text-dark-50 antialiased">
        {children}
      </body>
    </html>
  );
}
