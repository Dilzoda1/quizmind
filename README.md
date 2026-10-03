# QuizAI (QuizMind)

AI-powered study app: upload PDF, DOCX, or TXT notes, save them to Supabase, and generate quizzes with OpenAI.

## Setup

1. Copy `.env.example` to `.env` and fill in:

   - `VITE_SUPABASE_URL` — Supabase project URL  
   - `VITE_SUPABASE_ANON_KEY` — Supabase anon key  
   - `VITE_OPENAI_API_KEY` — OpenAI API key (required for quiz generation)

2. In the Supabase SQL editor, run `supabase/schema.sql` (tables, RLS, signup trigger).

3. In Supabase Authentication → Providers, enable Email and/or Google if you use Google login on the login page.

4. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:5173 — use **Try Demo** without an account, or sign in to upload documents.

## Scripts

- `npm run dev` — development server  
- `npm run build` — production build  
- `npm run preview` — preview production build  

## Notes

- OpenAI is called from the browser for this prototype (`dangerouslyAllowBrowser`). For production, move AI calls to a backend.
