-- AI Interview Platform — Supabase Schema

create table if not exists public.interviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  category text not null,
  score integer not null default 0,
  feedback jsonb not null default '{}',
  created_at timestamptz default now()
);

create table if not exists public.interview_transcripts (
  id uuid default gen_random_uuid() primary key,
  interview_id uuid references public.interviews(id) on delete cascade not null,
  question text not null,
  answer text not null default '',
  created_at timestamptz default now()
);

alter table public.interviews enable row level security;
alter table public.interview_transcripts enable row level security;

create policy "Users can read own interviews"
  on public.interviews for select using (auth.uid() = user_id);

create policy "Users can insert own interviews"
  on public.interviews for insert with check (auth.uid() = user_id);

create policy "Users can read own transcripts"
  on public.interview_transcripts for select
  using (interview_id in (select id from public.interviews where user_id = auth.uid()));

create policy "Users can insert own transcripts"
  on public.interview_transcripts for insert
  with check (interview_id in (select id from public.interviews where user_id = auth.uid()));

create index idx_interviews_user on public.interviews(user_id);
create index idx_transcripts_interview on public.interview_transcripts(interview_id);
