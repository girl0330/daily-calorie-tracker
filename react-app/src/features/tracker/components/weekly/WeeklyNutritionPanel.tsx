import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import PillTabs from '../../../../components/common/PillTabs';
import type { MealType } from '../../../../types/types';
import type { Goal } from '../../../goals/types';
import { formatInteger } from '../../../../utils/formatNumber';
import { NUTRIENTS, type NutrientKey } from '../../utils/nutrients';
import { getCalorieRatio, type WeekDay, type WeeklyReport } from '../../utils/weeklyReport';
import WeeklySection from './WeeklySection';

type WeeklyNutritionPanelProps = {
  report: WeeklyReport;
  goal: Goal | null;
  /** 지금 보고 있는 날. 일주일 보기면 null */
  selectedDay: WeekDay | null;
  /** 날짜 탭이 가리키는 날. 처음에는 오늘이고, 막대를 누르면 그날로 바뀌어요. */
  pickedDay: WeekDay | null;
  onSelectDate: (recordDate: string | null) => void;
};

const MEALS: { key: MealType; label: string }[] = [
  { key: 'breakfast', label: '아침' },
  { key: 'lunch', label: '점심' },
  { key: 'dinner', label: '저녁' },
];

// 넓은 화면에서는 칸이 좁아서 숫자를 막대 아래 줄로 내려요. 휴대폰에서는 한 줄에 다 둬요.
const rowClassName =
  'grid items-center gap-x-3 gap-y-1 text-sm grid-cols-[64px_minmax(0,1fr)_128px] md:grid-cols-[56px_minmax(0,1fr)]';
const trackClassName = 'h-2 overflow-hidden rounded-full bg-(--track)';
const valueClassName = 'text-right text-[13px] whitespace-nowrap text-(--ink-2) tabular-nums md:col-span-2';

type SubSectionProps = {
  title: string;
  caption: string;
  /** 소제목 줄 오른쪽 (알약형 탭) */
  action?: ReactNode;
  children: ReactNode;
};

// 세 칸의 소제목. 알약형 탭이 있든 없든 높이를 41px로 맞춰서 세 밑줄이 나란히 서요.
function SubSection({ title, caption, action, children }: SubSectionProps) {
  return (
    <section className="min-w-0">
      <div className="flex min-h-[41px] items-center justify-between gap-2 border-b border-(--line) pb-1.5">
        <h3 className="m-0 text-sm font-bold">{title}</h3>
        {action}
      </div>
      <p className="mt-2.5 mb-0.5 text-xs text-(--muted)">{caption}</p>
      {children}
    </section>
  );
}

