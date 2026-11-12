import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import type { NutrientRatio } from '../types';

type RatioSliderProps = {
  ratio: NutrientRatio;
  onChange: (ratio: NutrientRatio) => void;
};

type Handle = 'first' | 'second';

const STEP = 5;

const SEGMENTS = [
  { key: 'carbs', color: 'bg-(--carbs)' },
  { key: 'protein', color: 'bg-(--protein)' },
  { key: 'fat', color: 'bg-(--fat)' },
] as const;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * 탄·단·지 비율을 손잡이 두 개로 나누는 막대.
 * - 첫 손잡이: 탄수화물 | 단백질 경계, 두 번째 손잡이: 단백질 | 지방 경계
 * - 끌거나(마우스·터치), 손잡이에 포커스를 두고 화살표 키로 5%씩 움직여요.
 */
export default function RatioSlider({ ratio, onChange }: RatioSliderProps) {
  const barRef = useRef<HTMLDivElement>(null);
  // 단백질이 0%라 두 손잡이가 겹쳐 있을 때, 처음 움직이는 방향으로 어느 손잡이인지 정해요.
  const draggingRef = useRef<Handle | 'undecided' | null>(null);

  const firstEdge = ratio.carbs;
  const secondEdge = ratio.carbs + ratio.protein;

  const moveHandle = (handle: Handle, percent: number) => {
    const snapped = Math.round(percent / STEP) * STEP;
    let first = firstEdge;
    let second = secondEdge;

    if (handle === 'first') first = clamp(snapped, 0, second);
    else second = clamp(snapped, first, 100);

    onChange({ carbs: first, protein: second - first, fat: 100 - second });
  };

  const percentFromPointer = (clientX: number) => {
    const bar = barRef.current;
    if (!bar) return 0;

    const rect = bar.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  };

  const handlePointerDown = (handle: Handle) => (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // 손가락이 손잡이 밖으로 나가도 계속 이 손잡이로 이벤트가 오게 붙잡아요.
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus();
    draggingRef.current = firstEdge === secondEdge ? 'undecided' : handle;
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const dragging = draggingRef.current;
    if (!dragging) return;

    const percent = percentFromPointer(event.clientX);

    if (dragging === 'undecided') {
      if (Math.abs(percent - firstEdge) < STEP / 2) return;
      draggingRef.current = percent < firstEdge ? 'first' : 'second';
    }

    moveHandle(draggingRef.current as Handle, percent);
  };

  const stopDragging = () => {
    draggingRef.current = null;
  };

  const handleKeyDown = (handle: Handle) => (event: KeyboardEvent<HTMLButtonElement>) => {
    const delta = { ArrowLeft: -STEP, ArrowDown: -STEP, ArrowRight: STEP, ArrowUp: STEP }[event.key];
    if (!delta) return;

    event.preventDefault();
    moveHandle(handle, (handle === 'first' ? firstEdge : secondEdge) + delta);
  };

  const handles = [
    {
      handle: 'first' as const,
      edge: firstEdge,
      label: '탄수화물과 단백질 경계',
      valueText: `탄수화물 ${ratio.carbs}%, 단백질 ${ratio.protein}%`,
    },
    {
      handle: 'second' as const,
      edge: secondEdge,
      label: '단백질과 지방 경계',
      valueText: `단백질 ${ratio.protein}%, 지방 ${ratio.fat}%`,
    },
  ];

  return (
    <div ref={barRef} className="relative my-1.5 flex h-2 touch-none gap-0.75 select-none">
      {SEGMENTS.map(({ key, color }) =>
        ratio[key] > 0 ? (
          <span
            key={key}
            aria-hidden="true"
            className={`block h-full min-w-0 rounded-full ${color}`}
            style={{ flex: `${ratio[key]} 1 0` }}
          />
        ) : null
      )}

      {handles.map(({ handle, edge, label, valueText }) => (
        <button
          key={handle}
          type="button"
          role="slider"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={edge}
          aria-valuetext={valueText}
          onPointerDown={handlePointerDown(handle)}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onKeyDown={handleKeyDown(handle)}
          className="absolute top-1/2 size-5.5 -translate-1/2 cursor-grab rounded-full border-2 border-(--ink) bg-(--surface) shadow-[0_1px_3px_rgba(0,0,0,0.18)] active:cursor-grabbing"
          style={{ left: `${edge}%` }}
        />
      ))}
    </div>
  );
}
