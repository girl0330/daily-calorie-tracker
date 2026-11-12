-- 4단계: 사용자별 하루 목표
-- Supabase 대시보드 > SQL Editor에 붙여 넣고 Run 하면 돼요. (한 번만 실행)

create table public.user_goals (
  -- 사용자 한 명당 목표는 하나라서 user_id를 그대로 기본 키로 써요.
  -- 계정이 지워지면 목표도 같이 지워져요(on delete cascade).
  user_id uuid primary key references auth.users (id) on delete cascade,

  kcal integer not null check (kcal between 800 and 5000),
  carbs_g integer not null check (carbs_g between 0 and 800),
  protein_g integer not null check (protein_g between 0 and 400),
  fat_g integer not null check (fat_g between 0 and 300),

  -- 'kcal': 칼로리와 비율로 정함 / 'nut': 탄·단·지 g으로 직접 정함
  mode text not null check (mode in ('kcal', 'nut')),

  -- 칼로리로 정했을 때만 비율(%)을 저장해요. 세 값의 합은 100이어야 해요.
  ratio_carbs smallint check (ratio_carbs between 0 and 100),
  ratio_protein smallint check (ratio_protein between 0 and 100),
  ratio_fat smallint check (ratio_fat between 0 and 100),
  constraint user_goals_ratio_check check (
    (mode = 'nut' and ratio_carbs is null and ratio_protein is null and ratio_fat is null)
    or (mode = 'kcal' and ratio_carbs + ratio_protein + ratio_fat = 100)
  ),

  updated_at timestamptz not null default now()
);

-- RLS: 로그인한 사용자는 자기 목표만 읽고 쓸 수 있어요.
alter table public.user_goals enable row level security;

create policy "본인 목표 읽기" on public.user_goals
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "본인 목표 만들기" on public.user_goals
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "본인 목표 수정" on public.user_goals
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "본인 목표 삭제" on public.user_goals
  for delete to authenticated
  using ((select auth.uid()) = user_id);
