begin;

create extension if not exists pgcrypto;

create table public.certifications (
  id text primary key,
  name text not null,
  full_name text not null,
  description text,
  program_version text,
  available boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.certifications (id, name, full_name, available)
values
  ('CPA', 'CPA', 'Certificado Profissional ANBIMA', true),
  ('C-PRO-R', 'C-Pro R', 'C-Pro R', false),
  ('C-PRO-I', 'C-Pro I', 'C-Pro I', false),
  ('CFG', 'CFG', 'CFG', false),
  ('CGA', 'CGA', 'CGA', false),
  ('CGE', 'CGE', 'CGE', false)
on conflict (id) do nothing;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  avatar_url text,
  current_certification text not null default 'CPA' references public.certifications(id),
  daily_goal_minutes integer not null default 30 check (daily_goal_minutes between 5 and 600),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.curriculum_items (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references public.certifications(id) on delete cascade,
  parent_id uuid references public.curriculum_items(id) on delete cascade,
  program_version text,
  pd_code text not null,
  title text not null,
  topic text,
  subtopic text,
  item_type text not null default 'micro' check (item_type in ('macro', 'topic', 'subtopic', 'micro')),
  weight numeric(5,2) check (weight is null or (weight >= 0 and weight <= 100)),
  sort_order integer not null default 0,
  official_source text,
  source_url text,
  source_date date,
  last_verified date,
  content_version text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (certification_id, pd_code)
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  curriculum_item_id uuid not null references public.curriculum_items(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed', 'mastered')),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  started_at timestamptz,
  completed_at timestamptz,
  last_studied_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, curriculum_item_id)
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references public.certifications(id) on delete cascade,
  curriculum_item_id uuid references public.curriculum_items(id) on delete set null,
  pd_code text not null,
  macro_topic text,
  topic text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  cognitive_level text not null check (cognitive_level in ('knowledge', 'comprehension', 'application', 'analysis')),
  question_type text not null check (question_type in ('multiple_choice', 'case', 'dialog_tree')),
  context text,
  question text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  explanation text not null,
  why_others_are_wrong jsonb not null default '{}'::jsonb,
  official_sources jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  verified_at timestamptz,
  active boolean not null default true
);

create table public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  certification_id text not null references public.certifications(id),
  pd_code text not null,
  selected_answer text,
  is_correct boolean not null,
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  attempted_at timestamptz not null default now()
);

create table public.simulations (
  id uuid primary key default gen_random_uuid(),
  certification_id text not null references public.certifications(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('full', 'quick_10', 'quick_20', 'topic', 'weak_topics', 'custom')),
  question_count integer not null check (question_count > 0),
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  passing_score integer check (passing_score is null or passing_score >= 0),
  config jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.simulation_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  simulation_id uuid not null references public.simulations(id) on delete cascade,
  certification_id text not null references public.certifications(id),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  score integer check (score is null or score >= 0),
  passed boolean,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  notes text,
  unique (id, user_id)
);

create table public.simulation_answers (
  id uuid primary key default gen_random_uuid(),
  simulation_attempt_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_answer text,
  is_correct boolean,
  flagged_for_review boolean not null default false,
  notes text,
  answered_at timestamptz not null default now(),
  unique (simulation_attempt_id, question_id),
  foreign key (simulation_attempt_id, user_id) references public.simulation_attempts(id, user_id) on delete cascade
);

create table public.flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  certification_id text not null references public.certifications(id) on delete cascade,
  curriculum_item_id uuid references public.curriculum_items(id) on delete set null,
  pd_code text,
  front text not null,
  back text not null,
  source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.flashcard_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  flashcard_id uuid not null references public.flashcards(id) on delete cascade,
  rating text not null check (rating in ('again', 'hard', 'good', 'easy')),
  last_reviewed timestamptz not null default now(),
  next_review timestamptz not null,
  interval_days numeric(10,2) not null default 0 check (interval_days >= 0),
  ease numeric(6,3) not null default 2.5 check (ease > 0),
  created_at timestamptz not null default now()
);

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('curriculum', 'lesson', 'question', 'flashcard')),
  item_id uuid not null,
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  certification_id text not null references public.certifications(id),
  activity_type text not null default 'study' check (activity_type in ('study', 'lesson', 'questions', 'simulation', 'flashcards', 'review')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  metadata jsonb not null default '{}'::jsonb
);

create index curriculum_items_certification_idx on public.curriculum_items (certification_id, sort_order);
create index curriculum_items_parent_idx on public.curriculum_items (parent_id);
create index lesson_progress_user_idx on public.lesson_progress (user_id, last_studied_at desc);
create index question_attempts_user_idx on public.question_attempts (user_id, certification_id, attempted_at desc);
create index question_attempts_question_idx on public.question_attempts (question_id);
create index simulation_attempts_user_idx on public.simulation_attempts (user_id, certification_id, completed_at desc);
create index simulation_answers_user_idx on public.simulation_answers (user_id, simulation_attempt_id);
create index flashcards_user_idx on public.flashcards (user_id, certification_id);
create index flashcard_reviews_user_idx on public.flashcard_reviews (user_id, next_review);
create index bookmarks_user_idx on public.bookmarks (user_id, created_at desc);
create index study_sessions_user_idx on public.study_sessions (user_id, certification_id, started_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger certifications_set_updated_at before update on public.certifications for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger curriculum_items_set_updated_at before update on public.curriculum_items for each row execute function public.set_updated_at();
create trigger lesson_progress_set_updated_at before update on public.lesson_progress for each row execute function public.set_updated_at();
create trigger simulations_set_updated_at before update on public.simulations for each row execute function public.set_updated_at();
create trigger flashcards_set_updated_at before update on public.flashcards for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, current_certification)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(coalesce(new.email, 'Aluno'), '@', 1), 'Aluno'), 80),
    'CPA'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;

