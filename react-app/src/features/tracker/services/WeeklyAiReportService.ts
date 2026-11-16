import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MEAL_LABEL } from '../../foods/utils/foodForm';
import type { Goal } from '../../goals/types';
import type { MealType, UserId } from '../../../types/types';
import { formatInteger } from '../../../utils/formatNumber';
import { getCalorieRatio, getReportSignature, type WeeklyReport } from '../utils/weeklyReport';

/** AI가 정리한 한 주의 리포트 */
export type AiWeeklyReport = {
  /** 맨 위 한두 문장 요약 */
  lead: string;
  good: string[];
  bad: string[];
  next: string[];
  /** 만든 때(ISO 문자열) */
  createdAt: string;
  /** 리포트를 만들 때 기록한 날 수 */
  recordedDays: number;
  /** 만들 때의 기록·목표 서명값. 지금 값과 다르면 '바뀜 안내'를 보여 줘요. */
  signature: string;
};

/*
 * 8단계 뒷부분 첫 PR: 화면을 먼저 완성하려고 쓰는 예시 리포트예요.
 * 두 번째 PR에서 weekly_reports 표와 weekly-report 함수(OpenAI)를 부르는 코드로 바꿔요.
 * - 만든 리포트는 이 파일의 Map에만 남아요(새로고침하면 사라져요).
 * - 주소에 ?ai=error를 붙이면 만들기가 실패해요(오류 화면 확인용).
 * - 내용은 시안처럼 기록을 보고 정해진 규칙으로 문장을 골라요.
 */
const SAMPLE_DELAY_MS = 1800;
const sampleStore = new Map<string, AiWeeklyReport>();
const storeKey = (userId: UserId, startDate: string) => `${userId}:${startDate}`;

const weekdayOf = (date: Date) => format(date, 'EEE', { locale: ko });

/** 저장된 리포트. 없으면 null */
export const getWeeklyAiReportApi = async (userId: UserId, startDate: string): Promise<AiWeeklyReport | null> =>
  sampleStore.get(storeKey(userId, startDate)) ?? null;

/** 이 주의 리포트를 새로 만들어 저장해요. 이미 있으면 덮어써요. */
export const createWeeklyAiReportApi = async (
  userId: UserId,
  report: WeeklyReport,
  goal: Goal | null,
  today: Date,
): Promise<AiWeeklyReport> => {
  await new Promise(resolve => setTimeout(resolve, SAMPLE_DELAY_MS));

  if (new URLSearchParams(window.location.search).get('ai') === 'error') {
    throw new Error('예시 리포트 실패');
  }

  const created: AiWeeklyReport = {
    ...writeSampleReport(report, goal, today),
    createdAt: new Date().toISOString(),
    recordedDays: report.recordedDays,
    signature: getReportSignature(report, goal),
  };
  sampleStore.set(storeKey(userId, report.startDate), created);
  return created;
};

