import { startOfWeek, addDays, isToday, isSameDay, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { FoodItem } from '../../../types/types';

type WeeklyDayBarProps = {
  foods: FoodItem[];
};

const WeeklyDayBar = ({ foods }: WeeklyDayBarProps) => {
  const today = new Date();

  const start = startOfWeek(today, { weekStartsOn: 0 }); // 0: 일요일 시작

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i);

    return {
      key: format(date, 'eee', { locale: ko }).toLowerCase(), // mon, tue...
      label: format(date, 'E', { locale: ko }), // 월, 화...
      date: format(date, 'd', { locale: ko }), // 날짜
      isToday: isToday(date),
      hasData: foods.some(f => isSameDay(new Date(f.createdAt), date)),
    };
  });

  return (
    <section className="h-20 rounded-md border border-(--neutral-4) bg-(--bg-section) px-4">
      <div className="grid h-full grid-cols-7">
        {days.map((day, i) => {
          return (
            <div
              key={day.key[i]}
              className={`flex flex-col items-center justify-center gap-2 ${day.isToday ? 'border-b-2 border-(--primary-1)' : ''}`}
            >
              <span className="text-sm text-(--text-primary)">
                {day.label}
                <span className="ml-1 text-sm text-[var(--text-primary)]">( {day.date} )</span>
              </span>

              <span
                className={`h-2.5 w-2.5 rounded-full border border-(--text-primary) ${day.hasData ? 'bg-(--primary-1)' : ''}`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WeeklyDayBar;