grant usage on schema public to authenticated;

alter table public.certifications enable row level security;
alter table public.profiles enable row level security;
alter table public.curriculum_items enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.questions enable row level security;
alter table public.question_attempts enable row level security;
alter table public.simulations enable row level security;
alter table public.simulation_attempts enable row level security;
alter table public.simulation_answers enable row level security;
alter table public.flashcards enable row level security;
alter table public.flashcard_reviews enable row level security;
alter table public.bookmarks enable row level security;
alter table public.study_sessions enable row level security;

revoke all on table public.certifications, public.profiles, public.curriculum_items, public.lesson_progress, public.questions, public.question_attempts, public.simulations, public.simulation_attempts, public.simulation_answers, public.flashcards, public.flashcard_reviews, public.bookmarks, public.study_sessions from anon, authenticated;

grant select on table public.certifications, public.curriculum_items, public.questions, public.simulations to authenticated;
grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.lesson_progress, public.question_attempts, public.simulation_attempts, public.simulation_answers, public.flashcards, public.flashcard_reviews, public.bookmarks, public.study_sessions to authenticated;

create policy certifications_authenticated_read on public.certifications
for select to authenticated using (true);

create policy curriculum_authenticated_read on public.curriculum_items
for select to authenticated using (true);

create policy questions_authenticated_read on public.questions
for select to authenticated using (true);

create policy simulations_authenticated_read on public.simulations
for select to authenticated using (true);

create policy profiles_select_own on public.profiles
for select to authenticated using ((select auth.uid()) = id);

create policy profiles_update_own on public.profiles
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy lesson_progress_select_own on public.lesson_progress
for select to authenticated using ((select auth.uid()) = user_id);
create policy lesson_progress_insert_own on public.lesson_progress
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy lesson_progress_update_own on public.lesson_progress
for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy lesson_progress_delete_own on public.lesson_progress
for delete to authenticated using ((select auth.uid()) = user_id);

create policy question_attempts_select_own on public.question_attempts
for select to authenticated using ((select auth.uid()) = user_id);
create policy question_attempts_insert_own on public.question_attempts
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy question_attempts_update_own on public.question_attempts
for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy question_attempts_delete_own on public.question_attempts
for delete to authenticated using ((select auth.uid()) = user_id);

create policy simulation_attempts_select_own on public.simulation_attempts
for select to authenticated using ((select auth.uid()) = user_id);
create policy simulation_attempts_insert_own on public.simulation_attempts
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy simulation_attempts_update_own on public.simulation_attempts
for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy simulation_attempts_delete_own on public.simulation_attempts
for delete to authenticated using ((select auth.uid()) = user_id);

create policy simulation_answers_select_own on public.simulation_answers
for select to authenticated using ((select auth.uid()) = user_id);
create policy simulation_answers_insert_own on public.simulation_answers
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy simulation_answers_update_own on public.simulation_answers
for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy simulation_answers_delete_own on public.simulation_answers
for delete to authenticated using ((select auth.uid()) = user_id);

create policy flashcards_select_public_or_own on public.flashcards
for select to authenticated using (user_id is null or (select auth.uid()) = user_id);
create policy flashcards_insert_own on public.flashcards
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy flashcards_update_own on public.flashcards
for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy flashcards_delete_own on public.flashcards
for delete to authenticated using ((select auth.uid()) = user_id);

create policy flashcard_reviews_select_own on public.flashcard_reviews
for select to authenticated using ((select auth.uid()) = user_id);
create policy flashcard_reviews_insert_own on public.flashcard_reviews
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy flashcard_reviews_update_own on public.flashcard_reviews
for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy flashcard_reviews_delete_own on public.flashcard_reviews
for delete to authenticated using ((select auth.uid()) = user_id);

create policy bookmarks_select_own on public.bookmarks
for select to authenticated using ((select auth.uid()) = user_id);
create policy bookmarks_insert_own on public.bookmarks
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy bookmarks_update_own on public.bookmarks
for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy bookmarks_delete_own on public.bookmarks
for delete to authenticated using ((select auth.uid()) = user_id);

create policy study_sessions_select_own on public.study_sessions
for select to authenticated using ((select auth.uid()) = user_id);
create policy study_sessions_insert_own on public.study_sessions
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy study_sessions_update_own on public.study_sessions
for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy study_sessions_delete_own on public.study_sessions
for delete to authenticated using ((select auth.uid()) = user_id);

commit;
