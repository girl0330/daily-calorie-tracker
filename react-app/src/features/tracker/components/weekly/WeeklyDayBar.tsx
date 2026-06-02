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
  const weekDayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const selectedRecordDate = toRecordDate(selectedDate); // 부모한테서 넘어온 선택된 날짜

  // 오늘 표시용 날짜다.
  // 주간 계산 기준이 아니라, 오늘인지 비교할 때만 사용한다.
  const today = new Date();
  const todayRecordDate = toRecordDate(today);

  // 선택된 날짜가 포함된 주의 시작일, 즉 일요일을 구한다.
  const selectedDay = selectedDate.getDay();

  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDay);

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const recordDate = toRecordDate(date);

    return {
      key: recordDate,
      label: weekDays[i],
      date,
      dayNumber: date.getDate(),
      isToday: recordDate === todayRecordDate,
      isSelected: recordDate === selectedRecordDate,
      hasData: foods.some(food => food.recordDate === recordDate),
    };
  });

  return (
    <section className={`h-20 rounded-md border border-(--neutral-4) bg-(--bg-section) px-4 ${className}`}>
      <div className="grid h-full grid-cols-7">
        {days.map(day => {
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
                className={`h-2.5 w-2.5 rounded-full border border-(--text-primary) ${day.hasData ? 'bg-(--primary-3)' : ''}`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default WeeklyDayBar;
