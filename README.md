# 하루 칼로리 기록 (Daily Calorie Tracker)

먹은 음식을 아침·점심·저녁으로 기록하면 하루·주간·월간 칼로리와 탄수화물·단백질·지방을 보여 주고,
AI가 음식의 영양 정보를 추정하고 한 주 기록을 정리해 주는 웹 앱입니다.

**배포 주소: [calorie.showit.kr](https://calorie.showit.kr)** · 로그인하지 않아도 화면을 둘러볼 수 있어요.

<!--
  대표 이미지: 데스크톱과 모바일 화면을 나란히 놓은 이미지 한 장 (반응형을 한눈에 보여 주기)
  <img src="docs/images/hero.png" alt="데스크톱과 모바일 화면" width="800">
-->
[대표 이미지: 데스크톱 + 모바일 나란히]

<br>

## 주요 기능

<!--
  캡처 칸 채우는 법: 이미지를 docs/images/ 폴더에 넣고, 그 칸의 [캡처]·[GIF]를 아래처럼 바꾼다.
  <img src="docs/images/daily.png" width="300">
  PC와 모바일 두 장을 넣는 칸은 모바일을 절반 폭으로 해야 높이가 비슷해진다.
  <img src="docs/images/drag-desktop.gif" width="260"> <img src="docs/images/drag-mobile.gif" width="120">
-->

| 기능 | 설명 | 캡처 |
| --- | --- | --- |
| 하루 기록 | 아침·점심·저녁 표에 음식을 넣고, 표 안에서 바로 고치고 지웁니다. 위 4칸에 그날 칼로리·탄·단·지 합계를, 목표가 켜져 있으면 남은 kcal과 달성률도 보여 줍니다. | <img width="1280" height="764" alt="image" src="https://github.com/user-attachments/assets/4827172a-f650-476f-9f2e-f42c34749a3d" />
|
| 끌어서 시간대 옮기기 | PC는 수정 중인 줄의 손잡이를 끌거나 위·아래 화살표 키로 옮기고, 모바일은 줄을 꾹 눌러 끌면 바로 저장됩니다. | [GIF: PC / 모바일] |
| AI 음식 검색 | 검색어를 넣으면 AI가 후보를 최대 3개 보여 줍니다. 고르면 입력칸에 값이 채워지고 '추가'로 저장합니다. '빵'처럼 넓은 검색어에는 더 자세한 검색어 예시를 보여 줍니다. | [GIF: 검색 → 추가] |
| 월간 달력 | 날짜 칸마다 그날 kcal과 탄·단·지를 보여 주고, 지금 설정한 목표를 함께 보여 줍니다. PC는 날짜를 누르면 그날 기록으로, 모바일은 아래에서 올라오는 창으로 요약을 봅니다. | [캡처: PC / 모바일] |
| 주간 리포트 | 기록한 날·총 칼로리·하루 평균·목표 넘은 날 4칸, 요일별 칼로리 막대와 목표 점선, 영양소·칼로리 비율·시간대별 세 칸을 보여 줍니다. | [캡처] |
| AI 주간 리포트 | 버튼을 누르면 AI가 그 주를 요약, 잘한 점, 아쉬운 점, 다음에 해볼 것으로 정리합니다. 만든 뒤 하루 칼로리나 목표가 바뀌면 안내를 띄웁니다. | [캡처] |
| 하루 목표 | kcal + 비율(균형·고단백·저탄수) 또는 탄·단·지 g으로 정합니다. 끄면 모든 화면에서 목표 관련 표시를 숨깁니다. | [캡처] |
| 로그인 없이 둘러보기 | 하루·월간·주간 화면은 로그인 없이 볼 수 있고, 기능을 누르면 로그인 안내창이 뜹니다. 로그인하면 보던 화면으로 돌아옵니다. | [GIF] |
| 계정 | 회원가입, 로그인, 비밀번호 찾기·재설정·바꾸기, 회원 탈퇴, 화면 테마(시스템·라이트·다크) | [캡처] |

<br>

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| 화면 | React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7, date-fns |
| 데이터·상태 | TanStack Query (서버 데이터), Zustand (로그인·테마·알림·로그인 안내창) |
| 서버 | Supabase (PostgreSQL, Auth, Edge Functions) |
| AI | OpenAI API (Edge Function에서만 호출) |
| 배포 | Vercel + 개인 도메인 |
| 품질 | ESLint, Prettier, Node 내장 테스트 (`npm test`, 18개) |

<br>

## 구조

```
브라우저 (React 앱, Vercel)
 ├─ 읽기·쓰기 ─────────────▶ Supabase DB · Auth
 │                             (음식 기록, 하루 목표, 주간 리포트)
 └─ 함수 호출 ──▶ Supabase Edge Functions
                  ├ food-search    : AI 음식 검색 ──▶ OpenAI API
                  │                  (+ food_search_cache 표에 30일 저장)
                  ├ weekly-report  : AI 주간 리포트 ──▶ OpenAI API
                  └ delete-account : 회원 탈퇴
```

- OpenAI 키와 모델 이름은 Supabase Secrets에서만 읽습니다. 브라우저 코드에는 없습니다.
- 세 함수 모두 먼저 로그인 토큰을 확인합니다.
- 주간 리포트 함수는 앱에서 어느 주인지만 받고, 기록과 목표는 DB에서 직접 읽어 AI에게 보냅니다.

<br>

## 폴더 구조

```
daily-calorie-tracker/
├─ react-app/
│  ├─ src/
│  │  ├─ pages/         # 화면 (daily-tracker, monthly-tracker, weekly-report, mypage, user)
│  │  ├─ features/      # 기능별 부품·훅·서비스 (foods, goals, tracker)
│  │  ├─ components/    # 공통 부품 (Button, GuestGuard, Nav 등)
│  │  ├─ store/         # Zustand
│  │  ├─ hooks/         # useLogout
│  │  ├─ service/       # 계정 API
│  │  ├─ lib/           # Supabase 연결
│  │  └─ utils/         # 날짜·계산·숫자 표시·입력 검사
│  └─ tests/            # 주간 리포트 집계·기간 조회 테스트
├─ supabase/
│  ├─ functions/        # food-search, weekly-report, delete-account, _shared
│  └─ migrations/       # DB 표 정의 (음식 기록·사용자 정보·목표·AI 사용량·주간 리포트·검색 결과)
└─ docs/                # 버전별 설명 (v1, v2)
```

<br>

## 로컬에서 실행하기

```bash
cd react-app
npm install
```

Supabase 프로젝트의 SQL Editor에서 `supabase/migrations/`의 SQL 파일을 파일 이름 순서대로 한 번씩 실행해 표를 만듭니다.

`react-app/.env.local` 파일을 만들고 Supabase 프로젝트 값을 넣습니다.

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

```bash
npm run dev     # 개발 서버
npm test        # 테스트 (Node.js 24 이상)
npm run build   # 배포용 빌드
```

AI 기능은 Supabase Secrets에 `OPENAI_API_KEY`, `OPENAI_MODEL`을 넣고 Edge Functions를 배포해야 동작합니다.

<br>

## 문제 해결 기록

### 1. AI 답을 그대로 믿지 않기
AI 음식 검색은 Edge Function에서 OpenAI를 부릅니다(키는 Supabase Secrets에만 둠).
AI 답은 모양이 어긋나거나 숫자가 앱 규칙을 벗어날 수 있어서, 앱에 보내기 전에 서버에서 한 번 더 정리합니다.

- JSON 스키마(strict)로 답의 모양과 결과 종류(ok·too_broad·not_food)를 고정합니다.
- 영양소가 숫자가 아니면 0으로, 범위를 넘으면 0~999.9g·소수점 한 자리로 맞춥니다. 후보는 최대 3개, 이름은 40자까지만 씁니다.
- 결과 종류와 내용이 어긋나면 내용에 맞춰 바로잡습니다. ok인데 후보가 없거나 too_broad인데 예시 검색어가 없으면 not_food로 봅니다.
- 저장해 둔 검색 결과를 꺼낼 때도 같은 정리를 한 번 더 거칩니다.

→ `supabase/functions/food-search/index.ts`의 `clampGram`·`toCandidates`·`toSearchResult`, `supabase/functions/_shared/openai.ts`

### 2. 같은 검색어는 AI를 다시 부르지 않기
검색어를 정리(공백·한글 NFC·영어 소문자)한 뒤 정확히 같은 검색어면, 30일 안에 저장된 결과를 돌려줍니다.
지시문 번호를 함께 저장해서 지시문을 고치면 예전 결과를 쓰지 않습니다.
모든 사용자가 함께 쓰는 표라서 RLS를 켜고 정책을 두지 않아, 서버 함수만 읽고 씁니다.
→ `supabase/functions/food-search/index.ts`, `supabase/migrations/20261117130000_food_search_cache.sql`

### 3. kcal 목표와 탄·단·지 g이 서로 맞지 않는 문제
1,500kcal을 50:20:30으로 나눠 g을 반올림하면 188g·75g·50g이고, 다시 더하면 1,502kcal입니다.
칼로리로 정할 때도 저장하는 kcal을 반올림한 g의 합으로 해서, 목표의 kcal과 g이 늘 같은 값을 가리키게 했습니다.
→ `react-app/src/features/goals/components/GoalEditor.tsx`, `react-app/src/features/goals/utils/goalCalc.ts`

### 4. 로그인하지 않아도 둘러보기
예전에는 로그인하지 않으면 모든 화면이 로그인 화면으로 넘어갔습니다.
기능 영역을 `GuestGuard`로 감싸 누르거나 입력하는 동작만 막고 로그인 안내창을 띄웁니다.
이벤트를 먼저 받는(capture) 방식이라 안쪽 부품은 고치지 않았습니다.
→ `react-app/src/components/common/GuestGuard.tsx`, `react-app/src/pages/user/Login.tsx`

<br>

## 버전 기록

| 버전 | 기간 | 내용 |
| --- | --- | --- |
| V1 | 2026.03.11 ~ 03.15 | Vanilla JS + localStorage MVP · [자세히](./docs/v1.md) |
| V2 | 2026.03 ~ 2026.10 | `react-app` 폴더에 React + TypeScript + Tailwind 프로젝트를 새로 구성해 기능을 다시 구현하고 Supabase 로그인·DB를 연결함, 반응형·입력 검증·오류 처리 · [자세히](./docs/v2.md) |
| V3 | 2026.11 | 디자인 토큰·다크 모드, 하루 목표, 화면 재설계, AI 음식 검색·주간 리포트, 검색 결과 저장, 회원 탈퇴, 로그인 없이 둘러보기 |

<br>

## 남은 과제

- AI 사용량 제한 다시 걸기 (지금은 횟수 제한 없음. `ai_usage` 표와 `use_ai_quota` 함수는 DB에 남아 있음)
- 목표 계산·입력 검사·서버 함수 테스트 추가
