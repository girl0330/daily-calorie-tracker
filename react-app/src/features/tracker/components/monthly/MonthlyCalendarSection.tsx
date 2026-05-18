import type { FoodItem } from '../../../../types/types';
import { calories, totalNutrients } from '../../../../utils/calculate';
import { toRecordDate } from '../../../../utils/date';
import SectionLayout from '../../../../components/common/SectionLayout';

const WEEK_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const nutrientBadges = [
  {
    key: 'carbs',
    label: '탄수화물',
    colorClassName: 'bg-(--chart-carb)',
  },
  {
    key: 'protein',
    label: '단백질',
    colorClassName: 'bg-(--chart-protein)',
  },
  {
    key: 'fat',
    label: '지방',
    colorClassName: 'bg-(--chart-fat)',
  },
] as const;

type MonthlyCalendarSectionProps = {
  foods: FoodItem[];
  currentMonth: Date;
  selectedDate: Date;
  onMonthChange: (date: Date) => void;
  onDateSelect: (date: Date) => void;
  className?: string;
};

const getStartOfWeek = (date: Date) => {
  const startOfWeek = new Date(date);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(date.getDate() - date.getDay());

  return startOfWeek;
};

const getMonthGridDates = (currentMonth: Date) => {
  const firstDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const gridStartDate = getStartOfWeek(firstDateOfMonth);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStartDate);
    date.setDate(gridStartDate.getDate() + index);

    return date;
  });
};

const getMonthKey = (date: Date) => toRecordDate(date).slice(0, 7);

const formatMonthLabel = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

const formatDateLabel = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

