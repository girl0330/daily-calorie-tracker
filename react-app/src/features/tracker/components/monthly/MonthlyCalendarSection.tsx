import { useNavigate } from 'react-router-dom';
import SectionLayout from '../../../../components/common/SectionLayout';
import type { FoodItem } from '../../../../types/types';
import { calories, totalNutrients } from '../../../../utils/calculate';
import { toRecordDate as formatRecordDate } from '../../../../utils/date';

const WEEK_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const nutrientBadges = [
  {
    key: 'carbs',
    label: '탄수화물',
    colorClassName: 'bg-(--chart-carbs)',
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
  onMonthChange: (date: Date) => void;
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

const formatMonthLabel = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

export const MonthlyCalendarSection = ({
  foods,
  currentMonth,
  onMonthChange,
  className = '',
}: MonthlyCalendarSectionProps) => {
  const navigate = useNavigate();

  const todayRecordDate = formatRecordDate();
  const monthDates = getMonthGridDates(currentMonth);

  const handlePrevMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleTodayClick = () => {
    const today = new Date();

    onMonthChange(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const handleDateClick = (date: Date) => {
    const recordDate = formatRecordDate(date);

    navigate(`/?date=${recordDate}`);
  };

  return (
    <SectionLayout
      title="월간 캘린더"
      description="한 달의 식단과 영양 섭취 기록을 확인해 보세요."
      className={className}
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      {/* 월 이동 영역 */}
      <div className="mb-4 flex min-h-10 items-center justify-center gap-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="이전 달"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-(--neutral-4) text-(--text-secondary) transition hover:border-(--primary-3) hover:bg-(--neutral-5)"
          >
            <img src="/chevron-left-arrow.svg" alt="" className="h-4 w-4" />
          </button>

          <strong className="min-w-[104px] text-center text-base text-(--text-primary)">
            {formatMonthLabel(currentMonth)}
          </strong>

          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="다음 달"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-(--neutral-4) text-(--text-secondary) transition hover:border-(--primary-3) hover:bg-(--neutral-5)"
          >
            <img src="/chevron-right-arrow.svg" alt="" className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleTodayClick}
          className="rounded-md border border-(--neutral-4) px-3 py-1.5 text-sm font-medium text-(--text-secondary) transition hover:border-(--primary-3) hover:bg-(--primary-5) hover:text-(--primary-1)"
        >
          오늘
        </button>
      </div>

      {/* 캘린더 영역 */}
      <div className="min-h-0 flex-1">
        {/* 요일 */}
        <div className="mb-3 grid grid-cols-7 text-center text-sm font-semibold text-(--text-primary)">
          {WEEK_LABELS.map(label => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* 날짜 */}
        <div className="grid grid-cols-7 gap-2">
          {monthDates.map(date => {
            const recordDate = formatRecordDate(date);
            const dayFoods = foods.filter(food => food.recordDate === recordDate);

            const dayNutrition = totalNutrients(dayFoods);
            const dayCalories = calories(dayNutrition.carbs, dayNutrition.protein, dayNutrition.fat);

            const hasData = dayFoods.length > 0;

            const isCurrentMonth =
              date.getFullYear() === currentMonth.getFullYear() && date.getMonth() === currentMonth.getMonth();

            const isToday = recordDate === todayRecordDate;

            const dayButtonClassName = [
              'flex h-32 flex-col rounded-2xl border p-3 text-left transition',
              'hover:bg-(--neutral-5)',
              isCurrentMonth ? 'border-(--neutral-4)' : 'border-(--neutral-4) opacity-45',
              isToday ? '!border-(--primary-3)' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={recordDate}
                type="button"
                onClick={() => handleDateClick(date)}
                className={dayButtonClassName}
              >
                <span className="text-sm font-bold text-(--text-primary)">{date.getDate()}</span>

                {hasData ? (
                  <>
                    <span className="mb-1 text-sm font-semibold text-(--primary-1)">{dayCalories} kcal</span>

                    <div className="mt-auto space-y-1">
                      {nutrientBadges.map(({ key, label, colorClassName }) => (
                        <div key={key} className="flex items-center gap-1.5 text-[11px] text-(--text-secondary)">
                          <span
                            aria-label={`${label} ${dayNutrition[key]}g`}
                            title={`${label} ${dayNutrition[key]}g`}
                            className={['h-2 w-2 shrink-0 rounded-full', colorClassName].join(' ')}
                          />

                          <p>
                            {label} <span className="font-semibold text-(--text-primary)">{dayNutrition[key]}</span>g
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <span className="my-1 text-xs text-(--text-muted)">기록 없음</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </SectionLayout>
  );
};
