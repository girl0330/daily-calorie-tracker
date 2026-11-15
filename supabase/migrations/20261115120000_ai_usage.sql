-- AI 기능 하루 사용 횟수.
-- 사람(user_id)마다, 날짜(한국 시간)마다, 기능(kind)마다 몇 번 썼는지 한 줄로 세요.
-- 예) 음식 검색은 kind = 'food_search'. 나중에 주간 리포트도 같은 표를 써요.

create table public.ai_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  usage_date date not null,
  kind text not null,
  count integer not null default 0,
  primary key (user_id, usage_date, kind)
);

-- 본인 줄만 읽을 수 있어요. 직접 넣거나 고치는 건 막고, 아래 함수로만 늘려요.
alter table public.ai_usage enable row level security;

create policy "본인 AI 사용량만 읽기"
  on public.ai_usage
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- 오늘 횟수를 1 늘리고, 한도 안이면 true를 돌려줘요. 이미 한도에 닿았으면 늘리지 않고 false예요.
-- 한 번의 SQL로 세고 늘려서, 동시에 여러 번 불러도 한도를 넘지 않아요.
-- security definer: 사용자가 표를 직접 고칠 수 없어도 이 함수는 고칠 수 있어요. 대신 늘 auth.uid() 본인 줄만 다뤄요.
create or replace function public.use_ai_quota(p_kind text, p_limit integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_count integer;
begin
  if v_user is null then
    return false;
  end if;

  insert into public.ai_usage as usage (user_id, usage_date, kind, count)
  values (v_user, (now() at time zone 'Asia/Seoul')::date, p_kind, 1)
  on conflict (user_id, usage_date, kind)
  do update set count = usage.count + 1
    where usage.count < p_limit
  returning usage.count into v_count;

  return v_count is not null;
end;
$$;

-- 로그인한 사용자만 부를 수 있어요.
revoke all on function public.use_ai_quota(text, integer) from public, anon;
grant execute on function public.use_ai_quota(text, integer) to authenticated;
