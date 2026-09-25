-- Create Users Table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users not null primary key,
  email text not null,
  name text,
  avatar_url text,
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  last_login timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Documents Table
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  title text not null,
  content text not null,
  original_file_url text,
  created_at timestamp with time zone default now()
);

-- Quizzes Table
create table public.quizzes (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references public.documents(id) not null,
  user_id uuid references public.users(id) not null,
  difficulty text not null,
  type text not null, -- 'mixed', 'mcq', etc.
  created_at timestamp with time zone default now()
);

-- Questions Table
create table public.questions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes(id) not null,
  type text not null,
  question text not null,
  options jsonb, -- For MCQs
  correct_answer text not null,
  explanation text not null,
  source_paragraph text not null,
  created_at timestamp with time zone default now()
);

-- Flashcards Table
create table public.flashcards (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references public.documents(id) not null,
  user_id uuid references public.users(id) not null,
  question text not null,
  answer text not null,
  difficulty text default 'medium',
  next_review timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Attempts Table
create table public.attempts (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes(id) not null,
  user_id uuid references public.users(id) not null,
  score integer not null,
  time_used integer not null, -- in seconds
  completed_at timestamp with time zone default now()
);

-- Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.documents enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.flashcards enable row level security;
alter table public.attempts enable row level security;

-- Create policies (Example: Users can only see their own data)
create policy "Users can view own profile" on public.users for select using ( auth.uid() = id );
create policy "Users can update own profile" on public.users for update using ( auth.uid() = id );

create policy "Users can view own documents" on public.documents for select using ( auth.uid() = user_id );
create policy "Users can insert own documents" on public.documents for insert with check ( auth.uid() = user_id );
create policy "Users can delete own documents" on public.documents for delete using ( auth.uid() = user_id );

-- (Similar policies for quizzes, flashcards, attempts...)
