import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { json } from './http.ts';

/** AI 기능마다 한 사람이 하루(한국 시간)에 쓸 수 있는 횟수 */
export const DAILY_LIMITS = {
  food_search: 50,
  weekly_report: 5,
} as const;

export type AiKind = keyof typeof DAILY_LIMITS;

/**
 * 오늘 이 기능의 사용 횟수를 1 늘려요(ai_usage 표, use_ai_quota 함수).
 * - 한도 안이면 null을 돌려줘요. 함수는 그대로 OpenAI를 부르면 돼요.
 * - 이미 한도만큼 썼으면 429 응답을, 횟수를 세다 실패하면 500 응답을 돌려줘요(함수는 그대로 return).
 * supabase는 사용자 토큰을 붙인 클라이언트(getUserClient)여야 해요. 그래야 그 사용자 본인 줄을 세요.
 * OpenAI를 부르기 바로 전에 불러요. OpenAI가 실패해도 한 번으로 셉니다.
 */
export const spendAiQuota = async (supabase: SupabaseClient, kind: AiKind): Promise<Response | null> => {
  const limit = DAILY_LIMITS[kind];
  const { data: isAllowed, error } = await supabase.rpc('use_ai_quota', { p_kind: kind, p_limit: limit });
  if (error) {
    console.error('quota_error', error);
    return json({ error: 'quota_check_failed' }, 500);
  }
  return isAllowed ? null : json({ error: 'daily_limit', limit }, 429);
};
