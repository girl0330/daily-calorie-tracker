import { calories } from '../../../utils/calculate';
import { formatGram, formatInteger } from '../../../utils/formatNumber';
import type { FoodCandidate } from '../services/FoodSearchService';

type FoodSearchResultsProps = {
  results: FoodCandidate[];
  /** 고른 후보의 순서. 아직 안 골랐으면 null */
  selectedIndex: number | null;
  onPick: (index: number) => void;
  onManual: () => void;
};

const MACROS = [
  { key: 'carbs', short: '탄' },
  { key: 'protein', short: '단' },
  { key: 'fat', short: '지' },
] as const;

/**
 * 시안의 AI 추천 결과 목록(.rhead + .cands).
 * 모든 후보 줄이 같은 칸 폭을 함께 써서(subgrid) 탄·단·지가 세로로 맞고, 칸 사이는 같은 간격이에요.
 * 데스크톱은 이름 옆에 양을, 모바일은 이름 아래에 양을 둬요.
 */
export default function FoodSearchResults({ results, selectedIndex, onPick, onManual }: FoodSearchResultsProps) {
  return (
    <div>
      <p className="sr-only" role="status">
        후보 {results.length}개를 찾았어요
      </p>
      <div className="flex items-center justify-between gap-3 py-1.5 pl-3 text-xs text-(--ink-2)">
        <span>AI 추천 결과 · 하나를 고르세요</span>
        <button
          type="button"
          onClick={onManual}
          className="h-8 cursor-pointer rounded-lg px-3 text-[13px] font-bold whitespace-nowrap text-(--brand) transition-colors duration-150 hover:bg-(--skel)"
        >
          직접 입력하기
        </button>
      </div>

      <div role="group" aria-label="AI 추천 결과" className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto_auto]">
        {results.map((candidate, index) => {
          const isSelected = index === selectedIndex;
          const kcal = calories(candidate.carbs, candidate.protein, candidate.fat);

          return (
            <button
              key={index}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onPick(index)}
              className={`col-span-full grid min-h-13 cursor-pointer grid-cols-subgrid items-center gap-x-2 px-3 py-1.5 text-left text-sm tabular-nums transition-colors duration-150 not-last:shadow-[inset_0_-1px_0_var(--line)] md:gap-x-7 ${
                isSelected ? 'bg-(--brand-soft)' : 'hover:bg-(--skel)'
              }`}
            >
              <span className="flex min-w-0 flex-col md:flex-row md:items-baseline md:gap-2.5">
                <strong className="font-bold">{candidate.name}</strong>
                <span className="text-[13px] text-(--ink-2)">{candidate.serving}</span>
              </span>
              {MACROS.map(({ key, short }) => (
                <span key={key} className="text-xs whitespace-nowrap text-(--ink-2) md:text-[13px] md:text-(--ink)">
                  <span className="text-(--ink-2)">{short}</span> {formatGram(candidate[key])}
                  <span className="text-(--ink-2) md:ml-[0.3em]">g</span>
                </span>
              ))}
              <span className="text-right whitespace-nowrap">
                <b>{formatInteger(kcal)}</b> <small className="text-xs text-(--ink-2)">kcal</small>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
