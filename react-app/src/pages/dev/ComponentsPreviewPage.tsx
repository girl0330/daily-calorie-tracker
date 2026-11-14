import { useState } from 'react';
import { addDays, format, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import BottomSheet from '../../components/common/BottomSheet';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import DateHeader from '../../components/common/DateHeader';
import Skeleton from '../../components/common/Skeleton';
import Switch from '../../components/common/Switch';
import { showToast } from '../../store/toastStore';

/**
 * 개발용 공통 부품 확인 페이지 (/dev/components).
 * npm run dev에서만 라우트가 생기고, 배포 빌드에는 들어가지 않아요.
 * 아직 쓰는 화면이 없는 부품(날짜 헤더)을 미리 눈으로 확인하는 곳이에요.
 */
export default function ComponentsPreviewPage() {
  const [date, setDate] = useState(() => new Date());
  const [isAutoReport, setIsAutoReport] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const sectionClassName = 'flex flex-col gap-3 border-t border-(--line) pt-5';

  return (
    <div className="mx-auto flex w-full max-w-300 flex-col gap-7 px-4 pt-5 pb-12 md:px-6 md:pt-8">
      <h1 className="m-0 text-[28px] font-bold tracking-[-0.03em]">공통 부품 확인 (개발용)</h1>

      <section className={sectionClassName}>
        <h2 className="m-0 text-base font-bold">큰 날짜 헤더</h2>
        <DateHeader
          number={format(date, 'dd')}
          caption={format(date, 'yyyy년 M월')}
          label={format(date, 'EEEE', { locale: ko })}
          isCurrent={isToday(date)}
          currentLabel="오늘로 이동"
          prevLabel="이전 날"
          nextLabel="다음 날"
          onPrev={() => setDate(prev => addDays(prev, -1))}
          onNext={() => setDate(prev => addDays(prev, 1))}
          onCurrent={() => setDate(new Date())}
        />
      </section>

      <section className={sectionClassName}>
        <h2 className="m-0 text-base font-bold">토스트</h2>
        <Button className="w-max" onClick={() => showToast('김밥 기록을 삭제했어요')}>
          토스트 띄우기
        </Button>
      </section>

      <section className={sectionClassName}>
        <h2 className="m-0 text-base font-bold">확인 창</h2>
        <Button className="w-max" onClick={() => setIsConfirmOpen(true)}>
          확인 창 열기
        </Button>
        <ConfirmDialog
          open={isConfirmOpen}
          title="이 기록을 삭제할까요?"
          description="삭제한 기록은 되돌릴 수 없어요."
          confirmLabel="삭제"
          cancelLabel="닫기"
          onConfirm={() => {
            setIsConfirmOpen(false);
            showToast('삭제를 눌렀어요');
          }}
          onCancel={() => setIsConfirmOpen(false)}
        />
      </section>

      <section className={sectionClassName}>
        <h2 className="m-0 text-base font-bold">바텀시트</h2>
        <Button className="w-max" onClick={() => setIsSheetOpen(true)}>
          바텀시트 열기
        </Button>
        <BottomSheet open={isSheetOpen} title="11월 3일 화요일" onClose={() => setIsSheetOpen(false)}>
          <p className="m-0 pt-5 pb-1.5 text-sm text-(--ink-2)">Esc, ✕, 바깥 영역으로 닫혀요.</p>
        </BottomSheet>
      </section>

      <section className={sectionClassName}>
        <h2 className="m-0 text-base font-bold">스위치</h2>
        <div className="flex max-w-150 items-center justify-between gap-4">
          <span className="text-sm">
            매주 월요일 아침에 자동으로 만들기
            <small className="block text-xs text-(--ink-2)">지금: {isAutoReport ? '켜짐' : '꺼짐'}</small>
          </span>
          <Switch checked={isAutoReport} onChange={setIsAutoReport} label="주간 리포트 자동으로 만들기" />
        </div>
      </section>

      <section className={sectionClassName}>
        <h2 className="m-0 text-base font-bold">스켈레톤</h2>
        <div className="flex max-w-150 flex-col gap-2">
          <Skeleton className="h-5.5 w-[70%]" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-[85%]" />
          <Skeleton className="size-24 rounded-full" />
        </div>
      </section>
    </div>
  );
}
