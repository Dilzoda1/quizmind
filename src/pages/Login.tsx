import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="glass-card p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome to QuizAI</h2>
        <Auth 
          supabaseClient={supabase} 
          appearance={{ theme: ThemeSupa }} 
          providers={['google']} 
          theme="default"
        />
      </div>
    </div>
  );
}
