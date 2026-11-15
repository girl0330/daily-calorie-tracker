import type { FormEvent } from 'react';
import Button from '../../../components/common/Button';
import SegmentedControl from '../../../components/common/SegmentedControl';
import TextField from '../../../components/common/TextField';
import type { MealType } from '../../../types/types';
import { formatInteger } from '../../../utils/formatNumber';
import {
  MEAL_OPTIONS,
  getPreviewKcal,
  type FoodField,
  type FoodFormErrors,
  type FoodFormValues,
} from '../utils/foodForm';

type FoodEntryFormProps = {
  form: FoodFormValues;
  errors: FoodFormErrors;
  meal: MealType;
  onMealChange: (meal: MealType) => void;
  onFieldChange: (field: FoodField, value: string) => void;
  /** 칸을 부모에 알려요. 부모가 오류 난 칸으로 포커스를 옮길 때 써요. */
  registerField: (field: FoodField) => (element: HTMLInputElement | null) => void;
  isPending: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  /** AI 후보를 골라서 연 칸이면 true. 목록과 나뉘게 연한 상자에 담고, 'AI 추정값' 안내를 붙여요. */
  isFromSearch: boolean;
};

const NUTRIENT_FIELDS = [
  { key: 'carbs', label: '탄수화물 g' },
  { key: 'protein', label: '단백질 g' },
  { key: 'fat', label: '지방 g' },
] as const;

// 입력칸 라벨과 같은 높이의 보이지 않는 글자. 모바일은 줄이 넘어가서 맞출 칸이 없으니 빼요.
const labelSpacerClassName = 'invisible text-xs max-md:hidden';

/**
 * 시안의 .editor: 음식 이름·탄·단·지 밑줄 칸, 시간대 알약, kcal, 취소·추가.
 * 데스크톱은 한 줄에 두고 모든 것의 세로 가운데를 입력칸(36px)에 맞춰요.
 * 모바일은 이름 / 탄·단·지 / 시간대 + kcal / 가운데 버튼 순서로 줄을 나눠요.
 * 칸 아래에 오류 문구가 생겨도 칸 아래만 늘어나서 줄이 어긋나지 않게 위쪽 정렬(items-start)을 써요.
 */
export default function FoodEntryForm({
  form,
  errors,
  meal,
  onMealChange,
  onFieldChange,
  registerField,
  isPending,
  onSubmit,
  onCancel,
  isFromSearch,
}: FoodEntryFormProps) {
  return (
    <form
      noValidate
      onSubmit={onSubmit}
      autoComplete="off"
      aria-label="음식 추가"
      className={`flex flex-wrap items-start gap-3 ${
        isFromSearch ? 'mt-3 mb-1 rounded-xl bg-(--skel) px-4 pt-4 pb-2.5' : 'px-3 pt-3.5 pb-2'
      }`}
    >
      <TextField
        ref={registerField('foodName')}
        variant="line"
        label="음식 이름"
        value={form.foodName}
        error={errors.foodName}
        onChange={event => onFieldChange('foodName', event.target.value)}
        className="flex-[1_1_100%] md:flex-[1_1_140px]"
      />
      {NUTRIENT_FIELDS.map(({ key, label }) => (
        <TextField
          key={key}
          ref={registerField(key)}
          variant="line"
          label={label}
          inputMode="decimal"
          align="right"
          value={form[key]}
          placeholder="0"
          error={errors[key]}
          onChange={event => onFieldChange(key, event.target.value)}
          className="flex-[1_1_30%] md:w-24 md:flex-none"
        />
      ))}

      {/* 시간대: 모바일은 kcal 옆 남은 자리를 채우고 세 칸을 같은 폭으로 나눠요. 상자 안에서는 트랙을 한 단계 진하게 해요. */}
      <div className="flex flex-col gap-1.5 max-md:min-w-0 max-md:flex-1">
        <span aria-hidden="true" className={labelSpacerClassName}>
          시간대
        </span>
        <SegmentedControl
          ariaLabel="시간대"
          variant="pill"
          options={MEAL_OPTIONS}
          value={meal}
          onChange={onMealChange}
          className={`md:mt-px max-md:w-full max-md:*:min-w-0 max-md:*:flex-1 ${isFromSearch ? 'bg-(--line)!' : ''}`}
        />
      </div>

      {/* kcal: 시간대와의 간격은 다른 칸 사이의 두 배(24px). 모바일은 크게, 숫자만 굵게. */}
      <div className="ml-3 flex shrink-0 flex-col gap-1.5">
        <span aria-hidden="true" className={labelSpacerClassName}>
          kcal
        </span>
        <span className="flex h-9 items-center justify-end text-base whitespace-nowrap text-(--ink-2) max-md:h-8.5 md:min-w-28 md:text-sm">
          <b className="mr-1 text-2xl text-(--ink) tabular-nums md:text-[17px]">{formatInteger(getPreviewKcal(form))}</b>
          kcal
        </span>
      </div>

      {/* 버튼: 데스크톱은 44px 버튼의 가운데를 입력칸에 맞추려고 4px 올리고, 모바일은 다음 줄 가운데에 둬요. */}
      <div className="flex flex-col gap-1.5 max-md:basis-full">
        <span aria-hidden="true" className={labelSpacerClassName}>
          추가
        </span>
        <div className="flex gap-2 max-md:justify-center md:-mt-1">
          <Button size="lg" onClick={onCancel}>
            취소
          </Button>
          {/* 저장 중에도 disabled로 만들지 않아요. 포커스가 body로 날아가서, 클릭만 onSubmit에서 무시해요. */}
          <Button size="lg" variant="brand" type="submit" className="whitespace-nowrap">
            {isPending ? '추가하는 중' : '추가'}
          </Button>
        </div>
      </div>

      {isFromSearch && <p className="m-0 basis-full text-xs text-(--ink-2)">AI 추정값이에요. 저장 전에 수정할 수 있어요.</p>}
    </form>
  );
}
