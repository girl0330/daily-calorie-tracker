import type { ReactNode } from 'react';

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-black/40" />

      {/* Sheet */}
      <div className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white">
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute top-4 right-5 z-10 flex h-8 w-8 items-center justify-center text-2xl text-(--text-secondary)"
        >
          <img src="/close.svg" alt="닫기" />
        </button>

        {children}
      </div>
    </div>
  );
}
