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
 * AI 음식 검색. Supabase Edge Function 'food-search'를 불러요(supabase/functions/food-search).
 * 함수가 로그인 확인, OpenAI 호출, 숫자 정리(0~999.9g)를 하고 후보를 최대 3개 돌려줘요.
 * 후보가 없으면 빈 배열(못 찾음), 실패하면 오류를 던져요(오류 화면).
 * 로그인한 사용자의 토큰은 supabase 클라이언트가 알아서 붙여요.
 */
export const searchFoodsApi = async (query: string): Promise<FoodCandidate[]> => {
  const { data, error } = await supabase.functions.invoke<{ candidates?: FoodCandidate[] }>('food-search', {
    body: { query },
  });

  if (error) throw error;
  return data?.candidates ?? [];
};
