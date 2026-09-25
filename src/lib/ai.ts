import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn("VITE_OPENAI_API_KEY is missing. AI features will not work.");
}

const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key',
  dangerouslyAllowBrowser: true // For prototype only. In production, use backend.
});

export async function processDocumentText(text: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // or gpt-3.5-turbo
    messages: [
      {
        role: "system",
        content: "You are an AI assistant for a study platform. Extract the main title, a summary, and key chapters/topics from the provided text. Return the result in JSON format with fields: title (string), summary (string), topics (string[])."
      },
      {
        role: "user",
        content: `Please analyze the following text:\n\n${text.substring(0, 15000)}` // Limit to prevent token overflow
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Failed to process document");
  
  return JSON.parse(content);
}

export async function generateQuizFromText(text: string, count: number, difficulty: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an AI teacher. Generate ${count} multiple-choice questions of ${difficulty} difficulty strictly from the provided text. Never hallucinate outside the text. Return a JSON object with a "questions" array. Each question should have: "question" (string), "options" (string array of 4 choices), "correct_answer" (string, must exactly match one option), "explanation" (string), "source_paragraph" (string quoting a snippet from text).`
      },
      {
        role: "user",
        content: text.substring(0, 15000)
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Failed to generate quiz");
  
  return JSON.parse(content).questions;
}
