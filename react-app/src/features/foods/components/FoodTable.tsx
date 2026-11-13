import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { showToast } from '../../../store/toastStore';
import type { FoodItem, MealType, UserId } from '../../../types/types';
import { calories } from '../../../utils/calculate';
import { formatGram, formatInteger } from '../../../utils/formatNumber';
import type { DailyTotals } from '../../tracker/components/daily/DailyStats';
import { useRemoveFood, useUpdateFood } from '../hooks/useFoodMutations';
import {
  MEAL_LABEL,
  MEAL_OPTIONS,
  getFirstInvalidField,
  getPreviewKcal,
  parseFoodForm,
  toFoodFormValues,
  validateFoodForm,
  type FoodField,
  type FoodFormErrors,
  type FoodFormValues,
} from '../utils/foodForm';

type FoodTableProps = {
  userId: UserId;
  /** 선택한 날의 음식 */
  foods: FoodItem[];
  totals: DailyTotals;
  /** 지금 수정 중인 줄. 페이지가 들고 있어서, 수정 중에는 날짜를 못 바꾸게 막아요. */
  editingId: number | null;
  onEditingChange: (id: number | null) => void;
  /** 방금 추가하거나 고친 줄. 잠깐 반짝여요. */
  highlightId: number | null;
  onEdited: (food: FoodItem) => void;
  /** 빈 시간대의 '+ 추가' */
  onAddHere: (meal: MealType) => void;
};

// 시안의 .tr: 데스크톱 7칸(시간대, 음식, 탄, 단, 지, kcal, 작업), 모바일 4칸(시간대, 음식, kcal, 작업)
const COLUMNS = 'grid-cols-[56px_minmax(0,1fr)_56px_84px] md:grid-cols-[90px_minmax(0,1fr)_100px_100px_100px_100px_96px]';
const ROW = `grid min-h-13 items-center border-b border-(--line-soft) *:px-2 ${COLUMNS}`;

const LOCKED_TITLE = '수정 중인 줄을 저장하거나 취소한 뒤에 쓸 수 있어요';

const iconButtonClassName =
  'inline-flex size-10 cursor-pointer items-center justify-center rounded-lg text-(--ink-2) transition-colors duration-150 hover:bg-(--skel) disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent';

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

const sortByCreated = (a: FoodItem, b: FoodItem) => (a.createdAt < b.createdAt ? -1 : 1);

