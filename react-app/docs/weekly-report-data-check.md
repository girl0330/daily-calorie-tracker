# 주간 조회·집계 직접 확인

이번 단계는 화면 추가 전이다. 아래 확인은 예시 배열이 아니라 로그인 계정의 실제 DB 기록을 읽는다.
Console에서 실행하는 코드는 조회·계산만 하고 DB를 변경하지 않는다.

## 1. 변경 가져오기

수정 중인 파일이 없는지 `git status`로 확인한 뒤 저장소에서 실행한다.

```powershell
git fetch origin
git switch feat/weekly-report-data
```

이미 이 브랜치를 로컬에 만든 적이 있다면 다음 명령으로 최신 변경까지 반영한다.

```powershell
git merge --ff-only origin/feat/weekly-report-data
```

`react-app` 폴더에서 실행한다. 의존성은 기존과 같으므로 설치되어 있다면 다시 설치할 필요는 없다.

```powershell
node --test tests/weeklyReport.test.mjs tests/weeklyReportData.test.mjs
npm run lint
npm run build
npm run dev
```

## 2. 실제 기록 조회

Vite 터미널이 표시한 로컬 주소로 접속하고 본인의 계정으로 로그인한다.
F12 → Console에서 아래 코드를 실행한다. 배포 사이트에서는 이 경로로 TS 파일을 불러올 수 없다.

```js
var { supabase } = await import('/src/lib/supabase.ts');
var { getFoodsByPeriodApi } = await import('/src/features/foods/services/FoodService.ts');
var { getWeekRange } = await import('/src/utils/date.ts');
var { getWeeklyReport } = await import('/src/features/tracker/utils/weeklyReport.ts');

var inspectWeek = async function (date = new Date()) {
  var auth = await supabase.auth.getUser();
  if (auth.error) throw auth.error;
  if (!auth.data.user) throw new Error('먼저 로그인해 주세요.');

  var week = getWeekRange(date);
  var foods = await getFoodsByPeriodApi(auth.data.user.id, week.startDate, week.endDate);
  var result = getWeeklyReport(foods, date);

  console.log('조회 기간:', week.startDate, '~', week.endDate);
  console.table(foods);
  console.log('주간 집계:', result);
  console.table(result.days);
  console.table(result.meals);
  return result;
};

var report = await inspectWeek();
```

변수 선언 뒤의 `undefined`는 정상이다. 출력된 표와 '주간 집계' 객체를 확인한다.
페이지를 새로고침하면 Console의 함수·변수가 사라지므로 위 준비 코드를 다시 실행한다.
로그인 사용자 ID나 인증 토큰을 채팅에 전달할 필요는 없다.

## 3. 확인할 사례

- **기록이 있는 주:** 일간 화면의 음식 날짜·영양소와 `foods` 표가 같은지 비교한다. 주간 합계는 탄수화물×4 + 단백질×4 + 지방×9 기준이다.
- **다른 주:** `await inspectWeek(new Date(2026, 9, 19))`로 2026년 10월 19일이 포함된 주를 조회한다. 월은 0부터 시작한다. 실제 기록이 있는 날짜로 바꿔도 된다. 반환 음식의 날짜가 해당 주 안에 있어야 한다.
- **기록 없는 주:** `recordedDays`와 `totalCalories`는 0, 7일 모두 `hasRecord: false`, 식사별 `caloriePercentage`는 null이어야 한다.
- **0 kcal 기록:** 실제로 0g 음식이 저장된 날짜가 있다면 칼로리는 0이어도 그날의 `hasRecord`는 true여야 한다.
- **기록 수정 후:** 기존 일간 화면에서 본인이 확인용 기록을 추가·수정·삭제했다면 `await inspectWeek(같은_기준_날짜)`를 다시 실행해 변경이 반영되는지 확인한다. Console 재조회는 매번 DB를 읽으므로 캐시 무효화 자체를 확인하는 검사는 아니다.
- **로그인 계정 변경:** 다른 계정으로 로그인한 뒤 다시 실행하면 그 계정의 기록만 조회되어야 한다. 이 부분은 실제 DB의 RLS 설정을 포함한 수동 확인이다.

Network 탭에서는 `foods` 요청에 `user_id`, 날짜 조건(`or`), `order=id.asc`, `offset`, `limit`이 포함되는지 확인할 수 있다.
`record_date`가 null인 기존 기록은 기존 화면과 같은 로컬 날짜 기준으로 `created_at`을 보정한다. DB 원본을 수정하는 처리는 없다.

## 4. 화면 연결 준비 상태

새 `useWeeklyReport(userId, selectedDate)` 훅이 기간 조회를 수행하고 기존 `getWeeklyReport()`로 집계한 결과를 `data`로 제공한다.
화면은 다음 단계에서 이 훅의 `data`, `isPending`, `isError`, `error`, `refetch` 등을 사용하면 된다.
훅은 React 컴포넌트 안에서 사용하며 Console에서 직접 호출하지 않는다.

사용자·기간별 조회 키는 `['foods', userId, 'period', startDate, endDate]`다.
기존 음식 추가·수정·삭제의 사용자 키 무효화가 기간 키에도 적용된다.
활성 조회는 다시 가져오고, 비활성 조회는 오래된 데이터로 표시되어 다시 사용될 때 갱신된다.
이 연결은 실제 QueryClient와 기존 mutation 훅을 사용하는 자동 테스트로 확인했다.
아직 주간 화면이 없으므로, 화면 이동 후 갱신되는 동작은 화면 구현 단계에서 다시 확인한다.

## 검증 범위

자동 테스트는 HTTP 응답을 대체해 실제 Supabase SDK의 요청 조건, 페이지 수집, 오류 전달, 날짜 보정과 QueryClient 연결을 확인한다.
실제 Supabase 프로젝트의 데이터·접근 권한·RLS는 이 테스트에서 검증하지 않으므로 위 로그인 후 조회 확인이 필요하다.