export const MonthlyCalendarSection = ({
  foods,
  currentMonth,
  selectedDate,
  onMonthChange,
  onDateSelect,
  className = '',
}: MonthlyCalendarSectionProps) => {
  const todayRecordDate = toRecordDate();
  const selectedRecordDate = toRecordDate(selectedDate);
  // const currentMonthKey = getMonthKey(currentMonth);

  const monthDates = getMonthGridDates(currentMonth);
  // const monthFoods = foods.filter(food => food.recordDate.startsWith(currentMonthKey));
  // const monthNutrition = totalNutrients(monthFoods);
  // const monthTotalCalories = calories(monthNutrition.carbs, monthNutrition.protein, monthNutrition.fat);
  // const recordedDayCount = new Set(monthFoods.map(food => food.recordDate)).size;

  // const selectedWeekStart = getStartOfWeek(selectedDate);
  // const selectedWeekDates = Array.from({ length: 7 }, (_, index) => {
  //   const date = new Date(selectedWeekStart);
  //   date.setDate(selectedWeekStart.getDate() + index);

  //   return date;
  // });
  // const selectedWeekRecordDates = new Set(selectedWeekDates.map(date => toRecordDate(date)));
  // const selectedWeekFoods = foods.filter(food => selectedWeekRecordDates.has(food.recordDate));
  // const selectedWeekNutrition = totalNutrients(selectedWeekFoods);
  // const selectedWeekCalories = calories(
  //   selectedWeekNutrition.carbs,
  //   selectedWeekNutrition.protein,
  //   selectedWeekNutrition.fat
  // );

  const handlePrevMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleTodayClick = () => {
    const today = new Date();

    onMonthChange(today);
    onDateSelect(today);
  };

  return (
    <SectionLayout
      title="월간 캘린더"
      description="날짜를 선택하면 위 영역의 요약과 음식 카드가 함께 바뀝니다."
      className={className}
      contentClassName="flex min-h-0 flex-1 flex-col"
      headerAction={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTodayClick}
            className="rounded-md border border-(--neutral-4) px-3 py-1.5 text-sm font-medium text-(--text-secondary) transition hover:bg-(--neutral-5)"
          >
            오늘
          </button>

          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="이전 달"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-(--neutral-4) text-(--text-secondary) transition hover:bg-(--neutral-5)"
          >
            ‹
          </button>

          <strong className="min-w-[104px] text-center text-base text-(--text-primary)">
            {formatMonthLabel(currentMonth)}
          </strong>

          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="다음 달"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-(--neutral-4) text-(--text-secondary) transition hover:bg-(--neutral-5)"
          >
            ›
          </button>
        </div>
      }
    >
      <div>
        <div className="min-h-0 rounded-[20px] border border-(--neutral-4) bg-white/70 p-4">
          <div className="mb-3 grid grid-cols-7 text-center text-sm font-semibold text-(--text-muted)">
            {WEEK_LABELS.map(label => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {monthDates.map(date => {
              const recordDate = toRecordDate(date);
              const dayFoods = foods.filter(food => food.recordDate === recordDate);
              const dayNutrition = totalNutrients(dayFoods);
              const dayCalories = calories(dayNutrition.carbs, dayNutrition.protein, dayNutrition.fat);
              const hasData = dayFoods.length > 0;
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              const isToday = recordDate === todayRecordDate;
              const isSelected = recordDate === selectedRecordDate;

              const dayButtonClassName = [
                'flex h-32 flex-col rounded-2xl border bg-(--bg-card) p-3 text-left transition',
                'hover:border-(--primary-3) hover:bg-(--neutral-5)',
                isCurrentMonth ? 'border-(--neutral-4)' : 'border-(--neutral-4) opacity-45',
                isSelected ? 'border-(--primary-3) ring-2 ring-(--primary-5)' : '',
                isToday ? 'shadow-(--shadow-sm)' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <button
                  key={recordDate}
                  type="button"
                  onClick={() => onDateSelect(date)}
                  aria-pressed={isSelected}
                  className={dayButtonClassName}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-(--text-primary)">{date.getDate()}</span>
                    {isToday && (
                      <span className="rounded-full bg-(--primary-5) px-2 py-0.5 text-[10px] font-semibold text-(--primary-1)">
                        오늘
                      </span>
                    )}
                  </div>

                  {hasData ? (
                    <>
                      <span className="my-1 text-xs font-semibold text-(--primary-1)">{dayCalories} kcal</span>

                      <div className="mt-auto space-y-1">
                        {nutrientBadges.map(({ key, label, colorClassName }) => (
                          <div key={key} className="flex items-center gap-1.5 text-[11px] text-(--text-secondary)">
                            {/* 영양소를 구분하는 색상 뱃지 */}
                            <span
                              aria-label={`${label} ${dayNutrition[key]}g`}
                              title={`${label} ${dayNutrition[key]}g`}
                              className={['h-2.5 w-2.5 shrink-0 rounded-full', colorClassName].join(' ')}
                            />

                            {/* 색상 뱃지와 일치하는 영양소 텍스트 */}
                            <p>
                              {label} <span className="font-semibold text-(--text-primary)">{dayNutrition[key]}</span>g
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <span className="mt-auto text-[11px] text-(--text-muted)">기록 없음</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 요약에 들어갈 내용 생각 안남
        <aside className="flex flex-col gap-3 rounded-[20px] border border-(--neutral-4) bg-(--neutral-5) p-4">
          <div>
            <p className="text-sm font-semibold text-(--text-muted)">월간 요약</p>
            <strong className="mt-1 block text-3xl font-black tracking-[-0.04em] text-(--text-primary)">
              {monthTotalCalories}
              <span className="ml-1 text-sm font-semibold text-(--text-muted)">kcal</span>
            </strong>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-2xl bg-(--bg-card) px-3 py-3">
              <p className="text-(--text-muted)">기록일</p>
              <strong className="text-(--text-primary)">{recordedDayCount}일</strong>
            </div>
            <div className="rounded-2xl bg-(--bg-card) px-3 py-3">
              <p className="text-(--text-muted)">음식 수</p>
              <strong className="text-(--text-primary)">{monthFoods.length}개</strong>
            </div>
          </div>

          <div className="rounded-2xl bg-(--bg-card) px-3 py-3 text-sm text-(--text-secondary)">
            <p>
              탄수화물 <strong className="text-(--text-primary)">{monthNutrition.carbs}</strong>g
            </p>
            <p>
              단백질 <strong className="text-(--text-primary)">{monthNutrition.protein}</strong>g
            </p>
            <p>
              지방 <strong className="text-(--text-primary)">{monthNutrition.fat}</strong>g
            </p>
          </div>
        </aside> */}
      </div>
    </SectionLayout>
  );
};
