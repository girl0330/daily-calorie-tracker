import { useEffect, useId, useRef, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react';

type BottomSheetProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

/**
 * 시안의 바텀시트: 화면 아래에서 올라오는 창. 브라우저 기본 <dialog>의 showModal()을 써요.
 * - 창 밖은 클릭도 Tab 이동도 안 돼요(포커스 가두기).
 * - Esc, ✕ 버튼, 바깥 어두운 영역을 누르면 onClose가 불려요.
 * - 닫히면 창을 열기 전에 누른 버튼으로 포커스가 돌아가요.
 */
export default function BottomSheet({ open, title, children, onClose }: BottomSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleId = useId();

  // open 값에 맞춰 실제 창을 열고 닫아요. 열고 닫는 결정은 부모가 해요.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      // 열리면 제목에 먼저 포커스를 둬서, 화면 읽기 프로그램이 무슨 창인지부터 읽어요.
      titleRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Esc: 브라우저가 스스로 닫지 않게 막고, 부모에게 맡겨요.
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  // 창 바깥(::backdrop)을 누르면 클릭 대상이 <dialog> 자신이에요.
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className="fixed inset-x-0 top-auto bottom-0 m-0 mx-auto max-h-[82dvh] w-[min(560px,100%)] max-w-none animate-sheet-up overflow-y-auto rounded-t-[18px] border-0 bg-(--surface) p-0 text-(--ink) shadow-[0_-8px_30px_rgba(0,0,0,0.18)] backdrop:bg-(--scrim) motion-reduce:animate-none"
    >
      <div className="px-5 pt-2 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
        <div aria-hidden="true" className="mx-auto mt-1 mb-2.5 h-1 w-10 rounded-full bg-(--line)" />

        <div className="flex items-center justify-between gap-3">
          <h2 ref={titleRef} id={titleId} tabIndex={-1} className="m-0 text-lg font-bold tracking-[-0.02em] focus:outline-none">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="-mr-2 inline-flex size-10 cursor-pointer items-center justify-center rounded-[10px] text-(--ink-2) transition-colors duration-150 hover:bg-(--skel)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {children}
      </div>
    </dialog>
  );
}
