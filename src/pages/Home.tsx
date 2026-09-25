import React from 'react';
import { motion } from 'framer-motion';
import { Brain, FileText, Zap, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: FileText, title: 'AI Quiz', desc: 'Instantly turn notes into practice quizzes.' },
  { icon: Zap, title: 'Flashcards', desc: 'Auto-generated flashcards for spaced repetition.' },
  { icon: Award, title: 'Exam Mode', desc: 'Simulate real exams with timers and analytics.' },
  { icon: Brain, title: 'Weak Topic Analysis', desc: 'Discover exactly where you need to improve.' },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-16">
      <div className="text-center space-y-6 max-w-3xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground"
        >
          Master any subject with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">QuizAI</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 md:px-16"
        >
          Upload your notes, PDFs, or paste text. Our AI instantly generates quizzes, flashcards, and personalized study plans.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center space-x-4 pt-4"
        >
          <Link to="/upload" className="px-8 py-4 bg-primary text-white font-medium rounded-xl shadow-soft hover:bg-primary/90 transition-colors transform hover:scale-105 active:scale-95 duration-200">
            Upload File
          </Link>
          <Link to="/demo" className="px-8 py-4 glass-card font-medium rounded-xl hover:bg-white/90 transition-colors transform hover:scale-105 active:scale-95 duration-200">
            Try Demo
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {features.map((feat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className="glass-card p-6 flex flex-col items-center text-center space-y-4 hover:border-primary/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">{feat.title}</h3>
            <p className="text-sm text-gray-500">{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
