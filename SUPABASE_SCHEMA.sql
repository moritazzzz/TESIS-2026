-- SQL Schema for Habla, Juega y Aprende
-- Run this in the Supabase SQL Editor

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  nickname TEXT,
  age INTEGER,
  avatar TEXT,
  theme_color TEXT,
  assistant_voice TEXT,
  focus_areas JSONB,
  learning_style TEXT,
  special_need_type TEXT,
  favorite_topics JSONB,
  support_strategies JSONB,
  level TEXT,
  current_level INTEGER,
  score INTEGER DEFAULT 0,
  correct_answers_streak INTEGER DEFAULT 0,
  history JSONB DEFAULT '[]'::jsonb,
  badges JSONB DEFAULT '[]'::jsonb,
  preferred_difficulty TEXT,
  daily_session_duration INTEGER,
  favorite_game_types TEXT,
  font_size TEXT,
  therapist_name TEXT,
  unlocked_levels JSONB DEFAULT '[]'::jsonb,
  world_progress JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TIME NOT NULL DEFAULT CURRENT_TIME,
  duration_minutes INTEGER,
  child_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_name TEXT,
  therapist_name TEXT,
  level_worked TEXT,
  activity_performed TEXT,
  result TEXT,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create Policies (Simplified for demo, harden if adding Auth)
CREATE POLICY "Public profiles access" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Public reports access" ON public.reports FOR ALL USING (true);
