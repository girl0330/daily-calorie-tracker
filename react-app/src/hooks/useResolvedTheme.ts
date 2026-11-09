import { useSyncExternalStore } from 'react';
import { useThemeStore } from '../store/themeStore';

const DARK_QUERY = '(prefers-color-scheme: dark)';

const subscribeSystemTheme = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(DARK_QUERY);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
};

const getSystemIsDark = () => window.matchMedia(DARK_QUERY).matches;

/**
 * 지금 화면에 실제로 적용된 테마('light' | 'dark')를 돌려줘요.
 * '시스템'을 고른 상태에서 기기 설정이 바뀌어도 다시 렌더돼요.
 * CSS 변수 값을 자바스크립트로 읽어 그리는 곳(차트 등)에서 써요.
 */
export function useResolvedTheme(): 'light' | 'dark' {
  const preference = useThemeStore(state => state.preference);
  const systemIsDark = useSyncExternalStore(subscribeSystemTheme, getSystemIsDark);

  if (preference === 'system') {
    return systemIsDark ? 'dark' : 'light';
  }

  return preference;
}
