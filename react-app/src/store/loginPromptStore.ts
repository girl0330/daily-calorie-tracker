import { create } from 'zustand';

type LoginPromptState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

// '로그인이 필요해요' 안내창이 열려 있는지. 창은 AppLayout에 하나만 있고, 어디서든 열 수 있어요.
export const useLoginPromptStore = create<LoginPromptState>()(set => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

// 컴포넌트 밖에서도 부를 수 있게 함수로 꺼내 둬요.
export const openLoginPrompt = () => useLoginPromptStore.getState().open();
