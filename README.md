# 🚀 AI Email Responder

A modern, full-stack web application for generating professional, friendly, or polite email replies using Google Gemini 1.5 Flash API.

## 🎯 Features

- **Three Reply Styles:**
  - 💼 Professional - Formal, business-appropriate responses
  - 😊 Friendly - Warm, conversational yet professional replies
  - 🙏 Polite Decline - Respectful refusals that maintain goodwill

- **One-Click Generation** - Get AI-powered email replies in seconds
- **Copy to Clipboard** - Instantly copy generated replies to your clipboard
- **Dark Theme UI** - Modern, eye-friendly interface built with Tailwind CSS
- **Secure API Key Handling** - API key never exposed to the client

## 📋 Tech Stack

- **Framework:** Next.js 15 (App Router) with TypeScript
- **Styling:** Tailwind CSS 4
- **AI Model:** Google Gemini 1.5 Flash
- **Deployment:** Vercel
- **Package Manager:** npm/yarn/pnpm/bun

## 🛠️ Project Setup

### Prerequisites
- Node.js 16+ installed
- A Google Cloud account with Gemini API access
- Git installed

### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd ai-email-responder
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
pnpm install
bun install
\`\`\`

### 3. Get Your Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated API key

### 4. Configure Environment Variables
\`\`\`bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and add your Gemini API key
# NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
\`\`\`

### 5. Run Locally
\`\`\`bash
npm run dev
# or
yarn dev
pnpm dev
bun dev
\`\`\`

Visit `http://localhost:3000` to see the app in action!

## 📁 Project Structure

\`\`\`
ai-email-responder/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # Backend API endpoint
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Main UI component
│   └── globals.css               # Global Tailwind styles
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration
├── .env.local.example            # Environment variables template
└── .gitignore                    # Git ignore rules
\`\`\`

## 🔒 System Prompts

The app uses three carefully crafted system prompts to ensure high-quality, contextual email replies:

### Professional Prompt
\`\`\`
You are a professional email assistant. Generate a concise, formal email reply. 
Keep it under 150 words. Focus on clarity, professionalism, and actionable next steps. 
Use proper business language.
\`\`\`

### Friendly Prompt
\`\`\`
You are a friendly email assistant. Generate a warm, approachable email reply. 
Keep it under 150 words. Use a conversational tone while remaining professional. 
Show genuine interest and enthusiasm.
\`\`\`

### Polite Decline Prompt
\`\`\`
You are a polite email assistant. Generate a graceful decline or refusal email. 
Keep it under 150 words. Be respectful, appreciative, and offer an alternative if possible. 
Maintain goodwill while declining clearly.
\`\`\`

## 🚢 Deployment to Vercel

### Step 1: Push to GitHub
\`\`\`bash
# Initialize git repo (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: AI Email Responder"

# Add remote origin
git remote add origin https://github.com/yourusername/ai-email-responder.git

# Push to GitHub
git branch -M main
git push -u origin main
\`\`\`

### Step 2: Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Select your GitHub repository
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"

### Step 3: Set Environment Variables in Vercel
1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add a new environment variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your Google Gemini API key
   - **Environments:** Production, Preview, Development
3. Click "Save"
4. Trigger a redeployment (push a commit or manually redeploy)

### Step 4: Verify Deployment
- Visit your Vercel deployment URL (e.g., `https://ai-email-responder.vercel.app`)
- Test each reply button to ensure the API is connected
- Check browser console for any errors

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Your Google Gemini API key from AI Studio |

## 📝 API Endpoint

### POST `/api/generate`

Generates an email reply based on the provided email content and tone.

**Request Body:**
\`\`\`json
{
  "emailContent": "The email you received...",
  "tone": "professional" | "friendly" | "decline"
}
\`\`\`

**Response:**
\`\`\`json
{
  "reply": "The generated email reply text..."
}
\`\`\`

**Error Response:**
\`\`\`json
{
  "error": "Error message describing what went wrong"
}
\`\`\`

## 🎨 UI Components

### Main Page (`app/page.tsx`)
- Email input textarea
- Three response buttons (Professional, Friendly, Polite Decline)
- Reply output textarea
- Copy to clipboard button
- Error handling and feedback messages
- Loading states

### Styling Features
- Dark theme with custom color palette
- Responsive grid layout (1 column on mobile, 2 columns on desktop)
- Smooth transitions and hover effects
- Focus rings for accessibility
- Custom scrollbar styling

## 🚨 Error Handling

The application handles:
- Missing or empty email input
- Invalid tone selection
- API key not configured
- Network errors
- API rate limits
- Server-side errors

All errors are displayed to the user with clear, actionable messages.

## 🔐 Security Considerations

- ✅ API key stored server-side only (in `.env.local` / Vercel secrets)
- ✅ Never exposed to client-side code
- ✅ Secure API routes with proper error handling
- ✅ Input validation on both client and server
- ✅ No sensitive data logged

## 📈 Performance Tips

- Next.js App Router provides optimal code splitting
- Gemini 1.5 Flash is lightweight and fast
- Tailwind CSS uses PurgeCSS for minimal bundle size
- Static generation where possible

## 🐛 Troubleshooting

### "API key not configured"
- Ensure `.env.local` has `GEMINI_API_KEY` set
- For Vercel deployment, check Environment Variables in project settings
- Restart dev server after adding env variables

### "Failed to generate reply"
- Check your API key validity at [Google AI Studio](https://aistudio.google.com/app/apikey)
- Verify internet connection
- Check browser console for detailed error messages

### Tailwind styles not applying
- Run `npm install` to ensure all dependencies are installed
- Restart dev server: `npm run dev`
- Clear Next.js cache: `rm -rf .next`

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Google AI Studio](https://aistudio.google.com)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

Built with ❤️ for developers who want to automate email replies.
