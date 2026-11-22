import { FunctionsHttpError } from '@supabase/supabase-js';

/** 하루 AI 사용 횟수를 다 썼을 때 던지는 오류. 화면에서 따로 안내해요. */
export class DailyLimitError extends Error {
  readonly limit: number;

  constructor(limit: number) {
    super('daily_limit');
    this.limit = limit;
  }
}

/**
 * AI 함수(food-search, weekly-report)가 준 오류를 화면에서 쓸 오류로 바꿔요.
 * 함수가 429로 답하면 하루 횟수를 다 쓴 거라 DailyLimitError로, 나머지는 그대로 돌려줘요.
 * 함수가 답에 횟수(limit)를 넣어 주고, 못 읽으면 fallbackLimit을 써요.
 * 쓰는 법: if (error) throw await toAiError(error, 50);
 */
export const toAiError = async (error: unknown, fallbackLimit: number): Promise<unknown> => {
  if (error instanceof FunctionsHttpError && error.context instanceof Response && error.context.status === 429) {
    const body = await error.context.json().catch(() => null);
    return new DailyLimitError(typeof body?.limit === 'number' ? body.limit : fallbackLimit);
  }
  return error;
};