export default function FoodTable({
  userId,
  foods,
  totals,
  editingId,
  onEditingChange,
  highlightId,
  onEdited,
  onAddHere,
}: FoodTableProps) {
  const { mutate: updateFood, isPending: isUpdating } = useUpdateFood(userId);
  const { mutate: removeFood } = useRemoveFood(userId);
  const [deleteTarget, setDeleteTarget] = useState<FoodItem | null>(null);

  // 수정·삭제 뒤 포커스를 옮길 버튼. 줄이 바뀌는 렌더가 끝난 뒤 그 버튼을 찾아 포커스를 줘요.
  const buttonsRef = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocusRef = useRef<string | null>(null);

  const registerButton = (key: string) => (element: HTMLButtonElement | null) => {
    if (element) buttonsRef.current.set(key, element);
    else buttonsRef.current.delete(key);
  };

  useEffect(() => {
    const key = pendingFocusRef.current;
    if (!key) return;

    const button = buttonsRef.current.get(key);
    if (button) {
      pendingFocusRef.current = null;
      button.focus();
    }
  });

  const groups = MEAL_OPTIONS.map(({ value, label }) => ({
    meal: value,
    label,
    foods: foods.filter(food => food.mealType === value).sort(sortByCreated),
  }));

  const isLocked = editingId !== null;

  const finishEditing = (food: FoodItem) => {
    pendingFocusRef.current = `edit-${food.id}`;
    onEditingChange(null);
  };

  const handleSave = (food: FoodItem, values: FoodFormValues) => {
    if (isUpdating) return;

    updateFood(
      { id: food.id, userId, mealType: food.mealType, recordDate: food.recordDate, ...parseFoodForm(values) },
      {
        onSuccess: updated => {
          showToast('수정했어요');
          finishEditing(food);
          onEdited(updated);
        },
        onError: () => showToast('수정하지 못했어요. 다시 시도해 주세요.'),
      },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    // 지운 줄 대신 같은 시간대의 다음 줄 → 앞 줄 → 그 시간대의 '+ 추가'로 포커스를 옮겨요.
    const mealFoods = groups.find(group => group.meal === deleteTarget.mealType)?.foods ?? [];
    const index = mealFoods.findIndex(food => food.id === deleteTarget.id);
    const neighbor = mealFoods[index + 1] ?? mealFoods[index - 1];
    pendingFocusRef.current = neighbor ? `delete-${neighbor.id}` : `add-${deleteTarget.mealType}`;

    const { id, foodName } = deleteTarget;
    setDeleteTarget(null);

    removeFood(id, {
      onSuccess: () => showToast(`${foodName} 기록을 삭제했어요`),
      onError: () => showToast('삭제하지 못했어요. 다시 시도해 주세요.'),
    });
  };

  return (
    <>
      <div role="table" aria-label="시간대별 음식 기록" className="tabular-nums">
        <div role="row" className={`${ROW} min-h-10 border-b-(--ink) text-[13px] text-(--ink-2)`}>
          <span role="columnheader">시간대</span>
          <span role="columnheader">음식</span>
          <span role="columnheader" className="text-right max-md:hidden">
            탄수화물 g
          </span>
          <span role="columnheader" className="text-right max-md:hidden">
            단백질 g
          </span>
          <span role="columnheader" className="text-right max-md:hidden">
            지방 g
          </span>
          <span role="columnheader" className="text-right">
            kcal
          </span>
          <span role="columnheader">
            <span className="sr-only">작업</span>
          </span>
        </div>

        {groups.map(({ meal, label, foods: mealFoods }) => {
          if (mealFoods.length === 0) {
            return (
              <div key={meal} role="row" className={`${ROW} border-b-(--line)`}>
                <span role="cell" className="font-bold">
                  {label}
                </span>
                <span role="cell" className="text-(--muted)">
                  기록 없음
                </span>
                <span role="cell" className="max-md:hidden" />
                <span role="cell" className="max-md:hidden" />
                <span role="cell" className="max-md:hidden" />
                <span role="cell" />
                <span role="cell" className="text-right">
                  <button
                    ref={registerButton(`add-${meal}`)}
                    type="button"
                    disabled={isLocked}
                    title={isLocked ? LOCKED_TITLE : undefined}
                    aria-label={`${label}에 음식 추가`}
                    onClick={() => onAddHere(meal)}
                    className="h-9 cursor-pointer rounded-lg px-3 text-[13px] font-bold text-(--brand) transition-colors duration-150 hover:bg-(--skel) disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    + 추가
                  </button>
                </span>
              </div>
            );
          }

          return mealFoods.map((food, index) => {
            const isFirst = index === 0;
            const isLast = index === mealFoods.length - 1;

            if (food.id === editingId) {
              return (
                <FoodEditRow
                  key={food.id}
                  food={food}
                  mealLabel={isFirst ? label : ''}
                  isLast={isLast}
                  onSave={values => handleSave(food, values)}
                  onCancel={() => finishEditing(food)}
                />
              );
            }

            return (
              <div
                key={food.id}
                role="row"
                className={`${ROW} max-md:py-2 ${isLast ? 'border-b-(--line)' : ''} ${
                  food.id === highlightId ? 'animate-row-flash motion-reduce:animate-none' : ''
                }`}
              >
                <span role="cell" className="font-bold">
                  {isFirst ? label : ''}
                </span>
                <span role="cell" className="min-w-0">
                  <span className="block truncate">{food.foodName}</span>
                  <small className="mt-0.5 block truncate text-xs text-(--ink-2) md:hidden">
                    탄 {formatGram(food.carbs)}g · 단 {formatGram(food.protein)}g · 지 {formatGram(food.fat)}g
                  </small>
                </span>
                <span role="cell" className="text-right max-md:hidden">
                  {formatGram(food.carbs)}
                </span>
                <span role="cell" className="text-right max-md:hidden">
                  {formatGram(food.protein)}
                </span>
                <span role="cell" className="text-right max-md:hidden">
                  {formatGram(food.fat)}
                </span>
                <span role="cell" className="text-right font-bold">
                  {formatInteger(calories(food.carbs, food.protein, food.fat))}
                </span>
                <span role="cell" className="flex justify-end gap-0.5 !px-0">
                  <button
                    ref={registerButton(`edit-${food.id}`)}
                    type="button"
                    disabled={isLocked}
                    title={isLocked ? LOCKED_TITLE : undefined}
                    aria-label={`${food.foodName} 수정`}
                    onClick={() => onEditingChange(food.id)}
                    className={iconButtonClassName}
                  >
                    <svg {...iconProps}>
                      <path d="M4 20h4L19 9a2.1 2.1 0 00-3-3L5 17v3z" />
                      <path d="M14 8l3 3" />
                    </svg>
                  </button>
                  <button
                    ref={registerButton(`delete-${food.id}`)}
                    type="button"
                    disabled={isLocked}
                    title={isLocked ? LOCKED_TITLE : undefined}
                    aria-label={`${food.foodName} 삭제`}
                    onClick={() => setDeleteTarget(food)}
                    className={iconButtonClassName}
                  >
                    <svg {...iconProps}>
                      <path d="M4 7h16" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12" />
                      <path d="M9 7V4h6v3" />
                    </svg>
                  </button>
                </span>
              </div>
            );
          });
        })}

        {/* 하루 합계. 모바일은 3칸(합계, 탄·단·지, kcal)으로 줄여요. */}
        <div
          role="row"
          className="grid min-h-14 grid-cols-[56px_minmax(0,1fr)_auto] items-center border-t border-(--ink) font-bold *:px-2 md:grid-cols-[90px_minmax(0,1fr)_100px_100px_100px_100px_96px]"
        >
          <span role="cell">합계</span>
          <span role="cell" className="min-w-0">
            <span className="text-[13px] font-normal text-(--ink-2) max-md:hidden">음식 {foods.length}개</span>
            <small className="flex flex-wrap gap-x-2 text-sm font-normal *:whitespace-nowrap md:hidden">
              <span>탄 {formatGram(totals.carbs)}g</span>
              <span>단 {formatGram(totals.protein)}g</span>
              <span>지 {formatGram(totals.fat)}g</span>
            </small>
          </span>
          {(['carbs', 'protein', 'fat'] as const).map(key => (
            <span key={key} role="cell" className="text-right max-md:hidden">
              <Amount value={formatGram(totals[key])} unit="g" />
            </span>
          ))}
          <span role="cell" className="text-right">
            <Amount value={formatInteger(totals.kcal)} unit="kcal" />
          </span>
          <span role="cell" className="max-md:hidden" />
        </div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="이 기록을 삭제할까요?"
        description="삭제하면 되돌릴 수 없어요."
        confirmLabel="삭제"
        cancelLabel="닫기"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      >
        {deleteTarget && (
          <dl className="mt-3.5 mb-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 rounded-lg bg-(--skel) px-3.5 py-3 text-sm">
            <dt className="text-(--ink-2)">시간대</dt>
            <dd className="m-0 text-right">{MEAL_LABEL[deleteTarget.mealType]}</dd>
            <dt className="text-(--ink-2)">음식</dt>
            <dd className="m-0 text-right break-all">{deleteTarget.foodName}</dd>
            <dt className="text-(--ink-2)">탄수화물</dt>
            <dd className="m-0 text-right tabular-nums">{formatGram(deleteTarget.carbs)} g</dd>
            <dt className="text-(--ink-2)">단백질</dt>
            <dd className="m-0 text-right tabular-nums">{formatGram(deleteTarget.protein)} g</dd>
            <dt className="text-(--ink-2)">지방</dt>
            <dd className="m-0 text-right tabular-nums">{formatGram(deleteTarget.fat)} g</dd>
            <dt className="text-(--ink-2)">kcal</dt>
            <dd className="m-0 text-right tabular-nums">
              <b>{formatInteger(calories(deleteTarget.carbs, deleteTarget.protein, deleteTarget.fat))}</b>
            </dd>
          </dl>
        )}
      </ConfirmDialog>
    </>
  );
}

// 합계 줄의 숫자. 데스크톱은 단위를 숫자 오른쪽 바깥에 걸어서 숫자끼리 오른쪽 끝이 맞게 해요.
// 모바일은 오른쪽에 빈 칸이 없어서 단위를 숫자 옆에 그냥 붙여요(시안과 같아요).
function Amount({ value, unit }: { value: string; unit: string }) {
  return (
    <span className="md:relative">
      {value}
      <span className="ml-[3px] font-normal text-(--ink-2) md:absolute md:top-0 md:left-full md:font-bold md:text-(--ink)">
        {unit}
      </span>
    </span>
  );
}

type FoodEditRowProps = {
  food: FoodItem;
  /** 시간대의 첫 줄일 때만 시간대 이름을 보여요. */
  mealLabel: string;
  isLast: boolean;
  onSave: (values: FoodFormValues) => void;
  onCancel: () => void;
};

const NUTRIENT_INPUTS = [
  { key: 'carbs', short: '탄', name: '탄수화물', label: '탄수화물 g' },
  { key: 'protein', short: '단', name: '단백질', label: '단백질 g' },
  { key: 'fat', short: '지', name: '지방', label: '지방 g' },
] as const;

const underlineInputClassName =
  'h-7 w-full rounded-none border-0 border-b bg-transparent px-0.5 text-[15px] text-(--ink) focus-visible:border-b-2 focus-visible:border-(--brand) focus-visible:outline-none md:h-7.5';

// 시안의 .editrow: 줄 안에서 바로 고치는 칸. 모바일은 탄·단·지 칸을 둘째 줄로 내려요.
function FoodEditRow({ food, mealLabel, isLast, onSave, onCancel }: FoodEditRowProps) {
  const errorId = useId();
  const [form, setForm] = useState<FoodFormValues>(() => toFoodFormValues(food));
  const [errors, setErrors] = useState<FoodFormErrors>({});
  const inputRefs = useRef<Partial<Record<FoodField, HTMLInputElement | null>>>({});

  const firstInvalid = getFirstInvalidField(errors);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateFoodForm(form);
    setErrors(nextErrors);

    const invalidField = getFirstInvalidField(nextErrors);
    if (invalidField) {
      inputRefs.current[invalidField]?.focus();
      return;
    }

    onSave(form);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
    }
  };

  const inputProps = (field: FoodField) => ({
    ref: (element: HTMLInputElement | null) => {
      inputRefs.current[field] = element;
    },
    value: form[field],
    'aria-invalid': !!errors[field],
    'aria-describedby': errors[field] ? errorId : undefined,
    onChange: (event: { target: { value: string } }) => {
      const { value } = event.target;
      setForm(prev => ({ ...prev, [field]: value }));
      // 고치기 시작한 칸의 오류는 바로 지워요.
      setErrors(prev => ({ ...prev, [field]: undefined }));
    },
  });

  const borderClassName = (field: FoodField) => (errors[field] ? 'border-(--err)' : 'border-(--muted)');

  return (
    <form
      role="row"
      noValidate
      autoComplete="off"
      aria-label={`${food.foodName} 수정`}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className={`grid min-h-13 items-center gap-y-0.5 border-b shadow-[inset_3px_0_0_var(--brand)] *:px-2 max-md:py-2 ${COLUMNS} ${
        isLast ? 'border-(--line)' : 'border-(--line-soft)'
      }`}
    >
      <span role="cell" className="font-bold">
        {mealLabel}
      </span>
      <span role="cell" className="min-w-0">
        <input
          {...inputProps('foodName')}
          type="text"
          autoFocus
          aria-label="음식 이름"
          className={`${underlineInputClassName} ${borderClassName('foodName')}`}
        />
      </span>

      {/* 데스크톱은 칸 3개로 펼치고, 모바일은 둘째 줄에 '탄 [ ] g'처럼 나란히 둬요. */}
      <span className="contents max-md:col-span-3 max-md:col-start-2 max-md:row-start-2 max-md:flex max-md:gap-4">
        {NUTRIENT_INPUTS.map(({ key, short, label }) => (
          <span key={key} role="cell" className="max-md:!px-0">
            <label className="flex items-center gap-1 text-xs text-(--ink-2)">
              <span aria-hidden="true" className="md:hidden">
                {short}
              </span>
              <input
                {...inputProps(key)}
                type="text"
                inputMode="decimal"
                aria-label={label}
                className={`${underlineInputClassName} text-right tabular-nums max-md:h-5.5 max-md:w-10 max-md:text-xs ${borderClassName(key)}`}
              />
              <span aria-hidden="true" className="md:hidden">
                g
              </span>
            </label>
          </span>
        ))}
      </span>

      <span role="cell" className="text-right font-bold tabular-nums max-md:col-start-3 max-md:row-start-1">
        {formatInteger(getPreviewKcal(form))}
      </span>
      <span role="cell" className="flex justify-end gap-0.5 !px-0 max-md:col-start-4 max-md:row-start-1">
        <button
          type="button"
          aria-label="수정 취소"
          onClick={onCancel}
          className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg text-(--ink-2) transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--ink)_14%,transparent)] hover:text-(--ink)"
        >
          <svg {...iconProps}>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <button
          type="submit"
          aria-label="수정 저장"
          className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg text-(--brand) transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--brand)_18%,transparent)]"
        >
          <svg {...iconProps} strokeWidth={2.4}>
            <path d="M5 12l5 5L20 7" />
          </svg>
        </button>
      </span>

      {firstInvalid && (
        <p id={errorId} role="alert" className="col-span-full m-0 pb-2 text-xs text-(--err)">
          {/* 칸이 좁아 문구를 한 줄로 모아요. 어느 칸인지 알 수 있게 영양소 이름을 앞에 붙여요. */}
          {firstInvalid === 'foodName' ? '' : `${NUTRIENT_INPUTS.find(({ key }) => key === firstInvalid)?.name}: `}
          {errors[firstInvalid]}
        </p>
      )}
    </form>
  );
}
