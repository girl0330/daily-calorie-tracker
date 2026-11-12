import { supabase } from '../../../lib/supabase';
import type { UserId } from '../../../types/types';
import type { Goal, GoalSettings } from '../types';

const GOAL_SELECT_COLUMNS = 'is_enabled, kcal, carbs_g, protein_g, fat_g, mode, ratio_carbs, ratio_protein, ratio_fat';

// DB(snake_case) 한 줄
type GoalRow = {
  is_enabled: boolean;
  kcal: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
  mode: Goal['mode'];
  ratio_carbs: number | null;
  ratio_protein: number | null;
  ratio_fat: number | null;
};

const toGoalSettings = (row: GoalRow): GoalSettings => ({
  isEnabled: row.is_enabled,
  goal: {
    kcal: row.kcal,
    carbs: row.carbs_g,
    protein: row.protein_g,
    fat: row.fat_g,
    mode: row.mode,
    ratio:
      row.mode === 'kcal' && row.ratio_carbs !== null && row.ratio_protein !== null && row.ratio_fat !== null
        ? { carbs: row.ratio_carbs, protein: row.ratio_protein, fat: row.ratio_fat }
        : null,
  },
});

const toGoalRow = (userId: UserId, isEnabled: boolean, goal: Goal) => ({
  user_id: userId,
  is_enabled: isEnabled,
  kcal: goal.kcal,
  carbs_g: goal.carbs,
  protein_g: goal.protein,
  fat_g: goal.fat,
  mode: goal.mode,
  ratio_carbs: goal.ratio?.carbs ?? null,
  ratio_protein: goal.ratio?.protein ?? null,
  ratio_fat: goal.ratio?.fat ?? null,
  updated_at: new Date().toISOString(),
});

// 저장된 줄이 없으면 '꺼짐, 목표 없음'으로 돌려줘요. (기본은 꺼짐)
export const getGoalSettingsApi = async (userId: UserId): Promise<GoalSettings> => {
  const { data, error } = await supabase
    .from('user_goals')
    .select(GOAL_SELECT_COLUMNS)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  return data ? toGoalSettings(data as GoalRow) : { isEnabled: false, goal: null };
};

// 켜기/끄기와 목표를 한 번에 저장해요. 처음이면 새로 만들고, 이미 있으면 덮어써요(upsert).
export const saveGoalSettingsApi = async (
  userId: UserId,
  { isEnabled, goal }: { isEnabled: boolean; goal: Goal },
): Promise<GoalSettings> => {
  const { data, error } = await supabase
    .from('user_goals')
    .upsert(toGoalRow(userId, isEnabled, goal))
    .select(GOAL_SELECT_COLUMNS)
    .single();

  if (error) throw error;

  return toGoalSettings(data as GoalRow);
};
