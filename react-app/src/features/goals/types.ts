export type GoalMode = 'kcal' | 'nut';

// 탄·단·지 비율(%). 세 값의 합은 100이에요.
export type NutrientRatio = {
  carbs: number;
  protein: number;
  fat: number;
};

// 화면에서 쓰는 하루 목표
export type Goal = {
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
  mode: GoalMode;
  // 칼로리로 정했을 때만 있어요.
  ratio: NutrientRatio | null;
};

// 사용자의 목표 설정. 꺼져 있으면 목표 관련 기능을 모두 보여 주지 않아요.
export type GoalSettings = {
  isEnabled: boolean;
  // 직접 정해 둔 목표. 한 번도 켠 적이 없으면 null이에요.
  goal: Goal | null;
};
