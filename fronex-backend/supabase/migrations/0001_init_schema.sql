-- ============================================================
-- FRONEX — Migração Inicial do Banco de Dados (Supabase/Postgres)
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. PROFILES — usuários autenticados (25 tokens/dia)
-- ============================================================
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text,
  email           text unique,
  daily_tokens    integer not null default 25,
  tokens_reset_at date not null default current_date,
  discount_badge  jsonb not null default '{}'::jsonb, -- ex: {"code":"WELCOME10","percent":10,"expires_at":"2026-08-01"}
  preferences     jsonb not null default '{}'::jsonb,
  total_messages  integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.profiles is
  'Perfis de usuários autenticados. Visitantes não autenticados usam public.anon_sessions.';

-- ============================================================
-- 1b. ANON_SESSIONS — visitantes não autenticados (5 tokens/dia)
-- Identificados por um session_id (UUID) gerado no cliente e
-- guardado em cookie/localStorage.
-- ============================================================
create table if not exists public.anon_sessions (
  session_id      uuid primary key default uuid_generate_v4(),
  fingerprint     text, -- hash opcional de IP + user-agent (anti-abuso)
  daily_tokens    integer not null default 5,
  tokens_reset_at date not null default current_date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- 2. SERVICE_INQUIRIES — histórico de orçamentos/simulações
-- ============================================================
create table if not exists public.service_inquiries (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid references public.profiles(id) on delete set null,
  session_id        uuid references public.anon_sessions(session_id) on delete set null,
  service_type      text not null, -- 'website' | 'ecommerce' | 'app_mobile' | 'sistema_gestao' | 'identidade_visual'
  answers           jsonb not null default '{}'::jsonb,   -- respostas do questionário
  complexity_score  numeric(5,2) not null default 0,
  base_price        numeric(12,2) not null,
  final_price       numeric(12,2) not null,
  currency          text not null default 'AOA',
  whatsapp_link     text,
  client_name       text,
  client_phone      text,
  status            text not null default 'pending', -- pending | contacted | closed | expired
  created_at        timestamptz not null default now()
);

create index if not exists idx_service_inquiries_user    on public.service_inquiries(user_id);
create index if not exists idx_service_inquiries_session on public.service_inquiries(session_id);
create index if not exists idx_service_inquiries_status  on public.service_inquiries(status);

-- ============================================================
-- 3. CHAT_LOGS — histórico de mensagens (Fronex AI + Mentores)
-- ============================================================
create table if not exists public.chat_logs (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references public.profiles(id) on delete cascade,
  session_id     uuid references public.anon_sessions(session_id) on delete cascade,
  context_type   text not null default 'chat', -- 'chat' | 'mentor'
  mentor_persona text, -- 'financas' | 'marketing_tiktok' | 'burocracia' (null quando context_type = 'chat')
  role           text not null, -- 'user' | 'assistant' | 'system'
  content        text not null,
  tokens_used    integer not null default 0,
  model          text, -- ex: 'llama3-70b-8192'
  created_at     timestamptz not null default now()
);

create index if not exists idx_chat_logs_user    on public.chat_logs(user_id, created_at desc);
create index if not exists idx_chat_logs_session on public.chat_logs(session_id, created_at desc);
create index if not exists idx_chat_logs_context on public.chat_logs(context_type, mentor_persona);

-- ============================================================
-- TRIGGER: cria profile automaticamente no signup (25 tokens)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, daily_tokens)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    25
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- FUNÇÃO: reset diário de tokens (chamada pela API antes de
-- verificar/deduzir tokens — idempotente e segura contra fuso horário)
-- ============================================================
create or replace function public.reset_daily_tokens_if_needed(
  p_user_id uuid default null,
  p_session_id uuid default null
)
returns void as $$
begin
  if p_user_id is not null then
    update public.profiles
       set daily_tokens = 25, tokens_reset_at = current_date, updated_at = now()
     where id = p_user_id and tokens_reset_at < current_date;
  elsif p_session_id is not null then
    update public.anon_sessions
       set daily_tokens = 5, tokens_reset_at = current_date, updated_at = now()
     where session_id = p_session_id and tokens_reset_at < current_date;
  end if;
end;
$$ language plpgsql security definer;

-- Alternativa: agendamento diário via pg_cron (extensão habilitável no
-- painel Supabase > Database > Extensions), caso prefira reset centralizado:
-- select cron.schedule('reset-tokens-daily', '0 0 * * *', $$
--   update public.profiles set daily_tokens = 25, tokens_reset_at = current_date where tokens_reset_at < current_date;
--   update public.anon_sessions set daily_tokens = 5, tokens_reset_at = current_date where tokens_reset_at < current_date;
-- $$);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles          enable row level security;
alter table public.anon_sessions     enable row level security;
alter table public.service_inquiries enable row level security;
alter table public.chat_logs         enable row level security;

-- profiles: cada usuário vê/edita apenas o próprio perfil
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- anon_sessions: só o backend (service_role) acessa — nunca exposto ao cliente
create policy "anon_sessions_service_only" on public.anon_sessions
  for all using (auth.role() = 'service_role');

-- service_inquiries: usuário vê os próprios orçamentos; escrita via API (service_role)
create policy "inquiries_select_own" on public.service_inquiries
  for select using (auth.uid() = user_id or auth.role() = 'service_role');
create policy "inquiries_insert_service" on public.service_inquiries
  for insert with check (auth.role() = 'service_role');

-- chat_logs: usuário vê o próprio histórico; escrita via API (service_role)
create policy "chat_logs_select_own" on public.chat_logs
  for select using (auth.uid() = user_id or auth.role() = 'service_role');
create policy "chat_logs_insert_service" on public.chat_logs
  for insert with check (auth.role() = 'service_role');
