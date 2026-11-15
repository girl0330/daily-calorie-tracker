import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';

/** AI 검색이 돌려주는 후보 한 개. 양(serving)은 화면에 이름 옆·아래로 보여 줘요. */
export type FoodCandidate = {
  name: string;
  serving: string;
  carbs: number;
  protein: number;
  fat: number;
};

/**
 * AI 검색 결과.
 * ok: 후보를 찾음 / too_broad: '빵'처럼 넓은 검색어라 예시(suggestions)를 줌 / not_food: 음식이 아니거나 양이 말이 안 됨
 */
export type FoodSearchResult = {
  status: 'ok' | 'too_broad' | 'not_food';
  candidates: FoodCandidate[];
  suggestions: string[];
};

/** 하루 AI 검색 횟수를 다 썼을 때 던지는 오류. 화면에서 따로 안내해요. */
export class DailyLimitError extends Error {
  readonly limit: number;

  constructor(limit: number) {
    super('daily_limit');
    this.limit = limit;
  }
}

/**
 * AI 음식 검색. Supabase Edge Function 'food-search'를 불러요(supabase/functions/food-search).
 * 함수가 로그인 확인, 하루 횟수 확인, OpenAI 호출, 숫자 정리(0~999.9g)를 해요.
 * 로그인한 사용자의 토큰은 supabase 클라이언트가 알아서 붙여요.
 */
export const searchFoodsApi = async (query: string): Promise<FoodSearchResult> => {
  const { data, error } = await supabase.functions.invoke<Partial<FoodSearchResult>>('food-search', {
    body: { query },
  });

  if (error) {
    // 함수가 429로 답하면 하루 횟수를 다 쓴 거예요.
    if (error instanceof FunctionsHttpError && error.context instanceof Response && error.context.status === 429) {
      const body = await error.context.json().catch(() => null);
      throw new DailyLimitError(typeof body?.limit === 'number' ? body.limit : 50);
    }
    throw error;
  }

  return {
    status: data?.status ?? 'not_food',
    candidates: data?.candidates ?? [],
    suggestions: data?.suggestions ?? [],
  };
};
