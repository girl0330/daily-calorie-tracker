import type { KeyboardEvent, ReactNode, SyntheticEvent } from 'react';
import { useAuthStore } from '../../store/authStore';
import { openLoginPrompt } from '../../store/loginPromptStore';

// 누르거나 입력할 수 있는 것들. 이 안에서 일어난 동작만 막아요.
const INTERACTIVE = 'input, textarea, select, button, a, label, [role="button"], [tabindex]';

// 키보드로 자리만 옮기는 키는 막지 않아요. (Tab으로 지나가기, 화살표로 스크롤 등)
const MOVE_KEYS = new Set([
  'Tab',
  'Shift',
  'Escape',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
]);

const isInteractive = (event: SyntheticEvent) =>
  event.target instanceof Element && event.target.closest(INTERACTIVE) !== null;

/**
 * 로그인하지 않은 사람에게 기능을 '보여 주기만' 하는 울타리.
 * - 로그인한 사람: 아무것도 하지 않고 안쪽을 그대로 보여 줘요.
 * - 로그인 안 한 사람: 안쪽은 똑같이 보이지만, 버튼을 누르거나 칸에 입력하려고 하면
 *   그 동작을 막고 '로그인이 필요해요' 안내창을 띄워요.
 * 이벤트를 안쪽 부품보다 먼저 받는(capture) 방식이라, 안쪽 부품은 고치지 않아도 돼요.
 * 감싸는 div는 display: contents라서 화면 배치(그리드·플렉스)에 끼어들지 않아요.
 */
export default function GuestGuard({ children }: { children: ReactNode }) {
  const isLoggedIn = useAuthStore(state => state.user !== null);
  if (isLoggedIn) return children;

  // 동작을 막고 안내창을 띄워요.
  const block = (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    openLoginPrompt();
  };

  return (
    <div
      className="contents"
      // 누르는 순간 칸에 커서가 들어가지 않게 막아요(안내창은 click에서 띄워요).
      onMouseDownCapture={event => {
        if (isInteractive(event)) event.preventDefault();
      }}
      onClickCapture={event => {
        if (isInteractive(event)) block(event);
      }}
      onKeyDownCapture={(event: KeyboardEvent) => {
        if (!MOVE_KEYS.has(event.key) && isInteractive(event)) block(event);
      }}
      // 혹시 글자가 들어가거나 폼이 제출돼도 안쪽 부품까지 가지 않게 한 번 더 막아요.
      onChangeCapture={event => event.stopPropagation()}
      onSubmitCapture={block}
      onDragStartCapture={event => event.preventDefault()}
    >
      {children}
    </div>
  );
}
