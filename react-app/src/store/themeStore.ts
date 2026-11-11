import { create } from 'zustand';

export type ThemePreference = 'system' | 'light' | 'dark';

// index.html의 시작 스크립트도 같은 키를 읽어요. 바꿀 때는 두 곳을 같이 바꿔야 해요.
export const THEME_STORAGE_KEY = 'theme';

const readStoredTheme = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    // 시크릿 창 등 저장소를 쓸 수 없으면 기기 설정을 따라가요.
    return 'system';
  }
};

// <html data-theme>을 바꾸면 index.css의 토큰 값이 바로 바뀌어요. 'system'은 속성을 지워서 기기 설정을 따르게 해요.
const applyTheme = (preference: ThemePreference) => {
  const root = document.documentElement;

  if (preference === 'system') {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = preference;
  }
};

type ThemeState = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

export const useThemeStore = create<ThemeState>()(set => ({
  preference: readStoredTheme(),

  setPreference: preference => {
    try {
      if (preference === 'system') {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        localStorage.setItem(THEME_STORAGE_KEY, preference);
      }
    } catch {
      // 저장에 실패해도 이번 방문 동안은 고른 테마가 적용돼요.
    }

    applyTheme(preference);
    set({ preference });
  },
}));
