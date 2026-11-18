// Node.js 24 이상: node --test tests/weeklyReport.test.mjs
// 앱의 확장자 없는 TS import를 Node의 내장 타입 제거 실행에 연결한다.
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import assert from 'node:assert/strict';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('.') && context.parentURL) {
      const url = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(fileURLToPath(url))) return nextResolve(url.href, context);
    }
    return nextResolve(specifier, context);
  },
});

const { getWeekRange } = await import('../src/utils/date.ts');
const { getWeeklyReport, getReportSignature, getCalorieRatio, getWeekOfMonth } = await import(
  '../src/features/tracker/utils/weeklyReport.ts'
);

const food = (overrides = {}) => ({
  id: 1, userId: 'test-user', mealType: 'breakfast', foodName: '예시 음식',
  carbs: 10, protein: 5, fat: 2,
  recordDate: '2026-10-19', createdAt: '2026-10-29T00:00:00Z',
  ...overrides,
});

test('월요일과 일요일은 같은 월~일 범위에 속하고 원본 날짜는 유지된다', () => {
  const date = new Date(2026, 9, 25, 23, 59);
  const before = date.getTime();
  const week = getWeekRange(date);
  assert.equal(week.startDate, '2026-10-19');
  assert.equal(week.endDate, '2026-10-25');
  assert.equal(week.dates.length, 7);
  assert.equal(new Set(week.dates).size, 7);
  assert.deepEqual(week, getWeekRange(new Date(2026, 9, 19)));
  assert.equal(date.getTime(), before);
});

test('연말과 윤년의 날짜 경계를 처리한다', () => {
  const year = getWeekRange(new Date(2027, 0, 1));
  assert.equal(year.startDate, '2026-12-28');
  assert.equal(year.endDate, '2027-01-03');
  const leap = getWeekRange(new Date(2024, 1, 29));
  assert.equal(leap.startDate, '2024-02-26');
  assert.equal(leap.endDate, '2024-03-03');
  assert.ok(leap.dates.includes('2024-02-29'));
});

test('DST 전환 주에도 연속된 7일을 반환한다', () => {
  const week = getWeekRange(new Date(2026, 2, 8));
  assert.deepEqual(week.dates, [
    '2026-03-02', '2026-03-03', '2026-03-04', '2026-03-05',
    '2026-03-06', '2026-03-07', '2026-03-08',
  ]);
  assert.equal(getWeekRange(new Date(2026, 10, 1)).endDate, '2026-11-01');
});

test('유효하지 않은 Date는 명시적으로 거절한다', () => {
  assert.throws(() => getWeekRange(new Date('invalid')), RangeError);
});

test('기록이 없어도 7일을 반환하고 평균은 0이다', () => {
  const report = getWeeklyReport([], new Date(2026, 9, 21));
  assert.equal(report.recordedDays, 0);
  assert.equal(report.totalCalories, 0);
  assert.equal(report.averageCalories, 0);
  assert.deepEqual(report.nutrients, { carbs: 0, protein: 0, fat: 0 });
  assert.equal(report.days.length, 7);
  assert.ok(report.days.every(day => !day.hasRecord && day.calories === 0));
  assert.deepEqual(Object.keys(report.mealNutrients).sort(), ['breakfast', 'dinner', 'lunch']);
});

test('주 경계 포함, 범위 밖 제외, 날짜별·시간대별 합계와 평균을 계산한다', () => {
  const foods = [
    food(),
    food({ id: 2, mealType: 'lunch', carbs: 20, protein: 10, fat: 4 }),
    food({ id: 3, mealType: 'dinner', recordDate: '2026-10-25', carbs: 30, protein: 15, fat: 6 }),
    food({ id: 4, recordDate: '2026-10-18', carbs: 999 }),
    food({ id: 5, recordDate: '2026-10-26', carbs: 999 }),
  ];
  const before = structuredClone(foods);
  const report = getWeeklyReport(foods, new Date(2026, 9, 21));
  assert.equal(report.recordedDays, 2);
  assert.deepEqual(report.nutrients, { carbs: 60, protein: 30, fat: 12 });
  assert.equal(report.totalCalories, 468);
  assert.equal(report.days[0].calories, 234);
  assert.equal(report.days[6].calories, 234);
  assert.equal(report.days.reduce((sum, day) => sum + day.calories, 0), 468);
  // 평균은 기록한 날(2일)로만 나눠요.
  assert.equal(report.averageCalories, 234);
  assert.deepEqual(report.mealNutrients, {
    breakfast: { carbs: 10, protein: 5, fat: 2 },
    lunch: { carbs: 20, protein: 10, fat: 4 },
    dinner: { carbs: 30, protein: 15, fat: 6 },
  });
  assert.deepEqual(foods, before);
});

test('0kcal 기록도 기록한 날로 센다', () => {
  const report = getWeeklyReport([food({ carbs: 0, protein: 0, fat: 0 })], new Date(2026, 9, 21));
  assert.equal(report.recordedDays, 1);
  assert.equal(report.days[0].hasRecord, true);
  assert.equal(report.days[1].hasRecord, false);
  assert.equal(report.averageCalories, 0);
});

test('탄·단·지 칼로리 비중은 합이 100이고, 기록이 없으면 모두 0이다', () => {
  // 탄 50g(200kcal), 단 30g(120kcal), 지 20g(180kcal) → 40%, 24%, 36%
  assert.deepEqual(getCalorieRatio({ carbs: 50, protein: 30, fat: 20 }), { carbs: 40, protein: 24, fat: 36 });
  // 반올림해도 합이 100이 되게 지방에서 맞춰요.
  const ratio = getCalorieRatio({ carbs: 1, protein: 1, fat: 1 });
  assert.equal(ratio.carbs + ratio.protein + ratio.fat, 100);
  assert.deepEqual(getCalorieRatio({ carbs: 0, protein: 0, fat: 0 }), { carbs: 0, protein: 0, fat: 0 });
});

test('리포트 서명값은 하루 칼로리나 목표가 바뀌면 달라지고, 음식 이름만 바뀌면 같다', () => {
  const day = new Date(2026, 9, 21);
  const goal = { kcal: 1900, carbs: 238, protein: 95, fat: 63 };
  const base = getReportSignature(getWeeklyReport([food()], day), goal);

  assert.equal(getReportSignature(getWeeklyReport([food({ foodName: '다른 이름' })], day), goal), base);
  assert.notEqual(getReportSignature(getWeeklyReport([food({ carbs: 20 })], day), goal), base);
  assert.notEqual(getReportSignature(getWeeklyReport([food()], day), { ...goal, kcal: 2000 }), base);
  assert.notEqual(getReportSignature(getWeeklyReport([food()], day), null), base);
});

test('몇째 주인지는 그 주 목요일이 든 달로 센다', () => {
  assert.deepEqual(getWeekOfMonth(new Date(2026, 10, 2)), { month: 11, week: 1 });
  assert.deepEqual(getWeekOfMonth(new Date(2026, 9, 26)), { month: 10, week: 5 });
});

test('소수 영양소는 집계 중 반올림하지 않는다', () => {
  const report = getWeeklyReport([food({ carbs: 0.1, protein: 0.2, fat: 0.3 })], new Date(2026, 9, 21));
  assert.ok(Math.abs(report.totalCalories - 3.9) < 1e-10);
  assert.equal(report.nutrients.protein, 0.2);
});
