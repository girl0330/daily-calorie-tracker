import { useState, type FormEvent } from 'react';
import Button from '../../../components/common/Button';
import SegmentedControl from '../../../components/common/SegmentedControl';
import TextField from '../../../components/common/TextField';
import type { Goal, GoalMode, NutrientRatio } from '../types';
import {
  ADULT_ENERGY_REFERENCES,
  DEFAULT_RATIO,
  GOAL_KCAL_MAX,
  GOAL_KCAL_MIN,
  NUTRIENT_LIMITS,
  RATIO_PRESETS,
  gramsFromKcal,
  isSameRatio,
  kcalFromGrams,
  parseNumberInput,
} from '../utils/goalCalc';
import { formatInteger } from '../../../utils/formatNumber';
import RatioSlider from './RatioSlider';

type GoalEditorProps = {
  goal: Goal | null;
  isSaving: boolean;
  onSave: (goal: Goal) => void;
  onCancel: () => void;
};

type NutrientKey = 'carbs' | 'protein' | 'fat';
type FieldKey = 'kcal' | NutrientKey;
type FieldErrors = Partial<Record<FieldKey, string>>;

const MODE_OPTIONS: { value: GoalMode; label: string }[] = [
  { value: 'kcal', label: '칼로리로 정하기' },
  { value: 'nut', label: '영양소로 정하기' },
];

const NUTRIENTS: { key: NutrientKey; label: string; placeholder: string }[] = [
  { key: 'carbs', label: '탄수화물', placeholder: '190' },
  { key: 'protein', label: '단백질', placeholder: '75' },
  { key: 'fat', label: '지방', placeholder: '50' },
];

const NUTRIENT_DOT: Record<NutrientKey, string> = {
  carbs: 'bg-(--carbs)',
  protein: 'bg-(--protein)',
  fat: 'bg-(--fat)',
};

const rangeMessage = (min: number, max: number) => `${formatInteger(min)}~${formatInteger(max)} 사이로 입력하세요.`;

const toText = (value: number | undefined) => (value === undefined ? '' : String(value));

