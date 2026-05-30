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

  const today = new Date(); // 오늘 날짜 정보
  const todayDay = today.getDay(); // 0(일) ~ 6(토)

  // 일요일 날짜를 구하는 코드
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - todayDay);

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const recordDate = toRecordDate(date);

    return {
      key: weekDayKeys[i],
      label: weekDays[i],
      date,
      dayNumber: date.getDate(),
      isToday: recordDate === toRecordDate(today),
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
