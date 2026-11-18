// AI 주간 리포트: 한 주의 음식 기록과 목표를 DB에서 읽어 OpenAI에게 정리를 부탁하고, weekly_reports 표에 저장해요.
// - 앱은 { weekStart: 'YYYY-MM-DD'(월요일), signature } 만 보내요. 기록은 함수가 DB에서 직접 읽어요.
//   그래서 앱 밖에서 함수를 불러도 아무 내용이나 AI에게 보낼 수 없어요.
// - 로그인한 사용자 본인의 토큰으로 읽고 써서 RLS가 적용돼요(본인 기록만).
// - 한 사람·한 주에 리포트 하나예요. 다시 만들면 덮어써요.
// - 지금은 하루 횟수 제한이 없어요. 앱을 다 만든 뒤 다시 정해요.
// - 앱은 supabase.functions.invoke('weekly-report', { body: { weekStart, signature } })로 불러요.
import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { getUserClient } from '../_shared/auth.ts';
import { corsHeaders, json } from '../_shared/http.ts';
import { askOpenAiJson, OpenAiError, openAiErrorStatus } from '../_shared/openai.ts';

type MealType = 'breakfast' | 'lunch' | 'dinner';

type FoodRow = {
  meal_type: MealType;
  food_name: string;
  carbs: number;
  protein: number;
  fat: number;
  record_date: string | null;
  created_at: string;
};

type Goal = { kcal: number; carbs: number; protein: number; fat: number };

type AiReport = { lead: string; good: string[]; bad: string[]; next: string[] };

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];
const MAX_SIGNATURE_LENGTH = 2000;
const MAX_ITEMS = 3;
const MAX_LINE_LENGTH = 120;
/** 리포트 말투. 말투 고르기는 빼기로 해서(2026-11-18) 늘 '다정하게'예요. */
const TONE = 'soft';

// AI에게 주는 지시. 2026-11-17 사용자와 함께 정했어요. 바꾸기 전에 먼저 이야기해요.
const SYSTEM_PROMPT = `너는 한국 사용자의 한 주 식단 기록을 보고 짧게 정리해 주는 도우미야.

[입력]
JSON 하나를 받아.
- week: 주의 날짜 범위, isCurrentWeek: 아직 끝나지 않은 이번 주인지, recordedDays: 기록한 날 수
- goal: 하루 목표(kcal, carbs, protein, fat의 g). 목표를 쓰지 않으면 null
- summary: averageKcal(기록한 날 하루 평균), averageProtein(g), overGoalDays(목표를 넘은 요일), emptyDays(오늘까지 기록이 비어 있는 요일)
- days: 기록한 날마다 weekday, kcal, carbs, protein, fat(g), meals(아침·점심·저녁에 먹은 음식 이름)

[숫자]
- 숫자는 입력에 있는 값만 써. 새로 계산하거나 반올림을 바꾸지 마.
- goal이 있으면 목표와 비교해. null이면 목표 이야기는 하지 말고, 탄·단·지 균형(단백질은 칼로리의 20% 안팎)을 기준으로 말해.

[기록]
- 기록이 없는 날(emptyDays)을 굶은 날로 단정하지 마. "기록이 비어 있어요"라고만 해.
- 기록이 1일뿐이면 "하루 기록이라 한 주 흐름을 보기는 어려워요"를 lead에 넣어.
- isCurrentWeek가 true면 아직 끝나지 않은 주라서 "지금까지"라고 말해.
- 음식 이름은 입력에 있는 것만 말해. 없는 음식을 지어내지 마.

[조언]
- next는 다음 주에 바로 해볼 수 있는 구체적인 행동으로 써. (예: "점심에 계란 2개를 더해 보세요")
- 병명, 약, 진단, 단식이나 극단적인 다이어트는 말하지 마.
- 하루 칼로리를 1,200kcal보다 적게 먹으라고 권하지 마.

[말투와 길이]
- "~해요" 존댓말로 다정하게 써. 이모지는 쓰지 마.
- lead는 1~2문장, good·bad·next는 각각 1~3개, 한 줄은 60자 안쪽으로 써.
- 아쉬운 점이 없으면 bad에 "크게 아쉬운 점이 없어요." 한 줄만 써.`;

const RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['lead', 'good', 'bad', 'next'],
  properties: {
    lead: { type: 'string' },
    good: { type: 'array', items: { type: 'string' } },
    bad: { type: 'array', items: { type: 'string' } },
    next: { type: 'array', items: { type: 'string' } },
  },
};