export default function GoalEditor({ goal, isSaving, onSave, onCancel }: GoalEditorProps) {
  // 수정 창은 항상 '영양소로 정하기' 탭으로 열어요. 저장된 탄·단·지 g이 그대로 보여요.
  const [mode, setMode] = useState<GoalMode>('nut');
  const [ratio, setRatio] = useState<NutrientRatio>(goal?.ratio ?? DEFAULT_RATIO);
  const [kcalText, setKcalText] = useState(toText(goal?.kcal));
  const [gramTexts, setGramTexts] = useState<Record<NutrientKey, string>>({
    carbs: toText(goal?.carbs),
    protein: toText(goal?.protein),
    fat: toText(goal?.fat),
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const kcal = parseNumberInput(kcalText);
  const grams = {
    carbs: parseNumberInput(gramTexts.carbs),
    protein: parseNumberInput(gramTexts.protein),
    fat: parseNumberInput(gramTexts.fat),
  };
  const hasKcal = kcal !== null && kcal > 0;
  const suggestedGrams = hasKcal ? gramsFromKcal(kcal, ratio) : null;
  const hasAllGrams = grams.carbs !== null && grams.protein !== null && grams.fat !== null;
  const totalKcal = hasAllGrams ? kcalFromGrams(grams.carbs!, grams.protein!, grams.fat!) : null;
  const isTotalOutOfRange = totalKcal !== null && (totalKcal < GOAL_KCAL_MIN || totalKcal > GOAL_KCAL_MAX);

  // 계산한 칼로리가 저장된 칼로리와 다르면 차이를 알려 줘요. 같으면 안내를 보여 주지 않아요.
  // g을 고치지 않았는데도 다르다면, g을 정수로 반올림해서 저장했기 때문이에요.
  const isSavedGrams =
    goal !== null && grams.carbs === goal.carbs && grams.protein === goal.protein && grams.fat === goal.fat;
  const kcalGap = goal !== null && totalKcal !== null ? totalKcal - goal.kcal : 0;

  // 방식을 바꿀 때 지금까지 입력한 값을 반대쪽으로 옮겨 줘요.
  const changeMode = (nextMode: GoalMode) => {
    if (nextMode === mode) return;

    if (nextMode === 'nut' && suggestedGrams) {
      setGramTexts({
        carbs: String(suggestedGrams.carbs),
        protein: String(suggestedGrams.protein),
        fat: String(suggestedGrams.fat),
      });
    }

    if (nextMode === 'kcal' && totalKcal !== null) {
      setKcalText(String(totalKcal));
    }

    setErrors({});
    setMode(nextMode);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 입력칸은 화면 순서대로예요: 칼로리 방식은 [칼로리], 영양소 방식은 [탄, 단, 지].
    const inputs = event.currentTarget.querySelectorAll('input');

    if (mode === 'kcal') {
      if (kcal === null || kcal < GOAL_KCAL_MIN || kcal > GOAL_KCAL_MAX) {
        setErrors({ kcal: rangeMessage(GOAL_KCAL_MIN, GOAL_KCAL_MAX) });
        inputs[0]?.focus();
        return;
      }

      const rounded = Math.round(kcal);
      onSave({ kcal: rounded, ...gramsFromKcal(rounded, ratio), mode: 'kcal', ratio });
      return;
    }

    const nextErrors: FieldErrors = {};
    NUTRIENTS.forEach(({ key }) => {
      const value = grams[key];
      const { min, max } = NUTRIENT_LIMITS[key];
      if (value === null || value < min || value > max) nextErrors[key] = rangeMessage(min, max);
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || isTotalOutOfRange || totalKcal === null) {
      // 첫 번째로 틀린 칸으로 포커스를 옮겨요. 합계만 범위를 벗어났으면 탄수화물 칸으로요.
      const firstInvalid = NUTRIENTS.findIndex(({ key }) => nextErrors[key]);
      inputs[Math.max(firstInvalid, 0)]?.focus();
      return;
    }

    const carbs = Math.round(grams.carbs!);
    const protein = Math.round(grams.protein!);
    const fat = Math.round(grams.fat!);
    onSave({ kcal: kcalFromGrams(carbs, protein, fat), carbs, protein, fat, mode: 'nut', ratio: null });
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* 탭과 설명을 위아래로 두어 설명이 탭 옆으로 밀리지 않게 해요. */}
      <div className="flex flex-col gap-2">
        <SegmentedControl ariaLabel="목표 설정 방식" size="sm" options={MODE_OPTIONS} value={mode} onChange={changeMode} />
        <p className="m-0 text-[13px] text-(--ink-2)">
          {mode === 'kcal' ? '칼로리와 비율을 정하면 탄·단·지 g을 계산해요.' : '탄·단·지 g을 정하면 칼로리를 계산해요.'}
        </p>
      </div>

      {mode === 'kcal' ? (
        <>
          <div className="grid grid-cols-[minmax(0,200px)]">
            <TextField
              label="하루 칼로리 (kcal)"
              inputMode="numeric"
              align="right"
              value={kcalText}
              placeholder="예: 1,500"
              error={errors.kcal}
              autoFocus
              onChange={event => setKcalText(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-[13px] text-(--ink-2)">
              <span>영양소 비율</span>
              <div role="group" aria-label="추천 비율" className="flex flex-wrap gap-1.5">
                {RATIO_PRESETS.map(preset => {
                  const isPressed = isSameRatio(preset.ratio, ratio);

                  return (
                    <button
                      key={preset.label}
                      type="button"
                      aria-pressed={isPressed}
                      onClick={() => setRatio(preset.ratio)}
                      className={`h-7.5 cursor-pointer rounded-full border px-2.5 text-xs transition-colors duration-150 ${
                        isPressed
                          ? 'border-(--brand) bg-(--brand-soft) font-bold text-(--brand)'
                          : 'border-(--muted) bg-(--surface) text-(--ink) hover:border-(--brand) hover:text-(--brand)'
                      }`}
                    >
                      {preset.label}{' '}
                      <small className={isPressed ? 'text-(--brand)' : 'text-(--ink-2)'}>
                        {preset.ratio.carbs} : {preset.ratio.protein} : {preset.ratio.fat}
                      </small>
                    </button>
                  );
                })}
              </div>
            </div>

            <RatioSlider ratio={ratio} onChange={setRatio} />

            <div aria-live="polite" className="grid grid-cols-3 gap-2">
              {NUTRIENTS.map(({ key, label }) => (
                <div
                  key={key}
                  className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5 rounded-lg border border-(--line) px-2.5 py-1.5"
                >
                  <span className="flex basis-full items-center gap-1.5 text-xs text-(--ink-2) sm:basis-auto">
                    <i aria-hidden="true" className={`size-2 rounded-full ${NUTRIENT_DOT[key]}`} />
                    {label}
                  </span>
                  <b className="text-sm tabular-nums sm:ml-auto">{ratio[key]}%</b>
                  <span className="text-xs text-(--ink-2) tabular-nums">
                    {suggestedGrams ? `${formatInteger(suggestedGrams[key])} g` : '– g'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="m-0 text-xs text-(--ink-2)">
            g을 직접 고치고 싶으면{' '}
            <button
              type="button"
              onClick={() => changeMode('nut')}
              className="cursor-pointer border-0 bg-transparent p-0 font-bold text-(--brand) underline underline-offset-3"
            >
              영양소로 직접 정하기
            </button>
          </p>
        </>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            {NUTRIENTS.map(({ key, label, placeholder }, index) => (
              <TextField
                key={key}
                label={`${label} (g)`}
                inputMode="numeric"
                align="right"
                value={gramTexts[key]}
                placeholder={`예: ${placeholder}`}
                error={errors[key]}
                autoFocus={index === 0}
                onChange={event => {
                  const { value } = event.target;
                  setGramTexts(prev => ({ ...prev, [key]: value }));
                }}
              />
            ))}
          </div>

          <div
            aria-live="polite"
            className="flex flex-col items-center gap-0.5 rounded-lg bg-(--skel) px-4 py-3 text-center text-[13px] text-(--ink-2)"
          >
            {/* 제목·합계·계산 방법을 가운데에 모아서 빈 공간이 생기지 않게 해요. */}
            <p className="m-0 flex items-baseline gap-2 text-base text-(--ink)">
              하루 칼로리
              <b className="text-xl font-bold tabular-nums">
                {totalKcal === null ? '–' : formatInteger(totalKcal)}
                <small className="ml-0.5 text-sm font-normal text-(--ink-2)">kcal</small>
              </b>
            </p>
            <small className="text-[11px] text-(--ink-2)">
              {totalKcal === null ? '탄·단·지를 모두 입력하면 계산돼요' : '탄·단 1g = 4kcal, 지 1g = 9kcal'}
            </small>
            {goal && kcalGap !== 0 && (
              <p className="m-0 mt-1.5 border-t border-(--line) pt-1.5 text-xs text-(--ink-2)">
                저장된 목표는 {formatInteger(goal.kcal)}kcal예요.{' '}
                {isSavedGrams
                  ? `g을 정수로 반올림해서 ${formatInteger(Math.abs(kcalGap))}kcal 차이가 나요.`
                  : `지금 값과 ${formatInteger(Math.abs(kcalGap))}kcal 차이가 나요.`}
                <br />
                이대로 저장하면 {formatInteger(totalKcal!)}kcal로 바뀌어요.
              </p>
            )}
            {isTotalOutOfRange && (
              <p className="m-0 mt-1 text-(--err)">
                칼로리가 {formatInteger(GOAL_KCAL_MIN)}~{formatInteger(GOAL_KCAL_MAX)}kcal 사이가 되도록 조정해 주세요.
              </p>
            )}
          </div>
        </>
      )}

      {/* 목표를 정할 때 참고하는 성인 남녀 하루 필요 칼로리. 입력칸 아래 작은 안내로 보여요. */}
      <div className="flex flex-col gap-1 border-l-2 border-(--line) pl-3 text-xs text-(--ink-2)">
        <p className="m-0 flex flex-wrap gap-x-3 gap-y-0.5">
          <span>참고 · 성인 하루 필요 칼로리 (19~49세)</span>
          {ADULT_ENERGY_REFERENCES.map(({ sex, min, max }) => (
            <span key={sex}>
              {sex}{' '}
              <b className="font-medium text-(--ink) tabular-nums">
                {formatInteger(min)}~{formatInteger(max)}kcal
              </b>
            </span>
          ))}
        </p>
        <p className="m-0 text-(--muted)">출처: 2020 한국인 영양소 섭취기준(보건복지부)</p>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-(--line) pt-4">
        {/* 저장은 초록으로 채우고, 취소는 테두리 버튼이라 한눈에 구분돼요. */}
        <Button variant="ok" type="submit" disabled={isSaving}>
          {isSaving ? '저장 중' : '저장'}
        </Button>
        <Button onClick={onCancel} disabled={isSaving}>
          취소
        </Button>
      </div>
    </form>
  );
}
