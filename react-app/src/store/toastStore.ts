import { create } from 'zustand';

type Toast = {
  id: number;
  message: string;
};

type ToastState = {
  toast: Toast | null;
  showToast: (message: string) => void;
  hideToast: () => void;
};

let nextToastId = 0;

// 토스트는 한 번에 하나만 보여요. 새 토스트가 오면 이전 것을 바로 바꿔요.
export const useToastStore = create<ToastState>()(set => ({
  toast: null,
  showToast: message => set({ toast: { id: ++nextToastId, message } }),
  hideToast: () => set({ toast: null }),
}));

// 컴포넌트 밖(mutation 콜백 등)에서도 부를 수 있게 함수로 꺼내 둬요.
export const showToast = (message: string) => useToastStore.getState().showToast(message);
