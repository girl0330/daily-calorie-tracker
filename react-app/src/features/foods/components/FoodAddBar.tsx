import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type RefObject } from 'react';
import Button from '../../../components/common/Button';
import { showToast } from '../../../store/toastStore';
import type { FoodItem, MealType, UserId } from '../../../types/types';
import { useCreateFood } from '../hooks/useFoodMutations';
import { searchFoodsApi, type FoodCandidate } from '../services/FoodSearchService';
import {
  EMPTY_FOOD_FORM,
  MEAL_LABEL,
  acceptsFieldInput,
  getFirstInvalidField,
  parseFoodForm,
  validateFoodForm,
  type FoodField,
  type FoodFormErrors,
  type FoodFormValues,
} from '../utils/foodForm';
import FoodEntryForm from './FoodEntryForm';
import FoodSearchResults from './FoodSearchResults';

type FoodAddBarProps = {
  userId: UserId;
  recordDate: string;
  /** 추가판의 시간대. 표의 '+ 추가'로도 바뀌어서 페이지가 들고 있어요. */
  meal: MealType;
  onMealChange: (meal: MealType) => void;
  /** 입력 줄의 칸. 표의 '+ 추가'가 여기로 포커스를 옮겨요. */
  inputRef: RefObject<HTMLInputElement | null>;
  onAdded: (food: FoodItem) => void;
};

/**
 * 아래 판의 상태.
 * idle: 닫힘 / loading: 찾는 중 / results: 후보 목록(고르면 아래에 입력칸) / notfound: 못 찾음
 * error: 검색 실패 / manual: 직접 입력
 */
type Phase = 'idle' | 'loading' | 'results' | 'notfound' | 'error' | 'manual';

// 후보의 양에서 괄호 앞부분만 이름 뒤에 붙여요. 예) 김밥 + '1줄 (약 230g)' → '김밥 1줄'
const toFoodName = ({ name, serving }: FoodCandidate) => `${name} ${serving.split(' (')[0]}`.trim();

/**
 * 시안의 .search: 위의 검색 줄 + 아래로 펼쳐지는 판.
 * 검색어를 넣고 'AI 검색'을 누르면 후보를 찾아요. 비워 두고 누르면 바로 직접 입력판을 열어요.
 */
