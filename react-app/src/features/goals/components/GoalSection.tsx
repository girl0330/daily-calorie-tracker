import { useRef, useState } from 'react';
import Button from '../../../components/common/Button';
import Skeleton from '../../../components/common/Skeleton';
import Switch from '../../../components/common/Switch';
import { showToast } from '../../../store/toastStore';
import type { UserId } from '../../../types/types';
import { useGoalSettings, useSaveGoalSettings } from '../hooks/useGoalSettings';
import { formatInteger } from '../../../utils/formatNumber';
import { STANDARD_GOAL, isSameGoal } from '../utils/goalCalc';
import type { Goal } from '../types';
import GoalEditor from './GoalEditor';

type GoalSectionProps = {
  userId: UserId;
};

const SUMMARY_ITEMS = [
  { key: 'kcal', label: '칼로리', unit: 'kcal', border: 'border-(--kcal)' },
  { key: 'carbs', label: '탄수화물', unit: 'g', border: 'border-(--carbs)' },
  { key: 'protein', label: '단백질', unit: 'g', border: 'border-(--protein)' },
  { key: 'fat', label: '지방', unit: 'g', border: 'border-(--fat)' },
] as const;

const describeGoal = (goal: Goal) => {
  if (isSameGoal(goal, STANDARD_GOAL)) {
    return '식약처 1일 영양성분 기준치(탄 324g·단 55g·지 54g)로 시작했어요. 칼로리는 이 g을 합한 값이에요.';
  }

  if (goal.mode === 'nut') return '영양소로 설정했어요. 칼로리는 탄·단·지에서 계산한 값이에요.';

  const ratio = goal.ratio;
  const ratioText = ratio ? `${ratio.carbs} : ${ratio.protein} : ${ratio.fat}` : '50 : 20 : 30';
  return `칼로리로 설정했어요. 탄·단·지는 ${ratioText} 비율로 나눈 값이고, 칼로리는 그 g을 합한 값이에요.`;
};

