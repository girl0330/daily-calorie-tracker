-- AI 주간 리포트.
-- 사람(user_id)마다, 주(week_start = 그 주 월요일)마다 리포트 하나만 남겨요. 다시 만들면 덮어써요.
-- 리포트는 weekly-report 함수가 만들어 저장해요(함수는 로그인한 사용자 본인으로 저장해요).

create table public.weekly_reports (
  user_id uuid not null references auth.users (id) on delete cascade,
  week_start date not null,
  -- 맨 위 한두 문장 요약
  lead text not null,
  -- 잘한 점·아쉬운 점·다음에 해볼 것 (각각 1~3줄)
  good text[] not null default '{}',
  bad text[] not null default '{}',
  next text[] not null default '{}',
  -- 리포트 말투. soft = 다정하게 (짧고 간단하게는 세 번째 PR에서 추가해요)
  tone text not null default 'soft',
  -- 만들 때의 기록·목표 서명값. 앱이 지금 값과 비교해서 '바뀜 안내'를 보여 줘요.
  signature text not null,
  -- 만들 때 기록한 날 수
  recorded_days integer not null check (recorded_days between 1 and 7),
  created_at timestamptz not null default now(),
  primary key (user_id, week_start),
  -- week_start는 월요일이어야 해요(ISO 요일 1 = 월요일).
  check (extract(isodow from week_start) = 1)
);

-- 본인 리포트만 읽고, 넣고, 덮어쓸 수 있어요.
alter table public.weekly_reports enable row level security;

create policy "본인 주간 리포트만 읽기"
  on public.weekly_reports
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "본인 주간 리포트만 넣기"
  on public.weekly_reports
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "본인 주간 리포트만 덮어쓰기"
  on public.weekly_reports
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
