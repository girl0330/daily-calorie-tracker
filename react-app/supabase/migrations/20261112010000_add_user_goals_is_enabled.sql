-- 4단계: 목표 칼로리 설정 켜기/끄기
-- 끄면(false) 목표 관련 기능(목표, 남은 칼로리, 달성률)을 모두 보여 주지 않아요.
-- 저장해 둔 목표는 지우지 않고 남겨 둬서, 다시 켜면 그대로 돌아와요.
-- 기본은 꺼짐이에요. 이미 저장된 목표도 꺼진 상태로 시작해요.
-- Supabase 대시보드 > SQL Editor에 붙여 넣고 Run 하면 돼요. (한 번만 실행)

alter table public.user_goals
  add column is_enabled boolean not null default false;
