import { useState } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { generateQuizFromText } from '../lib/ai';

const DEMO_TEXT = `
Photosynthesis is the process used by plants to convert light energy into chemical energy.
Chlorophyll in chloroplasts absorbs sunlight. The light-dependent reactions occur in the thylakoid membranes.
They produce ATP and NADPH. The Calvin cycle uses ATP and NADPH to fix carbon dioxide into glucose.
Cellular respiration breaks down glucose to release ATP. Mitochondria are the main site of aerobic respiration.
`;

type QuizQuestion = {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
};

export default function Demo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const startDemo = async () => {
    setLoading(true);
    setError('');
    setQuestions([]);
    setIndex(0);
    setPicked(null);
    try {
      const result = await generateQuizFromText(DEMO_TEXT, 3, 'easy');
      setQuestions(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Demo quiz failed. Check your OpenAI API key.');
    } finally {
      setLoading(false);
    }
  };

  const q = questions[index];

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold">Try a demo quiz</h1>
        <p className="text-gray-500">
          Sample biology notes — no account required. You need a valid OpenAI API key in `.env`.
        </p>
      </div>

      {!questions.length && (
        <div className="glass-card p-8 space-y-4">
          <p className="text-sm text-gray-600 whitespace-pre-line">{DEMO_TEXT.trim()}</p>
          <button
            type="button"
            onClick={startDemo}
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
            <span>{loading ? 'Generating…' : 'Start demo quiz'}</span>
          </button>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        </div>
      )}

      {q && (
        <div className="glass-card p-8 space-y-6">
          <p className="text-sm text-gray-500">Question {index + 1} of {questions.length}</p>
          <h2 className="text-xl font-semibold">{q.question}</h2>
          <ul className="space-y-2">
            {q.options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  disabled={!!picked}
                  onClick={() => setPicked(opt)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-primary/50"
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
          {picked && (
            <div className="space-y-3">
              <p className={picked === q.correct_answer ? 'text-green-600' : 'text-red-600'}>
                {picked === q.correct_answer ? 'Correct!' : `Correct answer: ${q.correct_answer}`}
              </p>
              <p className="text-sm text-gray-600">{q.explanation}</p>
              {index < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => { setIndex((i) => i + 1); setPicked(null); }}
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Next
                </button>
              ) : (
                <button type="button" onClick={startDemo} className="text-primary hover:underline">
                  Try again
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
