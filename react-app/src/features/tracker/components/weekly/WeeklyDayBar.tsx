import type { FoodItem } from '../../../../types/types';
import { toRecordDate } from '../../../../utils/date';

type WeeklyDayBarProps = {
  foods: FoodItem[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  className?: string;
};

const WeeklyDayBar = ({ foods, selectedDate, onDateSelect, className = '' }: WeeklyDayBarProps) => {
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  // const weekDayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  const handlePrevWeek = () => {
    const prevWeekDate = new Date(selectedDate);

    // 선택된 날짜 기준으로 7일 전 날짜를 만든다.
    prevWeekDate.setDate(selectedDate.getDate() - 7);

    // 부모 컴포넌트에게 변경할 주의 기준 날짜를 전달한다.
    onDateSelect(prevWeekDate);
  };

  const handleNextWeek = () => {
    // 현재 선택된 날짜를 직접 수정하지 않기 위해 복사본을 만든다.
    const nextWeekDate = new Date(selectedDate);

    // 선택된 날짜 기준으로 7일 후 날짜를 만든다.
    nextWeekDate.setDate(selectedDate.getDate() + 7);

    // 부모 컴포넌트에게 변경할 주의 기준 날짜를 전달한다.
    onDateSelect(nextWeekDate);
  };

  // 실제 오늘 날짜를 yyyy-MM-dd 형식으로 변환한다.
  const todayRecordDate = toRecordDate(new Date());

  // 선택된 날짜를 yyyy-MM-dd 형식으로 변환한다.
  const selectedRecordDate = toRecordDate(selectedDate);

  // 선택된 날짜가 한 주의 몇 번째 요일인지 구한다.
  // 일요일: 0, 월요일: 1, ..., 토요일: 6
  const selectedWeekdayIndex = selectedDate.getDay();

  // 선택된 날짜가 포함된 주의 시작일, 즉 일요일을 구한다.
  const selectedWeekStartDate = new Date(selectedDate);
  selectedWeekStartDate.setDate(selectedDate.getDate() - selectedWeekdayIndex);

  // 선택된 날짜가 포함된 한 주의 날짜 목록을 만든다.
  const selectedWeekDays = Array.from({ length: 7 }, (_, dayIndex) => {
    const weekDate = new Date(selectedWeekStartDate);
    weekDate.setDate(selectedWeekStartDate.getDate() + dayIndex);

    const weekRecordDate = toRecordDate(weekDate);

    return {
      key: weekRecordDate,
      label: weekDays[dayIndex],
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
        onClick={() => handlePrevWeek()}
        aria-label="이전 주"
        className="flex h-full items-center justify-center text-(--text-secondary) transition hover:bg-(--neutral-5)"
      >
        <img src="/chevron-left-arrow.svg" alt="" className="h-4 w-4" />
      </button>
      <div className="grid h-full flex-1 grid-cols-7">
        {selectedWeekDays.map(day => {
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
        onClick={() => handleNextWeek()}
        aria-label="다음 주"
        className="flex h-4 h-full w-4 items-center justify-center text-(--text-secondary) transition hover:bg-(--neutral-5)"
      >
        <img src="/chevron-right-arrow.svg" alt="" className="h-4 w-4" />
      </button>
    </section>
  );
};

export default WeeklyDayBar;
