import React, { useState } from 'react';
import { Upload as UploadIcon, File, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { extractTextFromFile } from '../lib/parser';
import { processDocumentText } from '../lib/ai';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');

    try {
      // 1. Extract text
      const text = await extractTextFromFile(file);
      
      // 2. Process with AI to get metadata
      const metadata = await processDocumentText(text);

      // 3. Save to Supabase
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: doc, error: dbError } = await supabase.from('documents').insert({
        user_id: userData.user.id,
        title: metadata.title || file.name,
        content: text,
      }).select().single();

      if (dbError) throw dbError;

      // Navigate to dashboard or quiz generator
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during processing.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Upload Study Material</h1>
        <p className="text-gray-500">Upload your PDF, DOCX, or TXT file to generate quizzes and flashcards.</p>
      </div>

      <div 
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="glass-card p-12 border-2 border-dashed border-primary/50 hover:border-primary transition-colors flex flex-col items-center justify-center cursor-pointer text-center space-y-4"
      >
        <UploadIcon className="w-16 h-16 text-primary" />
        <h3 className="text-xl font-medium">Drag & Drop your file here</h3>
        <p className="text-sm text-gray-500">Supported formats: PDF, DOCX, TXT</p>
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          accept=".pdf,.docx,.txt"
          onChange={handleChange}
        />
        <label 
          htmlFor="file-upload" 
          className="px-6 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
        >
          Browse Files
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-600 rounded-lg text-center">
          {error}
        </div>
      )}

      {file && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <File className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button 
            onClick={handleProcess}
            disabled={processing}
            className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {processing && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{processing ? 'Processing...' : 'Process Document'}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