export default function FoodAddBar({
  userId,
  recordDate,
  meal,
  onMealChange,
  inputRef,
  onAdded,
}: FoodAddBarProps) {
  const inputId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Partial<Record<FoodField, HTMLInputElement | null>>>({});
  // 입력판이 화면에 붙은 뒤에 옮길 포커스. 판이 열리는 렌더가 끝나야 칸이 생겨요.
  const pendingFocusRef = useRef<FoodField | null>(null);
  // 마지막 검색 번호. 늦게 온 예전 검색 결과는 버려요.
  const searchIdRef = useRef(0);

  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [results, setResults] = useState<FoodCandidate[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [form, setForm] = useState<FoodFormValues>(EMPTY_FOOD_FORM);
  const [errors, setErrors] = useState<FoodFormErrors>({});

  const { mutate: createFood, isPending } = useCreateFood(userId);

  const isOpen = phase !== 'idle';

  useEffect(() => {
    const field = pendingFocusRef.current;
    if (!field) return;
    pendingFocusRef.current = null;
    fieldRefs.current[field]?.focus();
  });

  const close = () => {
    searchIdRef.current += 1;
    setPhase('idle');
    setSelectedIndex(null);
  };

  // 판 바깥을 누르면 닫아요.
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        searchIdRef.current += 1;
        setPhase('idle');
        setSelectedIndex(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  const closeAndFocusInput = () => {
    close();
    inputRef.current?.focus();
  };

  // 직접 입력판을 열어요. 이름이 있으면 탄수화물 칸부터 채우게 해요.
  const openManual = (foodName: string) => {
    searchIdRef.current += 1;
    setForm({ ...EMPTY_FOOD_FORM, foodName });
    setErrors({});
    setSelectedIndex(null);
    setPhase('manual');
    pendingFocusRef.current = foodName ? 'carbs' : 'foodName';
  };

  const search = (text: string) => {
    const id = ++searchIdRef.current;
    setSearchedQuery(text);
    setSelectedIndex(null);
    setPhase('loading');

    searchFoodsApi(text)
      .then(found => {
        if (id !== searchIdRef.current) return;
        setResults(found);
        setPhase(found.length > 0 ? 'results' : 'notfound');
      })
      .catch(() => {
        if (id === searchIdRef.current) setPhase('error');
      });
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = query.trim();
    if (text) search(text);
    else openManual('');
  };

  // 후보를 고르면 아래 입력칸에 값을 채워요. 포커스는 고른 후보에 그대로 둬요.
  const pick = (index: number) => {
    const candidate = results[index];
    setSelectedIndex(index);
    setForm({
      foodName: toFoodName(candidate),
      carbs: String(candidate.carbs),
      protein: String(candidate.protein),
      fat: String(candidate.fat),
    });
    setErrors({});
  };

  const handleEscape = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      closeAndFocusInput();
    }
  };

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    const nextErrors = validateFoodForm(form);
    setErrors(nextErrors);

    const firstInvalid = getFirstInvalidField(nextErrors);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    createFood(
      { userId, mealType: meal, recordDate, ...parseFoodForm(form) },
      {
        onSuccess: food => {
          showToast(`${MEAL_LABEL[food.mealType]}에 ${food.foodName} 추가됨`);
          setQuery('');
          setForm(EMPTY_FOOD_FORM);
          closeAndFocusInput();
          onAdded(food);
        },
        onError: () => showToast('음식을 추가하지 못했어요. 다시 시도해 주세요.'),
      }
    );
  };

  // 고치기 시작한 칸의 오류 문구는 바로 지워요. 다시 검사하는 건 '추가'를 누를 때예요.
  const setField = (field: FoodField, value: string) => {
    if (!acceptsFieldInput(field, value)) return;
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const entryForm = (isFromSearch: boolean) => (
    <FoodEntryForm
      form={form}
      errors={errors}
      meal={meal}
      onMealChange={onMealChange}
      onFieldChange={setField}
      registerField={field => element => {
        fieldRefs.current[field] = element;
      }}
      isPending={isPending}
      onSubmit={handleAdd}
      onCancel={closeAndFocusInput}
      isFromSearch={isFromSearch}
    />
  );

  return (
    <div ref={containerRef} onKeyDown={handleEscape} className="relative">
      <form
        onSubmit={handleSearch}
        autoComplete="off"
        className={`flex h-14 items-center gap-3 border border-(--ink) pr-2 pl-4.5 transition-shadow duration-150 focus-within:shadow-[0_0_0_3px_var(--brand-soft)] ${
          isOpen ? 'rounded-t-xl border-b-(--line)' : 'rounded-xl'
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          className="shrink-0 text-(--muted)"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <label htmlFor={inputId} className="sr-only">
          음식 검색
        </label>
        <input
          ref={inputRef}
          id={inputId}
          value={query}
          placeholder="음식 입력 예: 김밥 1줄"
          onChange={event => setQuery(event.target.value)}
          className="h-11 min-w-0 flex-1 bg-transparent text-base text-(--ink) placeholder:text-(--muted) focus-visible:outline-none"
        />
        {/* 시안의 .go 버튼 색은 라이트·다크 모두 같은 고정값이에요. */}
        <button
          type="submit"
          aria-expanded={isOpen}
          className="h-8.5 shrink-0 cursor-pointer rounded-lg bg-[#dbc0a7] px-3.5 text-[13px] font-bold whitespace-nowrap text-[#2b2623] transition-colors duration-150 hover:bg-[#cfae90]"
        >
          AI 검색
        </button>
      </form>

      {isOpen && (
        <div className="absolute inset-x-0 top-14 z-10 rounded-b-xl border border-t-0 border-(--ink) bg-(--surface) p-2 shadow-(--shadow)">
          {phase === 'loading' && (
            <div role="status" className="px-1 pb-1">
              <p className="m-0 px-2 pt-1.5 text-[13px] font-medium text-(--ok)">‘{searchedQuery}’ 영양 정보를 찾는 중…</p>
              {[0, 150, 300].map(delay => (
                <div
                  key={delay}
                  className="mt-1.5 h-12 animate-skeleton rounded-lg bg-(--skel) motion-reduce:animate-none"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          )}

          {phase === 'results' && (
            <>
              <FoodSearchResults
                results={results}
                selectedIndex={selectedIndex}
                onPick={pick}
                onManual={() => openManual(searchedQuery)}
              />
              {selectedIndex !== null && entryForm(true)}
            </>
          )}

          {phase === 'notfound' && (
            <div className="flex flex-wrap items-center justify-between gap-4 px-3 py-5">
              <div role="status">
                <strong>‘{searchedQuery}’에 맞는 음식을 찾지 못했어요</strong>
                <span className="block text-[13px] text-(--ink-2)">
                  음식 이름과 양을 조금 더 구체적으로 적어 주세요. 예: 김밥 1줄
                </span>
              </div>
              <Button onClick={() => openManual(searchedQuery)}>직접 입력</Button>
            </div>
          )}

          {phase === 'error' && (
            <div role="alert" className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-(--err-soft) px-3 py-5">
              <div>
                <strong className="text-(--err)">AI 검색에 실패했어요</strong>
                <span className="block text-[13px] text-(--ink-2)">잠시 후 다시 시도하거나 값을 직접 입력할 수 있어요.</span>
              </div>
              <div className="flex gap-2">
                <Button variant="brand" onClick={() => search(searchedQuery)}>
                  다시 시도
                </Button>
                <Button onClick={() => openManual(searchedQuery)}>직접 입력</Button>
              </div>
            </div>
          )}

          {phase === 'manual' && entryForm(false)}
        </div>
      )}
    </div>
  );
}
