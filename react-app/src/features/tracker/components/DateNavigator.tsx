import { useEffect, useState } from 'react';
import type { FoodItem } from '../../../types/types';
import { toRecordDate as formatRecordDate } from '../../../utils/date';

const WEEK_DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

type DateNavigatorProps = {
  foods: FoodItem[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  className?: string;
};

const DateNavigator = ({ foods, selectedDate, onDateSelect, className = '' }: DateNavigatorProps) => {
  // 화면에 표시할 주의 기준 날짜
  const [displayedWeekDate, setDisplayedWeekDate] = useState(selectedDate);

  useEffect(() => {
    setDisplayedWeekDate(selectedDate);
  }, [selectedDate]);

  // 주 단위 날짜 변경 핸들러
  const handlePrevWeek = () => {
    const prevWeekDate = new Date(displayedWeekDate);

    prevWeekDate.setDate(displayedWeekDate.getDate() - 7);

    // 화면에 표시할 주의 기준 날짜를 이전 주로 변경한다.
    setDisplayedWeekDate(prevWeekDate);
  };

  const handleNextWeek = () => {
    // 현재 선택된 날짜를 직접 수정하지 않기 위해 복사본을 만든다.
    const nextWeekDate = new Date(displayedWeekDate);

    // 현재 표시 중인 주의 기준 날짜에서 7일 후 날짜를 만든다.
    nextWeekDate.setDate(displayedWeekDate.getDate() + 7);

    // 부모 컴포넌트에게 변경할 주의 기준 날짜를 전달한다.
    setDisplayedWeekDate(nextWeekDate);
  };

  const todayRecordDate = formatRecordDate(new Date());
  const selectedRecordDate = formatRecordDate(selectedDate);

  const isToday = todayRecordDate === selectedRecordDate;
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

  // 하루 단위 날짜 변경 핸들러
  const handlePreDate = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(selectedDate.getDate() - 1);
    onDateSelect(prevDate);
  };

  const handleNextDate = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + 1);
    onDateSelect(nextDate);
  };

  const handleToday = () => {
    onDateSelect(new Date());
  };

  const selectedDateLabel = `${selectedDate.getFullYear()}. ${String(selectedDate.getMonth() + 1).padStart(
    2,
    '0'
  )}. ${String(selectedDate.getDate()).padStart(2, '0')} (${WEEK_DAY_LABELS[selectedDate.getDay()]})`;

  return (
    <>
      {/* Tablet / Mobile */}
      <section className="flex h-20 items-center justify-between border-b border-(--neutral-4) bg-(--white) lg:hidden">
        <button
          type="button"
          onClick={handlePreDate}
          aria-label="이전 날짜"
          className="flex h-full w-14 items-center justify-center"
        >
          <img src="/chevron-left-arrow.svg" alt="" className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center justify-center gap-1">
          <span className="text-base font-bold text-(--text-primary)">{selectedDateLabel}</span>

          <button
            type="button"
            onClick={handleToday}
            disabled={isToday}
            className={`text-sm ${isToday ? 'invisible' : 'text-(--primary-2)'}`}
          >
            오늘
          </button>
        </div>

        <button
          type="button"
          onClick={handleNextDate}
          aria-label="다음 날짜"
          className="flex h-full w-14 items-center justify-center"
        >
          <img src="/chevron-right-arrow.svg" alt="" className="h-4 w-4" />
        </button>
      </section>

      {/* Desktop */}
      {/* <section
        className={`hidden h-20 items-center justify-between overflow-hidden rounded-md border border-(--neutral-4) bg-(--bg-section) lg:flex ${className}`}
      > */}
      <section className={`hidden h-20 items-center justify-between overflow-hidden bg-(--white) lg:flex ${className}`}>
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
    </>
  );
};

export default DateNavigator;
