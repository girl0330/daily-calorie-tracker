import { useEffect, useId, useRef, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react';
import Button from './Button';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  children?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'danger' | 'brand';
  isConfirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * 시안의 확인 창. 브라우저 기본 <dialog>의 showModal()을 써요.
 * - 창 밖은 클릭도 Tab 이동도 안 돼요(포커스 가두기).
 * - Esc나 바깥 어두운 영역을 누르면 onCancel이 불려요.
 * - 닫히면 창을 열기 전에 누른 버튼으로 포커스가 돌아가요.
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel = '취소',
  tone = 'danger',
  isConfirmDisabled = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  // open 값에 맞춰 실제 창을 열고 닫아요. 열고 닫는 결정은 부모가 해요.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Esc: 브라우저가 스스로 닫지 않게 막고, 부모에게 맡겨요.
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onCancel();
  };

  // 창 바깥(::backdrop)을 누르면 클릭 대상이 <dialog> 자신이에요.
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onCancel();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className="m-auto w-[min(360px,calc(100vw-32px))] rounded-[14px] border-0 bg-(--surface) p-0 text-(--ink) shadow-(--shadow) backdrop:bg-(--scrim)"
    >
      <div className="px-5.5 pt-5.5 pb-4.5">
        <h2 id={titleId} className="m-0 mb-1.5 text-[17px] font-bold">
          {title}
        </h2>
        <div id={descriptionId} className="text-sm text-(--ink-2)">
          {description}
        </div>

        {children}

        <div className="mt-5 flex justify-end gap-2">
          {/* 실수로 확정하지 않도록 처음 포커스는 취소 버튼에 둬요. */}
          <Button autoFocus onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={tone} onClick={onConfirm} disabled={isConfirmDisabled}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
