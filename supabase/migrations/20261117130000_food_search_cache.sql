-- AI 음식 검색 결과 저장.
-- 같은 검색어가 다시 오면 OpenAI를 부르지 않고 여기 저장된 결과를 돌려줘요(AI 토큰 절약).
-- 모든 사용자가 함께 쓰는 표라서, food-search 함수만(서버 전용 키로) 읽고 써요.
-- 앱(로그인 토큰)에서는 읽지도 쓰지도 못해요: RLS를 켜고 정책을 하나도 만들지 않아요.

create table public.food_search_cache (
  -- 정리한 검색어(앞뒤 공백 제거, 공백 하나로, 한글 NFC, 영어 소문자)
  query_key text not null check (char_length(query_key) between 1 and 50),
  -- 검색 지시문 번호. 지시문을 고치면 번호를 올려서 예전 결과를 쓰지 않아요.
  prompt_version integer not null,
  -- 앱에 돌려주는 모양 그대로: { status, candidates, suggestions }
  result jsonb not null,
  -- 저장한 때. 30일이 지나면 다음 검색 때 AI로 다시 찾아 덮어써요.
  created_at timestamptz not null default now(),
  primary key (query_key, prompt_version)
);

alter table public.food_search_cache enable row level security;

-- 정책이 없어서 로그인 사용자·비로그인 사용자 모두 막혀요. 권한도 한 번 더 거둬요.
revoke all on table public.food_search_cache from anon, authenticated;
