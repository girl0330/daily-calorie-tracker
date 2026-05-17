import type { FoodItem } from '../../../../types/types';
import { toRecordDate } from '../../../../utils/date';

type WeeklyDayBarProps = {
  foods: FoodItem[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
};

const WeeklyDayBar = ({ foods, selectedDate, onDateSelect }: WeeklyDayBarProps) => {
  const today = new Date(); // 오늘 날짜 정보
  const todayDay = today.getDay(); // 0(일) ~ 6(토)

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - todayDay); // 일요일 날짜를 구하는 코드

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const selectedRecordDate = toRecordDate(selectedDate);

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const recordDate = toRecordDate(date);

    return {
      key: weekKeys[i],
      label: weekDays[i],
      date,
      dayNumber: date.getDate(),
      isToday: recordDate === toRecordDate(today),
      isSelected: recordDate === selectedRecordDate,
      hasData: foods.some(food => food.recordDate === recordDate),
    };
  });

  return (
    <section className="h-20 rounded-md border border-(--neutral-4) bg-(--bg-section) px-4">
      <div className="grid h-full grid-cols-7">
        {days.map(day => {
          const dayClassName = [
            'flex h-full w-full flex-col items-center justify-center gap-2 transition',
            'hover:bg-(--neutral-5)',
            day.isToday ? 'border-b-2 border-(--primary-1)' : '',
            day.isSelected ? 'bg-(--primary-1)' : '',
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
