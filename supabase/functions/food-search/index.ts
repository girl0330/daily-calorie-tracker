// AI 음식 검색: 검색어를 받아 OpenAI에게 영양 정보 후보를 물어보고, 정해진 모양으로 돌려줘요.
// - 돌려주는 모양: { status: 'ok' | 'too_broad' | 'not_food', candidates: [...], suggestions: [...] }
// - 로그인한 사용자만 부를 수 있어요(Authorization 헤더의 토큰을 Supabase에 확인해요).
// - 한 사람이 하루 50번까지만 쓸 수 있어요(ai_usage 표, use_ai_quota 함수). 넘으면 429예요.
// - OpenAI 키와 모델 이름은 Supabase Secrets(OPENAI_API_KEY, OPENAI_MODEL)에서만 읽어요.
// - 앱은 supabase.functions.invoke('food-search', { body: { query } })로 불러요.
import { createClient } from 'npm:@supabase/supabase-js@2';

type Candidate = {
  name: string;
  serving: string;
  carbs: number;
  protein: number;
  fat: number;
};

/** ok: 후보를 찾음 / too_broad: 넓은 검색어(예: 빵) / not_food: 음식이 아님 */
type SearchStatus = 'ok' | 'too_broad' | 'not_food';

type SearchResult = {
  status: SearchStatus;
  candidates: Candidate[];
  /** too_broad일 때 다시 검색할 만한 구체적인 검색어. 그 밖에는 빈 배열이에요. */
  suggestions: string[];
};

const MAX_QUERY_LENGTH = 50;
/** 한 사람이 하루(한국 시간)에 AI 검색을 쓸 수 있는 횟수. ai_usage 표와 use_ai_quota 함수로 세요. */
const DAILY_LIMIT = 50;
const MAX_CANDIDATES = 3;
const MAX_SUGGESTIONS = 4;
/** 앱의 입력 상한과 같아요(한 음식의 탄·단·지는 각각 999.9g까지). */
const NUTRIENT_MAX = 999.9;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