// 시안의 aiWrite 규칙을 옮겼어요. 두 번째 PR에서 지워요.
const writeSampleReport = (report: WeeklyReport, goal: Goal | null, today: Date) => {
  const recorded = report.days.filter(day => day.hasRecord);
  const days = recorded.length;
  const average = report.averageCalories;
  const ratio = getCalorieRatio(report.nutrients);
  const missing = report.days.filter(day => !day.hasRecord && day.date <= today);
  const mealKcal = (Object.keys(report.mealNutrients) as MealType[]).map(meal => {
    const { carbs, protein, fat } = report.mealNutrients[meal];
    return { meal, kcal: carbs * 4 + protein * 4 + fat * 9 };
  });
  const biggest = [...mealKcal].sort((a, b) => b.kcal - a.kcal)[0];
  const biggestShare = report.totalCalories > 0 ? Math.round((biggest.kcal / report.totalCalories) * 100) : 0;
  const allBreakfast = recorded.every(day => {
    const { carbs, protein, fat } = day.mealNutrients.breakfast;
    return carbs + protein + fat > 0;
  });

  const good: string[] = [];
  const bad: string[] = [];
  const next: string[] = [];

  if (goal) {
    const within = recorded.filter(day => day.calories <= goal.kcal);
    const over = recorded.filter(day => day.calories > goal.kcal);
    const proteinRate = goal.protein > 0 ? Math.round((report.averageNutrients.protein / goal.protein) * 100) : 100;
    const lead =
      `${days}일 중 ${within.length}일은 목표 안에서 먹었어요.` +
      (proteinRate < 70 ? ` 다만 단백질은 목표의 ${proteinRate}% 정도예요.` : ` 하루 평균 ${formatInteger(average)}kcal예요.`);

    if (within.length > 0) {
      good.push(`${within.map(day => weekdayOf(day.date)).join('·')}요일은 ${formatInteger(goal.kcal)}kcal 안에서 하루를 마무리했어요.`);
    }
    if (Math.abs(average - goal.kcal) <= goal.kcal * 0.05) good.push(`하루 평균 ${formatInteger(average)}kcal로 목표에 거의 맞췄어요.`);
    if (allBreakfast) good.push(`기록한 ${days}일 모두 아침을 챙겨 먹었어요.`);
    if (good.length === 0) good.push(`꾸준히 ${days}일을 기록했어요.`);

    over.forEach(day => bad.push(`${weekdayOf(day.date)}요일은 목표보다 ${formatInteger(day.calories - goal.kcal)}kcal 더 먹었어요.`));
    if (missing.length > 0) bad.push(`${missing.map(day => weekdayOf(day.date)).join('·')}요일 기록이 비어 있어요.`);
    if (proteinRate < 70) {
      bad.push(`하루 평균 단백질이 ${formatInteger(report.averageNutrients.protein)}g으로 목표 ${formatInteger(goal.protein)}g의 ${proteinRate}%예요.`);
    }
    if (biggestShare >= 50) bad.push(`${MEAL_LABEL[biggest.meal]}이 하루 칼로리의 ${biggestShare}%를 차지해요.`);
    if (bad.length === 0) bad.push('크게 아쉬운 점이 없어요.');

    if (proteinRate < 70) next.push('점심에 계란 2개나 닭가슴살 100g을 더해 단백질 20g 이상을 채워 보세요.');
    if (over.length > 0) next.push('목표를 넘은 날처럼 무거운 식사는 반만 먹어도 300kcal 안팎이 줄어요.');
    if (missing.length > 0) next.push('바쁜 날에는 식사 하나만이라도 기록해 보세요.');
    if (next.length < 2) next.push('지금처럼 식사마다 단백질 반찬을 하나씩 곁들여 보세요.');

    return { lead, good, bad, next };
  }

  const top = [...recorded].sort((a, b) => b.calories - a.calories)[0];
  const lead =
    `${days}일을 기록했고 하루 평균 ${formatInteger(average)}kcal를 먹었어요.` +
    (ratio.protein < 20 ? ` 단백질은 칼로리의 ${ratio.protein}%로 조금 적어요.` : '');

  if (allBreakfast) good.push(`기록한 ${days}일 모두 아침을 챙겨 먹었어요.`);
  if (ratio.protein >= 20) good.push(`단백질이 칼로리의 ${ratio.protein}%로 고르게 먹었어요.`);
  if (good.length === 0) good.push(`꾸준히 ${days}일을 기록했어요.`);

  if (top) bad.push(`${weekdayOf(top.date)}요일에 ${formatInteger(top.calories)}kcal로 가장 많이 먹었어요.`);
  if (missing.length > 0) bad.push(`${missing.map(day => weekdayOf(day.date)).join('·')}요일 기록이 비어 있어요.`);
  if (ratio.protein < 20) bad.push(`단백질이 하루 칼로리의 ${ratio.protein}%예요. 보통 20% 안팎을 권해요.`);
  if (biggestShare >= 50) bad.push(`${MEAL_LABEL[biggest.meal]}이 하루 칼로리의 ${biggestShare}%를 차지해요.`);

  if (ratio.protein < 20) next.push('점심에 계란 2개나 닭가슴살 100g을 더해 단백질 20g 이상을 채워 보세요.');
  if (missing.length > 0) next.push('바쁜 날에는 식사 하나만이라도 기록해 보세요.');
  next.push('마이페이지에서 하루 목표를 정하면 목표 기준으로도 정리해 줘요.');

  return { lead, good, bad, next };
};
