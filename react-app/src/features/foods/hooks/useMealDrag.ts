import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import type { MealType } from '../../../types/types';

/**
 * edit: 데스크톱에서 수정 중인 줄의 시간대 손잡이를 끌어요. 놓으면 수정 중인 값만 바뀌고 ✓를 눌러야 저장돼요.
 * press: 모바일에서 줄을 꾹 눌러 끌어요. 놓으면 바로 저장해요.
 */
export type MealDragMode = 'edit' | 'press';

export type MealDragState = {
  id: number;
  from: MealType;
  /** 포인터 아래에 있는 시간대. 표 밖이면 null */
  over: MealType | null;
  mode: MealDragMode;
};

type UseMealDragOptions = {
  /** 놓을 수 있는 줄(data-meal)을 찾을 표 */
  tableRef: RefObject<HTMLElement | null>;
  onDrop: (id: number, mode: MealDragMode, to: MealType) => void;
};

/** 손잡이는 이만큼 움직여야 끌기가 시작돼요. 그냥 누르기만 하면 포커스·클릭이에요. */
const EDIT_THRESHOLD = 6;
/** 꾹 누르기 시간 */
const LONG_PRESS_MS = 450;
/** 꾹 누르는 중에 이만큼 움직이면 스크롤로 보고 끌기를 그만둬요. */
const PRESS_SLOP = 8;

const GHOST_STYLE: Partial<CSSStyleDeclaration> = {
  position: 'fixed',
  zIndex: '50',
  margin: '0',
  pointerEvents: 'none',
  background: 'var(--surface)',
  borderRadius: '8px',
  boxShadow: '0 12px 30px rgba(43, 38, 35, 0.24)',
  opacity: '0.97',
  animation: 'none',
};

// 끄는 줄의 사본(고스트)을 만들어 화면 위에 띄워요. 시간대 글씨(data-drag-hide)는 숨겨요.
const createGhost = (row: HTMLElement) => {
  const rect = row.getBoundingClientRect();
  const ghost = row.cloneNode(true) as HTMLElement;
  ghost.removeAttribute('data-meal');
  ghost.setAttribute('aria-hidden', 'true');
  ghost.inert = true;
  ghost.querySelectorAll<HTMLElement>('[data-drag-hide]').forEach(element => {
    element.style.visibility = 'hidden';
  });
  Object.assign(ghost.style, GHOST_STYLE, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px` });
  document.body.appendChild(ghost);
  return { ghost, top: rect.top };
};

// 표의 시간대 줄을 끌어서 다른 시간대로 옮겨요.
export function useMealDrag({ tableRef, onDrop }: UseMealDragOptions) {
  const [drag, setDrag] = useState<MealDragState | null>(null);
  // 지금 진행 중인 끌기를 끝내는 함수. 없으면 null
  const disposeRef = useRef<(() => void) | null>(null);
  // 리스너 안에서 늘 최신 onDrop을 쓰도록 ref에 담아 둬요.
  const onDropRef = useRef(onDrop);
  useEffect(() => {
    onDropRef.current = onDrop;
  });

  // 끄는 중에 화면을 떠나도 고스트와 리스너가 남지 않게 해요.
  useEffect(() => () => disposeRef.current?.(), []);

  const begin = (event: ReactPointerEvent, row: HTMLElement, id: number, from: MealType, mode: MealDragMode) => {
    if (event.button !== 0 || disposeRef.current) return;

    const startX = event.clientX;
    const startY = event.clientY;
    let started = false;
    let ghost: HTMLElement | null = null;
    let offsetY = 0;
    let over: MealType | null = from;

    const mealAt = (x: number, y: number): MealType | null => {
      const target = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-meal]');
      if (!target || !tableRef.current?.contains(target)) return null;
      return target.dataset.meal as MealType;
    };

    const start = (y: number) => {
      const created = createGhost(row);
      ghost = created.ghost;
      offsetY = y - created.top;
      started = true;
      document.body.style.cursor = 'grabbing';
      if (mode === 'press') navigator.vibrate?.(15);
      setDrag({ id, from, over: from, mode });
    };

    const timer = mode === 'press' ? window.setTimeout(() => start(startY), LONG_PRESS_MS) : null;

    const handleMove = (moveEvent: PointerEvent) => {
      if (!started) {
        const distance = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);
        if (mode === 'edit' && distance > EDIT_THRESHOLD) start(moveEvent.clientY);
        else if (mode === 'press' && distance > PRESS_SLOP) dispose();
        return;
      }

      if (ghost) ghost.style.top = `${moveEvent.clientY - offsetY}px`;
      const next = mealAt(moveEvent.clientX, moveEvent.clientY);
      if (next !== over) {
        over = next;
        setDrag(prev => (prev ? { ...prev, over: next } : prev));
      }
    };

    const handleUp = () => {
      const target = started ? over : null;
      dispose();
      if (target && target !== from) onDropRef.current(id, mode, target);
    };

    const handleKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === 'Escape' && started) {
        // 수정 줄의 Esc(수정 취소)까지 가지 않게, 끌기만 그만둬요.
        keyEvent.preventDefault();
        keyEvent.stopPropagation();
        dispose();
      }
    };

    // 끄는 동안 화면이 스크롤되지 않게 막아요. React의 onTouchMove로는 막을 수 없어서 직접 달아요.
    const preventScroll = (touchEvent: TouchEvent) => {
      if (started) touchEvent.preventDefault();
    };

    // 꾹 누르면 휴대폰이 띄우는 메뉴(복사 등)를 막아요.
    const preventMenu = (menuEvent: Event) => {
      if (mode === 'press') menuEvent.preventDefault();
    };

    function dispose() {
      if (timer !== null) window.clearTimeout(timer);
      ghost?.remove();
      document.body.style.removeProperty('cursor');
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', dispose);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('contextmenu', preventMenu);
      disposeRef.current = null;
      setDrag(null);
    }

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', dispose);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('contextmenu', preventMenu);
    disposeRef.current = dispose;
  };

  return { drag, begin };
}