// AI에게 주는 지시. 입력은 사용자가 친 검색어 한 줄이에요. 예시의 숫자는 형식을 보여 주는 대략값이에요.
const SYSTEM_PROMPT = `너는 한국 사용자가 먹은 음식의 영양 성분을 추정하는 도우미야.

[입력]
검색어 한 줄을 받아. 끝에 양(예: 150g, 1줄)이 붙어 있을 수 있으니 이름과 양을 스스로 나눠서 이해해.
양이 없을 수도 있어.
예) 닭가슴살 100g, 김밥

[할 일]
1. 검색한 음식의 후보를 1~3개 골라. 같은 음식의 흔한 종류(조리법·재료 차이)를 후보로 삼아.
   예) 닭가슴살 → 삶은 것, 구운 것, 훈제
2. 양이 있으면 모든 후보를 정확히 그 양 기준으로 계산해.
   양이 없으면 한국에서 흔한 1인분(1회 제공량) 기준으로 계산해.
3. 각 후보의 탄수화물·단백질·지방을 g 단위, 소수점 한 자리까지 추정해.

[답 쓰는 법]
- status: 결과 종류. 후보를 찾았으면 "ok", 넓은 검색어면 "too_broad", 음식이 아니거나 양이 말이 안 되면 "not_food".
- name: 음식 이름만 짧게(상표가 있으면 상표 포함). 조리법은 괄호에. 예) 닭가슴살 (삶은 것)
- serving: 계산에 쓴 양. 검색어에 양이 있으면 그대로 쓰고, 없으면 "1줄 (약 230g)"처럼 단위와 무게를 함께.
- 가장 흔한 후보를 첫 번째에 둬.
- suggestions: status가 "too_broad"일 때만 채우고, 그 밖에는 빈 배열로 둬.

[넓은 검색어]
- 검색어가 여러 종류를 아우르는 넓은 말이라서 하나의 음식으로 정할 수 없으면(예: 빵, 고기, 음료, 과자, 국)
  status를 "too_broad"로 하고 candidates는 빈 배열로 둬.
- 이때 suggestions에 사용자가 다시 검색할 만한 구체적인 검색어를 2~4개 적어. 예) 식빵 2장, 단팥빵, 크루아상
- 기본이 분명한 음식(예: 김밥, 라면, 떡볶이)은 넓은 말로 보지 말고 평소처럼 후보를 줘.

[애매할 때]
- 음식이 아니거나 무엇인지 알 수 없으면 status를 "not_food"로 하고 candidates를 빈 배열로.
- 검색어의 양이 음식 양으로 말이 안 되면(예: 50kg) status를 "not_food"로 하고 candidates를 빈 배열로.
- 상표가 들어간 메뉴는 일반적인 같은 메뉴 기준으로 추정하고, 이름에서 상표를 빼지 말고 그대로 써.
  다만 크기 규칙이 널리 알려진 큰 프랜차이즈라면 그 가게에서 파는 1개(1통·1잔) 기준으로 추정하고 serving에 그 크기를 적어.
  예) 스타벅스 카페라테 → serving: "1잔 (톨, 355ml)"
- 그 가게의 양을 확실히 모르면 일반 기준으로 추정하고, serving에 "일반 기준"이라고 적어.
  예) ○○분식 떡볶이 → serving: "1인분 (일반 기준, 약 300g)"
- kcal은 쓰지 마. 앱이 탄수화물·단백질·지방으로 계산해.

[예시]
입력: 김밥
답: {"status": "ok", "candidates": [
  {"name": "김밥", "serving": "1줄 (약 230g)", "carbs": 68.5, "protein": 12.3, "fat": 9.8},
  {"name": "참치김밥", "serving": "1줄 (약 250g)", "carbs": 66.0, "protein": 17.4, "fat": 14.2}
], "suggestions": []}

입력: 닭가슴살 150g
답: {"status": "ok", "candidates": [
  {"name": "닭가슴살 (삶은 것)", "serving": "150g", "carbs": 0.0, "protein": 34.7, "fat": 1.8},
  {"name": "닭가슴살 (훈제)", "serving": "150g", "carbs": 2.3, "protein": 33.0, "fat": 3.0}
], "suggestions": []}

입력: 빵
답: {"status": "too_broad", "candidates": [], "suggestions": ["식빵 2장", "단팥빵", "크루아상"]}

입력: 책상
답: {"status": "not_food", "candidates": [], "suggestions": []}

입력: 김밥 50kg
답: {"status": "not_food", "candidates": [], "suggestions": []}

입력: 스타벅스 카페라테
답: {"status": "ok", "candidates": [
  {"name": "스타벅스 카페라테", "serving": "1잔 (톨, 355ml)", "carbs": 15.0, "protein": 10.0, "fat": 7.0}
], "suggestions": []}

입력: ○○분식 떡볶이
답: {"status": "ok", "candidates": [
  {"name": "○○분식 떡볶이", "serving": "1인분 (일반 기준, 약 300g)", "carbs": 95.0, "protein": 10.0, "fat": 5.0}
], "suggestions": []}`;

// 답 모양. strict 모드라 모든 칸이 필수예요. 쓸 일이 없는 칸은 빈 배열로 와요.
const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['ok', 'too_broad', 'not_food'] },
    candidates: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          serving: { type: 'string' },
          carbs: { type: 'number' },
          protein: { type: 'number' },
          fat: { type: 'number' },
        },
        required: ['name', 'serving', 'carbs', 'protein', 'fat'],
        additionalProperties: false,
      },
    },
    suggestions: { type: 'array', items: { type: 'string' } },
  },
  required: ['status', 'candidates', 'suggestions'],
  additionalProperties: false,
};

// AI가 엉뚱한 숫자를 줘도 앱의 규칙(0 이상, 999.9 이하, 소수점 한 자리)에 맞춰요.
const clampGram = (value: unknown) => {
  const number = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  return Math.round(Math.min(Math.max(number, 0), NUTRIENT_MAX) * 10) / 10;
};

