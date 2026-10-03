import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Brain, ChevronLeft, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateQuizFromText } from '../lib/ai';

type QuizQuestion = {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
};

export default function DocumentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    async function loadDocument() {
      if (!id) return;
      const { data, error: fetchError } = await supabase
        .from('documents')
        .select('title, content')
        .eq('id', id)
        .single();

      if (fetchError || !data) {
        setError(fetchError?.message || 'Document not found.');
        setLoading(false);
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setLoading(false);
    }
    loadDocument();
  }, [id]);

  const handleGenerateQuiz = async () => {
    setGenerating(true);
    setError('');
    setQuestions([]);
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);

    try {
      const result = await generateQuizFromText(content, 5, 'medium');
      if (!result?.length) throw new Error('No questions were generated.');
      setQuestions(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate quiz.';
      setError(message);
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswer = (option: string) => {
    if (selected || finished) return;
    setSelected(option);
    const correct = questions[currentIndex].correct_answer;
    if (option === correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIndex >= questions.length - 1) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelected(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="space-y-4 text-center py-12">
        <p className="text-red-600">{error}</p>
        <button type="button" onClick={() => navigate('/dashboard')} className="text-primary hover:underline">
          Back to dashboard
        </button>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="space-y-8 py-4 max-w-3xl mx-auto">
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 text-gray-500 hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Dashboard</span>
      </button>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-sm text-gray-500 line-clamp-3">{content.substring(0, 280)}…</p>
      </div>

      {!questions.length && (
        <button
          type="button"
          onClick={handleGenerateQuiz}
          disabled={generating}
          className="px-6 py-3 bg-secondary text-white rounded-xl flex items-center space-x-2 hover:bg-secondary/90 disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
          <span>{generating ? 'Generating quiz…' : 'Generate quiz (5 questions)'}</span>
        </button>
      )}

      {error && content && (
        <div className="p-4 bg-red-100 text-red-600 rounded-lg">{error}</div>
      )}

      {questions.length > 0 && !finished && current && (
        <div className="glass-card p-8 space-y-6">
          <p className="text-sm text-gray-500">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <h2 className="text-xl font-semibold">{current.question}</h2>
          <ul className="space-y-3">
            {current.options.map((option) => {
              let style = 'border-gray-200 hover:border-primary/50';
              if (selected) {
                if (option === current.correct_answer) style = 'border-green-500 bg-green-50';
                else if (option === selected) style = 'border-red-500 bg-red-50';
              }
              return (
                <li key={option}>
                  <button
                    type="button"
                    disabled={!!selected}
                    onClick={() => handleAnswer(option)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${style}`}
                  >
                    {option}
                  </button>
                </li>
              );
            })}
          </ul>
          {selected && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{current.explanation}</p>
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                {currentIndex >= questions.length - 1 ? 'See results' : 'Next question'}
              </button>
            </div>
          )}
        </div>
      )}

      {finished && (
        <div className="glass-card p-8 text-center space-y-4">
          {score >= questions.length / 2 ? (
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          ) : (
            <XCircle className="w-16 h-16 text-amber-500 mx-auto" />
          )}
          <h2 className="text-2xl font-bold">
            Score: {score} / {questions.length}
          </h2>
          <button
            type="button"
            onClick={handleGenerateQuiz}
            className="text-primary hover:underline"
          >
            Generate a new quiz
          </button>
        </div>
      )}
    </div>
  );
}
