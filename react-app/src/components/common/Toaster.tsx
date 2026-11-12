import { useEffect } from 'react';
import { useToastStore } from '../../store/toastStore';

const TOAST_DURATION_MS = 2400;

// 시안의 .toast: 화면 아래 가운데에 잠깐 떴다 사라지는 알림. AppLayout에 한 번만 둬요.
export default function Toaster() {
  const toast = useToastStore(state => state.toast);
  const hideToast = useToastStore(state => state.hideToast);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(hideToast, TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toast, hideToast]);

  return (
    // 알림 영역은 항상 그려 둬야 화면 낭독기가 새 메시지를 읽어 줘요.
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-[calc(28px+env(safe-area-inset-bottom,0px))] z-50 flex justify-center"
    >
      {toast && (
        <p
          key={toast.id}
          className="m-0 max-w-full animate-toast-in rounded-[10px] bg-(--ink) px-4.5 py-3 text-sm text-(--bg) motion-reduce:animate-none"
        >
          {toast.message}
        </p>
      )}
    </div>
  );
}
