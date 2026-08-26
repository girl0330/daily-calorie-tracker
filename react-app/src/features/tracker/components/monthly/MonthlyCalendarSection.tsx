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
    shortLabel: '탄',
    colorClassName: 'bg-(--chart-carbs)',
  },
  {
    key: 'protein',
    label: '단백질',
    shortLabel: '단',
    colorClassName: 'bg-(--chart-protein)',
  },
  {
    key: 'fat',
    label: '지방',
    shortLabel: '지',
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

  const sectionClassName = ['flex min-h-0 flex-1 flex-col bg-(--white)', className].filter(Boolean).join(' ');

  return (
    <SectionLayout
      title="월간 캘린더"
      description="한 달의 식단과 영양 섭취 기록을 확인해 보세요."
      className={sectionClassName}
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      {/* 월 이동 영역 */}
      <div className="mb-4 flex min-h-10 shrink-0 items-center justify-center gap-3 lg:gap-10">
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
          className="flex h-8 items-center justify-center rounded-md border border-(--neutral-4) px-2 text-xs font-medium text-(--text-secondary) transition hover:border-(--primary-3) hover:bg-(--primary-5) hover:text-(--primary-1) lg:px-3 lg:text-sm"
        >
          오늘
        </button>
      </div>

      {/* 캘린더 영역 */}
      <div
        className={[
          'relative left-1/2 flex w-dvw -translate-x-1/2 flex-col overflow-hidden bg-(--white)',
          'border-y border-(--neutral-4)',
          'md:static md:left-auto md:min-h-0 md:flex-1 md:translate-x-0',
          'md:w-auto md:rounded-md md:border',
        ].join(' ')}
      >
        {/* 요일 */}
        <div className="grid shrink-0 grid-cols-7 border-b border-(--neutral-4)">
          {WEEK_LABELS.map(label => (
            <span key={label} className="px-2 py-2 text-left text-xs font-medium text-(--text-muted)">
              {label}
            </span>
          ))}
        </div>

        {/* 날짜 */}
        <div className="grid grid-cols-7 grid-rows-6 md:min-h-[36rem] md:flex-1">
          {monthDates.map((date, index) => {
            const recordDate = formatRecordDate(date);

            const dayFoods = foods.filter(food => food.recordDate === recordDate);

            const dayNutrition = totalNutrients(dayFoods);

            const dayCalories = calories(dayNutrition.carbs, dayNutrition.protein, dayNutrition.fat);

            const visibleNutrients = nutrientBadges.filter(({ key }) => dayNutrition[key] > 0);

            const hasData = dayFoods.length > 0;

            const isCurrentMonth =
              date.getFullYear() === currentMonth.getFullYear() && date.getMonth() === currentMonth.getMonth();

            const isToday = recordDate === todayRecordDate;
            const isLastRow = index >= monthDates.length - 7;

            const dayButtonClassName = [
              'relative flex min-h-24 min-w-0 flex-col p-2 text-left transition',
              'hover:bg-(--neutral-5)',
              isLastRow ? '' : 'border-b border-(--neutral-4)',
              isCurrentMonth ? '' : 'bg-(--bg-section) text-(--text-muted)',
              isToday ? 'shadow-[inset_0_0_0_1px_var(--primary-3)]' : '',
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
                <span
                  className={[
                    'text-xs font-semibold md:text-sm',
                    isCurrentMonth ? 'text-(--text-primary)' : 'text-(--text-muted)',
                  ].join(' ')}
                >
                  {date.getDate()}
                </span>

                {hasData && (
                  <>
                    {/* Mobile: 0g보다 큰 영양소의 색상만 표시 */}
                    {visibleNutrients.length > 0 && (
                      <div className="mt-auto flex gap-1 md:hidden">
                        {visibleNutrients.map(({ key, label, colorClassName }) => (
                          <span
                            key={key}
                            aria-label={`${label} ${dayNutrition[key]}g`}
                            title={`${label} ${dayNutrition[key]}g`}
                            className={['h-1.5 w-1.5 rounded-full', colorClassName].join(' ')}
                          />
                        ))}
                      </div>
                    )}

                    {/* Tablet·Desktop */}
                    <div className="hidden md:contents">
                      <span className="mt-1 text-sm font-semibold text-(--primary-1)">{dayCalories} kcal</span>

                      {visibleNutrients.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {visibleNutrients.map(({ key, label, shortLabel, colorClassName }) => (
                            <div
                              key={key}
                              title={`${label} ${dayNutrition[key]}g`}
                              className="flex items-center gap-1.5 text-[11px] text-(--text-secondary)"
                            >
                              <span
                                aria-hidden="true"
                                className={['h-2 w-2 shrink-0 rounded-full', colorClassName].join(' ')}
                              />

                              <span className="sr-only">
                                {label} {dayNutrition[key]}g
                              </span>

                              <p>
                                {shortLabel}{' '}
                                <span className="font-semibold text-(--text-primary)">{dayNutrition[key]}</span>g
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </SectionLayout>
  );
};
