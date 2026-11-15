/** AI 검색이 돌려주는 후보 한 개. 양(serving)은 화면에 이름 옆·아래로 보여 줘요. */
export type FoodCandidate = {
  name: string;
  serving: string;
  carbs: number;
  protein: number;
  fat: number;
};

/*
 * 8단계 앞부분: 화면을 먼저 완성하려고 쓰는 예시 검색이에요.
 * 시안과 같은 규칙으로 움직여요. 뒷부분에서 Supabase Edge Function(OpenAI)을 부르는 코드로 바꿔요.
 * - '오류'가 들어가면 실패해요(오류 화면 확인용).
 * - 한 글자면 못 찾아요(못 찾음 화면 확인용).
 * - 김밥·닭가슴살·라면은 정해 둔 후보를, 그 밖의 음식은 1인분·반 인분 추정값을 돌려줘요.
 */
const SAMPLE_RESULTS: Record<string, FoodCandidate[]> = {
  김밥: [
    { name: '김밥', serving: '1줄 (약 230g)', carbs: 68.5, protein: 12.3, fat: 9.8 },
    { name: '참치김밥', serving: '1줄 (약 250g)', carbs: 66, protein: 17.4, fat: 14.2 },
    { name: '꼬마김밥', serving: '5개 (약 150g)', carbs: 41.2, protein: 6.1, fat: 5 },
  ],
  닭가슴살: [
    { name: '닭가슴살 (삶은 것)', serving: '100g', carbs: 0, protein: 23.1, fat: 1.2 },
    { name: '닭가슴살 (삶은 것)', serving: '150g', carbs: 0, protein: 34.7, fat: 1.8 },
    { name: '훈제 닭가슴살', serving: '1팩 (100g)', carbs: 1.5, protein: 22, fat: 2 },
  ],
  라면: [
    { name: '라면', serving: '1봉지 (120g)', carbs: 79, protein: 10.5, fat: 16 },
    { name: '라면 + 계란 1개', serving: '1그릇', carbs: 79.4, protein: 16.8, fat: 20.8 },
    { name: '컵라면 (소)', serving: '1개 (65g)', carbs: 41, protein: 5.5, fat: 8.4 },
  ],
};

const SAMPLE_DELAY_MS = 900;

export const searchFoodsApi = async (query: string): Promise<FoodCandidate[]> => {
  await new Promise(resolve => setTimeout(resolve, SAMPLE_DELAY_MS));

  if (query.includes('오류')) throw new Error('예시 검색 실패');
  if (query.length < 2) return [];

  const key = Object.keys(SAMPLE_RESULTS).find(word => query.includes(word));
  if (key) return SAMPLE_RESULTS[key];

  return [
    { name: query, serving: '1인분 (추정)', carbs: 45, protein: 15, fat: 10 },
    { name: query, serving: '반 인분 (추정)', carbs: 22.5, protein: 7.5, fat: 5 },
  ];
};
