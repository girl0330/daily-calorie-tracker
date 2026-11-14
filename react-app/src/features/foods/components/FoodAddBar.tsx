import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type RefObject } from 'react';
import Button from '../../../components/common/Button';
import SegmentedControl from '../../../components/common/SegmentedControl';
import TextField from '../../../components/common/TextField';
import { showToast } from '../../../store/toastStore';
import type { FoodItem, MealType, UserId } from '../../../types/types';
import { formatInteger } from '../../../utils/formatNumber';
import { useCreateFood } from '../hooks/useFoodMutations';
import {
  EMPTY_FOOD_FORM,
  MEAL_LABEL,
  MEAL_OPTIONS,
  acceptsFieldInput,
  getFirstInvalidField,
  getPreviewKcal,
  parseFoodForm,
  validateFoodForm,
  type FoodField,
  type FoodFormErrors,
  type FoodFormValues,
} from '../utils/foodForm';

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

const NUTRIENT_FIELDS = [
  { key: 'carbs', label: '탄수화물 g' },
  { key: 'protein', label: '단백질 g' },
  { key: 'fat', label: '지방 g' },
] as const;

// 입력칸 라벨과 같은 높이의 보이지 않는 글자. 모바일은 줄이 넘어가서 맞출 칸이 없으니 빼요.
const labelSpacerClassName = 'invisible text-[13px] max-md:hidden';

/**
 * 시안의 .search: 위의 입력 줄 + 아래로 펼쳐지는 입력판.
 * 지금은 '직접 입력'만 있어요. 8단계에서 버튼이 'AI 검색'으로 바뀌고 후보 목록이 더해져요.
 */
export default function FoodAddBar({ userId, recordDate, meal, onMealChange, inputRef, onAdded }: FoodAddBarProps) {
  const inputId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Partial<Record<FoodField, HTMLInputElement | null>>>({});
  // 입력판이 화면에 붙은 뒤에 옮길 포커스. 판이 열리는 렌더가 끝나야 칸이 생겨요.
  const pendingFocusRef = useRef<FoodField | null>(null);

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FoodFormValues>(EMPTY_FOOD_FORM);
  const [errors, setErrors] = useState<FoodFormErrors>({});

  const { mutate: createFood, isPending } = useCreateFood(userId);

  useEffect(() => {
    const field = pendingFocusRef.current;
    if (!field) return;
    pendingFocusRef.current = null;
    fieldRefs.current[field]?.focus();
  });

  // 입력판 바깥을 누르면 닫아요.
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // 입력 줄의 글자를 음식 이름으로 넣고 입력판을 열어요. 이름이 있으면 탄수화물 칸부터 채우게 해요.
  const openEditor = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const foodName = query.trim();
    setForm({ ...EMPTY_FOOD_FORM, foodName });
    setErrors({});
    setIsOpen(true);
    pendingFocusRef.current = foodName ? 'carbs' : 'foodName';
  };

  const handleEscape = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      close();
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
          close();
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

  return (
    <div ref={containerRef} onKeyDown={handleEscape} className="relative">
      <form
        onSubmit={openEditor}
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
          음식 이름
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
          className="h-8.5 shrink-0 cursor-pointer rounded-lg bg-[#dbc0a7] px-3.5 text-[13px] font-bold text-[#2b2623] transition-colors duration-150 hover:bg-[#cfae90]"
        >
          직접 입력
        </button>
      </form>

      {isOpen && (
        <div className="absolute inset-x-0 top-14 z-10 rounded-b-xl border border-t-0 border-(--ink) bg-(--surface) p-2 shadow-(--shadow)">
          {/*
            시안처럼 칸·시간대·kcal·버튼을 한 줄에 둬요. 화면이 좁으면 넘치는 것부터 다음 줄로 내려가요.
            칸이 아닌 묶음(시간대, kcal·버튼) 위에는 라벨 높이만큼 보이지 않는 글자를 둬서 입력칸과 높이를 맞춰요.
            그래서 칸 아래에 오류 문구가 생겨도 칸 아래만 늘어나고 줄이 어긋나지 않아요.
          */}
          <form
            noValidate
            onSubmit={handleAdd}
            autoComplete="off"
            className="flex flex-wrap items-start gap-3 px-3 pt-3.5 pb-2"
          >
            <TextField
              ref={element => {
                fieldRefs.current.foodName = element;
              }}
              label="음식 이름"
              value={form.foodName}
              error={errors.foodName}
              onChange={event => setField('foodName', event.target.value)}
              className="flex-[1_1_100%] md:flex-[1_1_140px]"
            />
            {NUTRIENT_FIELDS.map(({ key, label }) => (
              <TextField
                key={key}
                ref={element => {
                  fieldRefs.current[key] = element;
                }}
                label={label}
                inputMode="decimal"
                align="right"
                value={form[key]}
                placeholder="0"
                error={errors[key]}
                onChange={event => setField(key, event.target.value)}
                className="flex-[1_1_30%] md:w-24 md:flex-none"
              />
            ))}
            <div className="flex flex-col gap-1.5">
              <span aria-hidden="true" className={labelSpacerClassName}>
                시간대
              </span>
              <SegmentedControl ariaLabel="시간대" options={MEAL_OPTIONS} value={meal} onChange={onMealChange} />
            </div>

            <div className="flex flex-col gap-1.5">
              <span aria-hidden="true" className={labelSpacerClassName}>
                추가
              </span>
              <div className="flex items-center gap-2">
                <span className="mr-1 inline-block min-w-28 text-right text-sm whitespace-nowrap text-(--ink-2)">
                  <b className="text-[17px] text-(--ink) tabular-nums">{formatInteger(getPreviewKcal(form))}</b> kcal
                </span>
                <Button size="lg" onClick={close}>
                  취소
                </Button>
                {/* 저장 중에도 disabled로 만들지 않아요. 포커스가 body로 날아가서, 클릭만 handleAdd에서 무시해요. */}
                <Button size="lg" variant="brand" type="submit" className="whitespace-nowrap">
                  {isPending ? '추가하는 중' : '추가'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
