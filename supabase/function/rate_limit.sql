-- ============================================================
-- Rate limiting для Edge Functions + закриття прямого запису скарг
-- Запустити в Supabase -> SQL Editor ПІСЛЯ supabase_schema.sql
-- ============================================================

-- 1. Лічильники запитів. Ключ знеособлений (HMAC від IP із секретною сіллю
--    та датою), самі IP-адреси не зберігаються.
create table if not exists public.rate_limits (
  key          text        not null,
  window_start timestamptz not null,
  count        int         not null default 0,
  primary key (key, window_start)
);

alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;

-- 2. Атомарна перевірка ліміту. true = запит дозволено.
create or replace function public.check_rate_limit(
  p_key text, p_limit int, p_window_seconds int
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  w timestamptz;
  c int;
begin
  w := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  insert into public.rate_limits (key, window_start, count)
  values (p_key, w, 1)
  on conflict (key, window_start)
  do update set count = public.rate_limits.count + 1
  returning count into c;
  return c <= p_limit;
end;
$$;

revoke all on function public.check_rate_limit(text, int, int) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, int, int) to service_role;

-- 3. Тепер скарги й зворотний зв'язок приймає лише Edge Function (service_role).
--    Прибираємо прямий запис для anon, щоб ліміт не можна було обійти.
drop policy if exists "anyone can submit report"   on public.corruption_reports;
drop policy if exists "anyone can send feedback"   on public.feedback_messages;
revoke insert on public.corruption_reports from anon, authenticated;
revoke insert on public.feedback_messages  from anon, authenticated;

-- 4. Очищення старих лічильників (потрібен pg_cron; розкоментувати за наявності)
-- select cron.schedule('purge-rate-limits', '30 3 * * *',
--   $$ delete from public.rate_limits where window_start < now() - interval '1 day' $$);
