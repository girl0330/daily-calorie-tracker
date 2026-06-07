import type { FoodItem } from '../../../../types/types';
import { calories, totalNutrients } from '../../../../utils/calculate';
import { toRecordDate as formatRecordDate } from '../../../../utils/date';
import SectionLayout from '../../../../components/common/SectionLayout';
import { useNavigate } from 'react-router-dom';

//코드 정리: 월간 날짜 목록을 만들고, 날짜별 음식 기록을 계산해서, 클릭 가능한 달력 형태로 보여준다.

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

const formatMonthLabel = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

export const MonthlyCalendarSection = ({
  foods,
  currentMonth,
  selectedDate,
  onMonthChange,
  onDateSelect,
  className = '',
}: MonthlyCalendarSectionProps) => {
  const navigate = useNavigate();

  const todayRecordDate = formatRecordDate();
  const selectedRecordDate = formatRecordDate(selectedDate);

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
    onDateSelect(today);
  };

  const handleDateClick = (date: Date) => {
    // Date 객체를 food.recordDate와 같은 YYYY-MM-DD 형식으로 변환한다.
    const recordDate = formatRecordDate(date);
    console.log(`${recordDate}를 클릭함함`);

    // 선택한 날짜를 DailyTrackerPage에 query string으로 전달한다.
    navigate(`/?date=${recordDate}`);
  };

  return (
    <SectionLayout
      title="월간 캘린더"
      description="날짜를 선택하면 팝업으로 음식 카드의 상세 내용을 확인할 수 있습니다."
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
            <img src="/chevron-left-arrow.svg" alt="" className="h-4 w-4" />
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
            <img src="/chevron-right-arrow.svg" alt="" className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div>
        <div className="min-h-0 rounded-[20px] border border-(--neutral-4) bg-white/70 p-4">
          <div className="mb-3 grid grid-cols-7 text-center text-sm font-semibold text-(--text-primary)">
            {WEEK_LABELS.map(label => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {monthDates.map(date => {
              const recordDate = formatRecordDate(date);
              const dayFoods = foods.filter(food => food.recordDate === recordDate); // 그 날짜의 음식만 걸러냄
              const dayNutrition = totalNutrients(dayFoods);
              const dayCalories = calories(dayNutrition.carbs, dayNutrition.protein, dayNutrition.fat);
              const hasData = dayFoods.length > 0; // 해당 날짜에 음식 기록이 있는지 확인
              const isCurrentMonth =
                date.getFullYear() === currentMonth.getFullYear() && date.getMonth() === currentMonth.getMonth();
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
                  onClick={() => handleDateClick(date)}
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
                      <span className="mb-1 text-sm font-semibold text-(--primary-1)">{dayCalories} kcal</span>

                      <div className="mt-auto space-y-1">
                        {nutrientBadges.map(({ key, label, colorClassName }) => (
                          <div key={key} className="flex items-center gap-1.5 text-[11px] text-(--text-secondary)">
                            {/* 영양소를 구분하는 색상 뱃지 */}
                            <span
                              aria-label={`${label} ${dayNutrition[key]}g`}
                              title={`${label} ${dayNutrition[key]}g`}
                              className={['h-2 w-2 shrink-0 rounded-full', colorClassName].join(' ')}
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
                    <span className="my-1 text-xs text-(--text-muted)">기록 없음</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};
