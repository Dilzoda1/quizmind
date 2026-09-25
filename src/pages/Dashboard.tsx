import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, Plus, Brain, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDocuments() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (data) setDocuments(data);
      setLoading(false);
    }
    fetchDocuments();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <Link to="/upload" className="px-4 py-2 bg-primary text-white rounded-lg flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Upload</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col space-y-2 border-t-4 border-t-primary">
          <span className="text-gray-500 font-medium text-sm uppercase">Total Documents</span>
          <span className="text-4xl font-bold">{documents.length}</span>
        </div>
        <div className="glass-card p-6 flex flex-col space-y-2 border-t-4 border-t-secondary">
          <span className="text-gray-500 font-medium text-sm uppercase">Quizzes Taken</span>
          <span className="text-4xl font-bold">0</span>
        </div>
        <div className="glass-card p-6 flex flex-col space-y-2 border-t-4 border-t-accent">
          <span className="text-gray-500 font-medium text-sm uppercase">Current Streak</span>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-accent" />
            <span className="text-4xl font-bold">1 Day</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Study Materials</h2>
        {documents.length === 0 ? (
          <div className="glass-card p-12 text-center flex flex-col items-center justify-center space-y-4 text-gray-500">
            <FileText className="w-12 h-12 opacity-50" />
            <p>You haven't uploaded any documents yet.</p>
            <Link to="/upload" className="text-primary hover:underline">Upload your first note</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="glass-card p-6 flex flex-col justify-between space-y-4 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate(`/document/${doc.id}`)}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-primary">
                    <FileText className="w-5 h-5" />
                    <h3 className="font-semibold truncate" title={doc.title}>{doc.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {doc.content.substring(0, 100)}...
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-xs text-gray-400">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                  <button className="text-sm font-medium text-secondary flex items-center space-x-1">
                    <Brain className="w-4 h-4" />
                    <span>Generate Quiz</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