// 시안 3: '이번 주 영양소' 제목 → 밑줄 탭(일주일 / 막대에서 고른 날) → 영양소 · 칼로리 비율 · 시간대별 세 칸.
export default function WeeklyNutritionPanel({ report, goal, selectedDay, pickedDay, onSelectDate }: WeeklyNutritionPanelProps) {
  const [mealNutrient, setMealNutrient] = useState<NutrientKey>('carbs');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const amounts = selectedDay ? selectedDay.nutrients : report.averageNutrients;
  const mealNutrients = selectedDay ? selectedDay.mealNutrients : report.mealNutrients;
  const ratio = getCalorieRatio(amounts);
  const dayLabel = selectedDay ? format(selectedDay.date, 'M월 d일', { locale: ko }) : '';

  const amountCaption = goal
    ? selectedDay
      ? '섭취량 / 목표 · 달성률'
      : '평균 섭취량 / 목표 · 달성률'
    : selectedDay
      ? '섭취량'
      : '평균 섭취량';

  const mealTotal = MEALS.reduce((sum, { key }) => sum + mealNutrients[key][mealNutrient], 0);
  const mealColor = NUTRIENTS.find(({ key }) => key === mealNutrient)?.dotClassName ?? '';

  // 탭은 '일주일'과 날짜 두 개예요. 날짜 탭은 처음에 오늘이고, 막대를 누르면 그날로 바뀌어요.
  const periodTabs = [
    { recordDate: null, label: '일주일' },
    ...(pickedDay ? [{ recordDate: pickedDay.recordDate, label: format(pickedDay.date, 'd일(EEEEE)', { locale: ko }) }] : []),
  ];
  const selectedRecordDate = selectedDay?.recordDate ?? null;

  // 좌우 화살표 키로도 탭을 바꿔요. (PillTabs와 같은 방식)
  const handleTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;

    event.preventDefault();
    const index = periodTabs.findIndex(tab => tab.recordDate === selectedRecordDate);
    const nextIndex = (index + step + periodTabs.length) % periodTabs.length;
    onSelectDate(periodTabs[nextIndex].recordDate);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <WeeklySection title={selectedDay ? `${dayLabel} 영양소` : '이번 주 영양소'}>
      <div role="tablist" aria-label="보는 기간" onKeyDown={handleTabKeyDown} className="mt-1 flex gap-1 border-b border-(--line)">
        {periodTabs.map((tab, index) => {
          const isSelected = tab.recordDate === selectedRecordDate;

          return (
            <button
              key={tab.recordDate ?? 'week'}
              ref={element => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onSelectDate(tab.recordDate)}
              className={`-mb-px cursor-pointer border-b-2 px-3 pt-2.5 pb-2 text-sm whitespace-nowrap transition-colors duration-150 ${
                isSelected ? 'border-(--brand) font-bold text-(--brand)' : 'border-transparent text-(--muted) hover:text-(--ink)'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="mt-5 grid gap-x-8 gap-y-7 md:grid-cols-3">
        <SubSection title={goal ? '섭취량 / 목표' : '섭취량'} caption={amountCaption}>
          <div className="flex flex-col gap-3.5 pt-3.5">
            {NUTRIENTS.map(({ key, label, dotClassName }) => {
              const value = Math.round(amounts[key]);
              const target = goal?.[key];

              if (!target) {
                return (
                  <div key={key} className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3 text-sm">
                    <span>{label}</span>
                    <span className="text-right text-[13px] whitespace-nowrap text-(--ink-2) tabular-nums">
                      <b className="text-[15px] text-(--ink)">{formatInteger(value)}</b> g
                    </span>
                  </div>
                );
              }

              const percent = Math.round((value / target) * 100);
              return (
                <div key={key} className={rowClassName}>
                  <span>{label}</span>
                  <span aria-hidden="true" className={trackClassName}>
                    <i className={`block h-full rounded-full ${dotClassName}`} style={{ width: `${Math.min(100, percent)}%` }} />
                  </span>
                  <span className={valueClassName}>
                    <b className="text-[15px] text-(--ink)">{formatInteger(value)}</b> / {formatInteger(target)}g · {percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </SubSection>

        <SubSection title="칼로리 비율" caption="먹은 칼로리 중 각 영양소가 차지하는 비중">
          <div className="flex flex-col gap-3 pt-3.5">
            <div aria-hidden="true" className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-(--track)">
              {NUTRIENTS.map(({ key, dotClassName }) => (
                <i key={key} className={dotClassName} style={{ flex: ratio[key] }} />
              ))}
            </div>
            <p className="m-0 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-(--ink-2)">
              {NUTRIENTS.map(({ key, label, short, dotClassName }) => (
                <span key={key} className="inline-flex items-center gap-1.5">
                  <i aria-hidden="true" className={`inline-block size-2 rounded-full ${dotClassName}`} />
                  <span aria-hidden="true">{short}</span>
                  <span className="sr-only">{label}</span>
                  <b className="text-(--ink) tabular-nums">{ratio[key]}%</b>
                </span>
              ))}
            </p>
          </div>
        </SubSection>

        <SubSection
          title="시간대별"
          caption={selectedDay ? `${dayLabel} 기준` : '이번 주 합계 기준'}
          action={
            <PillTabs
              ariaLabel="영양소 고르기"
              value={mealNutrient}
              onChange={setMealNutrient}
              tabs={NUTRIENTS.map(({ key, short, dotClassName }) => ({ value: key, label: short, dotClassName }))}
            />
          }
        >
          <div className="flex flex-col gap-3.5 pt-3.5">
            {MEALS.map(({ key, label }) => {
              const grams = mealNutrients[key][mealNutrient];
              const percent = mealTotal > 0 ? Math.round((grams / mealTotal) * 100) : 0;

              return (
                <div key={key} className={rowClassName}>
                  <span>{label}</span>
                  <span aria-hidden="true" className={trackClassName}>
                    <i className={`block h-full rounded-full ${mealColor}`} style={{ width: `${percent}%` }} />
                  </span>
                  <span className={valueClassName}>
                    <b className="text-[15px] text-(--ink)">{formatInteger(grams)}g</b> · {percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </SubSection>
      </div>
    </WeeklySection>
  );
}