// 마이페이지 '목표 칼로리 설정' 칸: 불러오는 중 / 꺼짐(목표를 흐리게) / 켜짐(목표 보기) / 수정 중
export default function GoalSection({ userId }: GoalSectionProps) {
  const { data: settings, isLoading, isError, refetch } = useGoalSettings(userId);
  const { mutate: saveSettings, isPending: isSaving, variables: pendingSettings } = useSaveGoalSettings(userId);
  const [isEditing, setIsEditing] = useState(false);
  // 방금 칼로리 탭에서 입력한 칼로리. 저장된 칼로리(g 합계)와 다르면 저장 후 화면에 차이를 알려 줘요.
  // DB에는 저장하지 않아서, 페이지를 새로 열면 사라져요.
  const [enteredKcal, setEnteredKcal] = useState<number | null>(null);

  // 목표 수정 화면을 닫은 뒤 '목표 수정' 버튼으로 포커스를 돌려줘요.
  // 버튼이 화면에 다시 붙는 순간(콜백 ref) 깃발을 보고 포커스를 줘요.
  const shouldRestoreFocusRef = useRef(false);
  const editButtonRef = (button: HTMLButtonElement | null) => {
    if (button && shouldRestoreFocusRef.current) {
      shouldRestoreFocusRef.current = false;
      button.focus();
    }
  };

  const closeEditor = () => {
    shouldRestoreFocusRef.current = true;
    setIsEditing(false);
  };

  // 저장하는 동안에는 누른 값을 먼저 보여 줘서 스위치가 바로 움직이게 해요.
  const isEnabled = isSaving && pendingSettings ? pendingSettings.isEnabled : (settings?.isEnabled ?? false);
  // 처음 켤 때는 기본 목표(식약처 기준치)로 시작해요.
  const savedGoal = settings?.goal ?? STANDARD_GOAL;
  const kcalRoundingGap = enteredKcal !== null ? savedGoal.kcal - enteredKcal : 0;

  const handleToggle = (nextEnabled: boolean) => {
    // 저장 중에는 스위치를 disabled로 만들지 않고 클릭만 무시해요.
    // disabled가 되면 브라우저가 포커스를 빼앗아 body로 보내기 때문이에요.
    if (isSaving) return;

    saveSettings(
      { isEnabled: nextEnabled, goal: savedGoal },
      { onError: () => showToast('설정을 바꾸지 못했어요. 다시 시도해 주세요.') },
    );
  };

  const openEditor = () => {
    setEnteredKcal(null);
    setIsEditing(true);
  };

  const handleSave = (nextGoal: Goal, nextEnteredKcal: number | null) => {
    saveSettings(
      { isEnabled: true, goal: nextGoal },
      {
        onSuccess: () => {
          setEnteredKcal(nextEnteredKcal);
          closeEditor();
          showToast('목표를 저장했어요.');
        },
        onError: () => {
          showToast('목표를 저장하지 못했어요. 다시 시도해 주세요.');
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div aria-busy="true" className="flex flex-col gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  if (isError || !settings) {
    return (
      <div role="alert" className="flex flex-col gap-3 text-sm text-(--ink-2)">
        <p className="m-0">목표를 불러오지 못했어요.</p>
        <Button onClick={() => void refetch()} className="w-max">
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-(--line) pb-4">
        <div className="min-w-0">
          <p className="m-0 text-[15px] font-medium text-(--ink)">목표 칼로리</p>
          <p className="m-0 mt-0.5 text-[13px] text-(--ink-2)">
            켜면 일일·월간 기록과 주간 리포트에 남은 칼로리와 달성률이 보여요.
          </p>
        </div>
        <Switch checked={isEnabled} onChange={handleToggle} label="목표 칼로리" disabled={isEditing} />
      </div>

      {isEditing ? (
        <GoalEditor goal={savedGoal} isSaving={isSaving} onSave={handleSave} onCancel={closeEditor} />
      ) : (
        <>
          {/* 꺼져 있으면 목표를 흐리게 보여 줘요. 다른 화면에서는 목표 기능이 모두 꺼져요. */}
          <dl
            className={`m-0 grid grid-cols-2 gap-x-3 gap-y-3.5 transition-opacity duration-150 md:grid-cols-4 ${
              isEnabled ? '' : 'opacity-40 grayscale'
            }`}
          >
            {SUMMARY_ITEMS.map(({ key, label, unit, border }) => (
              <div key={key} className={`flex flex-col gap-0.5 border-l-3 pl-3 ${border}`}>
                <dt className="text-xs text-(--ink-2)">{label}</dt>
                <dd className="m-0 text-[22px] font-bold tracking-[-0.02em] tabular-nums">
                  {formatInteger(savedGoal[key])}
                  <small className="ml-0.5 text-[13px] font-normal text-(--ink-2)">{unit}</small>
                </dd>
              </div>
            ))}
          </dl>
          <p className="m-0 text-[13px] text-(--ink-2)">
            {isEnabled ? describeGoal(savedGoal) : '목표 칼로리 설정이 꺼져 있어요. 켜면 이 목표가 적용돼요.'}
          </p>
          {isEnabled && kcalRoundingGap !== 0 && (
            <p role="status" className="m-0 -mt-1 text-[13px] text-(--ink-2)">
              g은 1g 단위로 반올림해서, 목표 칼로리는 이 g을 합한{' '}
              <b className="text-(--ink) tabular-nums">{formatInteger(savedGoal.kcal)}kcal</b>로 저장돼요.
              <br />
              입력한 {formatInteger(enteredKcal!)}kcal보다 {formatInteger(Math.abs(kcalRoundingGap))}kcal{' '}
              {kcalRoundingGap > 0 ? '많아요' : '적어요'}.
            </p>
          )}
          <Button ref={editButtonRef} disabled={!isEnabled} onClick={openEditor} className="w-max">
            목표 수정
          </Button>
        </>
      )}
    </>
  );
}