// ---- 날짜: 모두 'YYYY-MM-DD' 글자로 다뤄요. '오늘'과 예전 기록의 날짜는 한국 시간 기준이에요. ----

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const toKstDate = (time: Date) => new Date(time.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
const addDays = (date: string, days: number) => {
  const next = new Date(`${date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
};
const mondayOf = (date: string) => addDays(date, -((new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7));
const isValidDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
const monthDay = (date: string) => ({ month: Number(date.slice(5, 7)), day: Number(date.slice(8, 10)) });

/** '11월 16일~22일', 달이 바뀌면 '10월 26일~11월 1일' (앱의 주간 헤더와 같아요) */
const formatWeekLabel = (start: string, end: string) => {
  const s = monthDay(start);
  const e = monthDay(end);
  return s.month === e.month ? `${s.month}월 ${s.day}일~${e.day}일` : `${s.month}월 ${s.day}일~${e.month}월 ${e.day}일`;
};

const kcalOf = (carbs: number, protein: number, fat: number) => carbs * 4 + protein * 4 + fat * 9;
const round1 = (value: number) => Math.round(value * 10) / 10;

// ---- DB 읽기 ----

/** 목표 설정이 켜져 있으면 목표, 꺼져 있거나 없으면 null (앱의 getActiveGoal과 같아요) */
const readGoal = async (supabase: SupabaseClient, userId: string): Promise<Goal | null> => {
  const { data, error } = await supabase
    .from('user_goals')
    .select('is_enabled, kcal, carbs_g, protein_g, fat_g')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data?.is_enabled) return null;
  return { kcal: data.kcal, carbs: data.carbs_g, protein: data.protein_g, fat: data.fat_g };
};

/** 그 주의 음식. record_date가 비어 있는 예전 기록은 등록 시각(한국 시간)의 날짜로 봐요. */
const readWeekFoods = async (supabase: SupabaseClient, userId: string, weekStart: string, weekEnd: string) => {
  const afterEnd = addDays(weekEnd, 1);
  const { data, error } = await supabase
    .from('foods')
    .select('meal_type, food_name, carbs, protein, fat, record_date, created_at')
    .eq('user_id', userId)
    .or(
      [
        `and(record_date.gte.${weekStart},record_date.lte.${weekEnd})`,
        `and(record_date.is.null,created_at.gte.${weekStart}T00:00:00+09:00,created_at.lt.${afterEnd}T00:00:00+09:00)`,
      ].join(','),
    )
    .order('created_at', { ascending: true })
    .limit(1000);
  if (error) throw error;
  return (data ?? []) as FoodRow[];
};

// ---- AI에게 보낼 자료 만들기: 평균·목표 넘은 날·비어 있는 날은 여기서 미리 계산해요. ----

const buildInput = (foods: FoodRow[], goal: Goal | null, weekStart: string, today: string) => {
  const dates = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  const days = dates.map((date, index) => {
    const dayFoods = foods.filter(food => (food.record_date ?? toKstDate(new Date(food.created_at))) === date);
    const carbs = dayFoods.reduce((sum, food) => sum + food.carbs, 0);
    const protein = dayFoods.reduce((sum, food) => sum + food.protein, 0);
    const fat = dayFoods.reduce((sum, food) => sum + food.fat, 0);
    const namesOf = (meal: MealType) => dayFoods.filter(food => food.meal_type === meal).map(food => food.food_name);

    return {
      date,
      weekday: WEEKDAYS[index],
      hasRecord: dayFoods.length > 0,
      kcal: Math.round(kcalOf(carbs, protein, fat)),
      carbs: round1(carbs),
      protein: round1(protein),
      fat: round1(fat),
      meals: { breakfast: namesOf('breakfast'), lunch: namesOf('lunch'), dinner: namesOf('dinner') },
    };
  });

  const recorded = days.filter(day => day.hasRecord);
  const totalKcal = recorded.reduce((sum, day) => sum + day.kcal, 0);
  const totalProtein = recorded.reduce((sum, day) => sum + day.protein, 0);

  return {
    recordedDays: recorded.length,
    input: {
      week: formatWeekLabel(weekStart, dates[6]),
      isCurrentWeek: weekStart === mondayOf(today),
      recordedDays: recorded.length,
      goal,
      summary: {
        averageKcal: recorded.length ? Math.round(totalKcal / recorded.length) : 0,
        averageProtein: recorded.length ? round1(totalProtein / recorded.length) : 0,
        overGoalDays: goal ? recorded.filter(day => day.kcal > goal.kcal).map(day => day.weekday) : [],
        emptyDays: days.filter(day => !day.hasRecord && day.date <= today).map(day => day.weekday),
      },
      days: recorded.map(({ weekday, kcal, carbs, protein, fat, meals }) => ({ weekday, kcal, carbs, protein, fat, meals })),
    },
  };
};

// ---- AI 답 정리: 빈 줄을 빼고, 개수와 길이를 넘지 않게 잘라요. ----

const toLines = (list: unknown) =>
  (Array.isArray(list) ? list : [])
    .filter((item): item is string => typeof item === 'string')
    .map(item => item.trim().slice(0, MAX_LINE_LENGTH))
    .filter(Boolean)
    .slice(0, MAX_ITEMS);

const toReport = (raw: unknown): AiReport | null => {
  const data = raw as Partial<Record<keyof AiReport, unknown>> | null;
  const lead = typeof data?.lead === 'string' ? data.lead.trim().slice(0, MAX_LINE_LENGTH * 2) : '';
  const good = toLines(data?.good);
  const bad = toLines(data?.bad);
  const next = toLines(data?.next);
  if (!lead || good.length === 0 || next.length === 0) return null;
  return { lead, good, bad: bad.length > 0 ? bad : ['크게 아쉬운 점이 없어요.'], next };
};

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  // 1) 로그인한 사용자인지 확인해요.
  const auth = await getUserClient(request);
  if ('response' in auth) return auth.response;
  const { supabase, user } = auth;

  // 2) 어느 주인지 확인해요. 월요일이어야 하고, 아직 오지 않은 주는 안 돼요.
  let weekStart = '';
  let signature = '';
  try {
    const body = await request.json();
    weekStart = typeof body?.weekStart === 'string' ? body.weekStart : '';
    signature = typeof body?.signature === 'string' ? body.signature : '';
  } catch {
    return json({ error: 'invalid_body' }, 400);
  }
  const today = toKstDate(new Date());
  if (!isValidDate(weekStart) || mondayOf(weekStart) !== weekStart || weekStart > mondayOf(today)) {
    return json({ error: 'invalid_week' }, 400);
  }
  if (!signature || signature.length > MAX_SIGNATURE_LENGTH) return json({ error: 'invalid_signature' }, 400);

  // 3) 그 주의 기록과 목표를 DB에서 읽어 AI에게 보낼 자료를 만들어요. 기록이 하나도 없으면 만들지 않아요.
  let built: ReturnType<typeof buildInput>;
  try {
    const [goal, foods] = await Promise.all([
      readGoal(supabase, user.id),
      readWeekFoods(supabase, user.id, weekStart, addDays(weekStart, 6)),
    ]);
    built = buildInput(foods, goal, weekStart, today);
  } catch (error) {
    console.error('read_error', error);
    return json({ error: 'read_failed' }, 500);
  }
  if (built.recordedDays === 0) return json({ error: 'no_records' }, 400);

  // 4) OpenAI에게 정리를 부탁해요.
  let report: AiReport | null;
  try {
    report = toReport(
      await askOpenAiJson({
        systemPrompt: SYSTEM_PROMPT,
        userContent: JSON.stringify(built.input),
        schemaName: 'weekly_report',
        schema: RESPONSE_SCHEMA,
      }),
    );
  } catch (error) {
    if (error instanceof OpenAiError) return json({ error: error.code }, openAiErrorStatus(error));
    throw error;
  }
  if (!report) return json({ error: 'bad_upstream_response' }, 502);

  // 5) 저장해요. 같은 주의 리포트가 있으면 덮어써요.
  const { data, error } = await supabase
    .from('weekly_reports')
    .upsert({
      user_id: user.id,
      week_start: weekStart,
      ...report,
      tone: TONE,
      signature,
      recorded_days: built.recordedDays,
      created_at: new Date().toISOString(),
    })
    .select('lead, good, bad, next, created_at, recorded_days, signature')
    .single();
  if (error) {
    console.error('save_error', error);
    return json({ error: 'save_failed' }, 500);
  }

  return json(data);
});
