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

  const displayedMonthLabel = `${displayedWeekStartDate.getFullYear()}년 ${displayedWeekStartDate.getMonth() + 1}월`;
  const navButtonClassName =
    'flex cursor-pointer items-center justify-center text-(--text-secondary) transition-colors duration-150 hover:bg-(--bg-hover) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--brand)';

  return (
    <>
      {/* Tablet / Mobile */}
      <section className="flex h-16 items-center justify-between border-b border-(--border-light) bg-(--surface) lg:hidden">
        <button
          type="button"
          onClick={handlePreDate}
          aria-label="이전 날짜"
          className={`h-full w-14 ${navButtonClassName}`}
        >
          <img src="/chevron-left-arrow.svg" alt="" className="size-4" />
        </button>

        <div className="flex flex-col items-center justify-center">
          <span className="text-base font-medium text-(--text-primary) tabular-nums">{selectedDateLabel}</span>

          <button
            type="button"
            onClick={handleToday}
            disabled={isToday}
            className={`text-xs ${isToday ? 'invisible' : 'cursor-pointer text-(--brand) hover:underline'}`}
          >
            오늘로 이동
          </button>
        </div>

        <button
          type="button"
          onClick={handleNextDate}
          aria-label="다음 날짜"
          className={`h-full w-14 ${navButtonClassName}`}
        >
          <img src="/chevron-right-arrow.svg" alt="" className="size-4" />
        </button>
      </section>

      {/* Desktop */}
      <section
        className={`hidden h-20 items-stretch border-b border-(--border-light) bg-(--surface) lg:flex ${className}`}
      >
        <p className="flex w-32 shrink-0 items-center pl-6 text-sm font-medium text-(--text-primary) tabular-nums">
          {displayedMonthLabel}
        </p>
        <button type="button" onClick={handlePrevWeek} aria-label="이전 주" className={`w-10 ${navButtonClassName}`}>
          <img src="/chevron-left-arrow.svg" alt="" className="size-4" />
        </button>
        <div className="grid flex-1 grid-cols-7">
          {displayedWeekDays.map(day => {
            const dayClassName = [
              'flex cursor-pointer flex-col items-center justify-center gap-1 transition-colors duration-150',
              'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--brand)',
              day.isSelected ? 'bg-(--skel)' : 'hover:bg-(--bg-section)',
            ].join(' ');

            return (
              <button
                key={day.key}
                type="button"
                onClick={() => onDateSelect(day.date)}
                aria-pressed={day.isSelected}
                aria-current={day.isToday ? 'date' : undefined}
                aria-label={`${day.date.getMonth() + 1}월 ${day.dayNumber}일 ${day.label}요일${day.hasFoodData ? ', 기록 있음' : ''}`}
                className={dayClassName}
              >
                <span className={`text-xs ${day.isToday ? 'font-medium text-(--brand)' : 'text-(--text-muted)'}`}>
                  {day.isToday ? '오늘' : day.label}
                </span>
                <span
                  className={`text-lg leading-none tabular-nums ${
                    day.isSelected ? 'font-semibold text-(--text-primary)' : 'text-(--text-secondary)'
                  }`}
                >
                  {day.dayNumber}
                </span>
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full ${day.hasFoodData ? 'bg-(--brand)' : 'bg-transparent'}`}
                />
              </button>
            );
          })}
        </div>
        <button type="button" onClick={handleNextWeek} aria-label="다음 주" className={`w-10 ${navButtonClassName}`}>
          <img src="/chevron-right-arrow.svg" alt="" className="size-4" />
        </button>
      </section>
    </>
  );
};

export default DateNavigator;
