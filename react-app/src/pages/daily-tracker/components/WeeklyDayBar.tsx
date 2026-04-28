import type { FoodItem } from '../../../types/types';

type WeeklyDayBarProps = {
  foods: FoodItem[];
};

const WeeklyDayBar = ({ foods }: WeeklyDayBarProps) => {
  const today = new Date(); //오늘 날짜 정보
  const todayDay = today.getDay(); //0(일) ~ 6(토)

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - todayDay); //일요일 날짜를 구하는 코드

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    return {
      key: weekKeys[i],
      label: weekDays[i],
      date: date.getDate(),
      isToday:
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate(),
      hasData: foods.some(food => {
        const createdDate = new Date(food.createdAt);

        return (
          createdDate.getFullYear() === date.getFullYear() &&
          createdDate.getMonth() === date.getMonth() &&
          createdDate.getDate() === date.getDate()
        );
      }),
    };
  });

  return (
    <section className="h-20 rounded-md border border-(--neutral-4) bg-(--bg-section) px-4">
      <div className="grid h-full grid-cols-7">
        {days.map((day, i) => {
          return (
            <div
              key={day.key}
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