const toCandidates = (list: unknown): Candidate[] => {
  if (!Array.isArray(list)) return [];

  return list
    .filter(item => item && typeof item.name === 'string' && item.name.trim())
    .slice(0, MAX_CANDIDATES)
    .map(item => ({
      name: String(item.name).trim().slice(0, 40),
      serving: String(item.serving ?? '').trim().slice(0, 40),
      carbs: clampGram(item.carbs),
      protein: clampGram(item.protein),
      fat: clampGram(item.fat),
    }));
};

const toSuggestions = (list: unknown): string[] => {
  if (!Array.isArray(list)) return [];

  return list
    .filter((item): item is string => typeof item === 'string' && item.trim() !== '')
    .map(item => item.trim().slice(0, 30))
    .slice(0, MAX_SUGGESTIONS);
};

// AI의 답을 앱에 보낼 모양으로 정리해요. 결과 종류와 내용이 서로 어긋나면 내용에 맞춰 바로잡아요.
// 예) status가 ok인데 후보가 없으면 not_food, too_broad인데 예시가 없으면 not_food로 봐요.
const toSearchResult = (raw: unknown): SearchResult => {
  const data = raw as { status?: unknown; candidates?: unknown; suggestions?: unknown };
  const candidates = toCandidates(data?.candidates);
  const suggestions = toSuggestions(data?.suggestions);

  if (data?.status === 'too_broad' && suggestions.length > 0) {
    return { status: 'too_broad', candidates: [], suggestions };
  }
  if (candidates.length > 0) return { status: 'ok', candidates, suggestions: [] };
  return { status: 'not_food', candidates: [], suggestions: [] };
};

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  // 1) 로그인한 사용자인지 확인해요.
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  // 사용자의 토큰을 붙인 클라이언트라서, 아래 횟수 세기(rpc)도 그 사용자 본인으로 실행돼요.
  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) return json({ error: 'unauthorized' }, 401);

  // 2) 검색어를 확인해요.
  let query = '';
  try {
    const body = await request.json();
    query = typeof body?.query === 'string' ? body.query.trim() : '';
  } catch {
    return json({ error: 'invalid_body' }, 400);
  }
  if (!query || query.length > MAX_QUERY_LENGTH) return json({ error: 'invalid_query' }, 400);

  const apiKey = Deno.env.get('OPENAI_API_KEY');
  const model = Deno.env.get('OPENAI_MODEL');
  if (!apiKey || !model) return json({ error: 'not_configured' }, 500);

  // 3) 오늘 횟수를 1 늘려요. 이미 50번을 썼으면 OpenAI를 부르지 않고 429로 알려요.
  //    올바른 검색어만 세고, OpenAI가 실패해도 한 번으로 셉니다.
  const { data: isAllowed, error: quotaError } = await supabase.rpc('use_ai_quota', {
    p_kind: 'food_search',
    p_limit: DAILY_LIMIT,
  });
  if (quotaError) {
    console.error('quota_error', quotaError);
    return json({ error: 'quota_check_failed' }, 500);
  }
  if (!isAllowed) return json({ error: 'daily_limit', limit: DAILY_LIMIT }, 429);

  // 4) OpenAI에 정해진 모양(JSON 스키마)으로 답하게 해요.
  const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'food_candidates', strict: true, schema: RESPONSE_SCHEMA },
      },
    }),
  });

  if (!openaiResponse.ok) {
    // 키·결제 문제 등을 로그로 남겨요(대시보드의 함수 로그에서 볼 수 있어요). 앱에는 자세한 이유를 보내지 않아요.
    console.error('openai_error', openaiResponse.status, await openaiResponse.text());
    return json({ error: 'upstream_failed' }, 502);
  }

  try {
    const completion = await openaiResponse.json();
    const content = completion?.choices?.[0]?.message?.content ?? '';
    return json(toSearchResult(JSON.parse(content)));
  } catch (error) {
    console.error('parse_error', error);
    return json({ error: 'bad_upstream_response' }, 502);
  }
});
