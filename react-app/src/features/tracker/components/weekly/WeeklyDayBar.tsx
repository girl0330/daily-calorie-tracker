import type { FoodItem } from '../../../../types/types';
import { toRecordDate as formatRecordDate } from '../../../../utils/date';

const WEEK_DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

type WeeklyDayBarProps = {
  foods: FoodItem[];
  displayedWeekDate: Date;
  onWeekChange: (date: Date) => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  className?: string;
};

const WeeklyDayBar = ({
  foods,
  displayedWeekDate,
  onWeekChange,
  selectedDate,
  onDateSelect,
  className = '',
}: WeeklyDayBarProps) => {
  const handlePrevWeek = () => {
    const prevWeekDate = new Date(displayedWeekDate);

    prevWeekDate.setDate(displayedWeekDate.getDate() - 7);

    // 부모 컴포넌트에게 변경할 주의 기준 날짜를 전달한다.
    onWeekChange(prevWeekDate);
  };

  const handleNextWeek = () => {
    // 현재 선택된 날짜를 직접 수정하지 않기 위해 복사본을 만든다.
    const nextWeekDate = new Date(displayedWeekDate);

    // 선택된 날짜 기준으로 7일 후 날짜를 만든다.
    nextWeekDate.setDate(displayedWeekDate.getDate() + 7);

    // 부모 컴포넌트에게 변경할 주의 기준 날짜를 전달한다.
    onWeekChange(nextWeekDate);
  };

  const todayRecordDate = formatRecordDate(new Date());
  const selectedRecordDate = formatRecordDate(selectedDate);
  const displayedWeekDayIndex = displayedWeekDate.getDay();

  const displayedWeekStartDate = new Date(displayedWeekDate);
  displayedWeekStartDate.setDate(displayedWeekDate.getDate() - displayedWeekDayIndex);

  const displayedWeekDays = Array.from({ length: 7 }, (_, dayIndex) => {
    const weekDate = new Date(displayedWeekStartDate);
    weekDate.setDate(displayedWeekStartDate.getDate() + dayIndex);

    const weekRecordDate = formatRecordDate(weekDate);

    return {
      key: weekRecordDate,
      label: WEEK_DAY_LABELS[dayIndex],
      date: weekDate,
      dayNumber: weekDate.getDate(),
      isToday: weekRecordDate === todayRecordDate,
      isSelected: weekRecordDate === selectedRecordDate,
      hasFoodData: foods.some(food => food.recordDate === weekRecordDate),
    };
  });

  return (
    <section
      className={`flex h-20 items-center justify-between overflow-hidden rounded-md border border-(--neutral-4) bg-(--bg-section) ${className}`}
    >
      <button
        type="button"
        onClick={handlePrevWeek}
        aria-label="이전 주"
        className="flex h-full w-10 items-center justify-center text-(--text-secondary) transition hover:bg-(--neutral-5)"
      >
        <img src="/chevron-left-arrow.svg" alt="" className="h-4 w-4" />
      </button>
      <div className="grid h-full flex-1 grid-cols-7">
        {displayedWeekDays.map(day => {
          const dayClassName = [
            'flex h-full w-full flex-col items-center justify-center gap-2 transition',
            'hover:bg-(--neutral-5)',
            day.isToday ? 'border-b-2 border-(--primary-1)' : '',
            day.isSelected ? 'bg-(--neutral-5)' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => onDateSelect(day.date)}
              aria-pressed={day.isSelected}
              className={dayClassName}
            >
              <span className="text-sm text-(--text-primary)">
                {day.label}
                <span className="ml-1 text-sm text-[var(--text-primary)]">( {day.dayNumber} )</span>
              </span>

              <span
                className={`h-2.5 w-2.5 rounded-full border border-(--text-primary) ${day.hasFoodData ? 'bg-(--primary-3)' : ''}`}
              />
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={handleNextWeek}
        aria-label="다음 주"
        className="flex h-full w-10 items-center justify-center text-(--text-secondary) transition hover:bg-(--neutral-5)"
      >
        <img src="/chevron-right-arrow.svg" alt="" className="h-4 w-4" />
      </button>
    </section>
  );
};

export default WeeklyDayBar;
