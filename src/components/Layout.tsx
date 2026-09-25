import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Brain, Upload as UploadIcon, Home, BarChart2, LogIn, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

export default function Layout({ session }: { session: any }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 glass m-4 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 flex items-center space-x-2">
            <Brain className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              QuizAI
            </span>
          </div>
          
          <nav className="px-4 space-y-2 mt-4">
            <Link to="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/50 transition-colors">
              <Home className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Home</span>
            </Link>
            
            {session && (
              <>
                <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/50 transition-colors">
                  <BarChart2 className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link to="/upload" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/50 transition-colors">
                  <UploadIcon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Upload Notes</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="p-4">
          {session ? (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white/50 hover:bg-white/80 rounded-lg transition-colors text-red-600 font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          ) : (
            <Link 
              to="/login"
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shadow-soft"
            >
              <LogIn className="w-4 h-4" />
              <span>Log in</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative p-4 md:p-8">
        {/* Mobile Header */}
        <div className="md:hidden glass p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold">QuizAI</span>
          </div>
          {!session && (
            <Link to="/login" className="text-sm font-medium text-primary">Log in</Link>
          )}
        </div>

        <div className="max-w-6xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
