import { useState } from 'react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import TextField from '../../components/common/TextField';
import { useLogout } from '../../hooks/useLogout';
import { deleteAccountApi } from '../../service/UserService';
import { showToast } from '../../store/toastStore';

/** 이 글자를 똑같이 입력해야 '탈퇴하기'를 누를 수 있어요. */
const CONFIRM_TEXT = '탈퇴하기';

type WithdrawButtonProps = {
  /** 지금까지 기록한 날 수. 아직 모르거나 0이면 설명에서 날 수를 빼요. */
  recordedDayCount?: number;
};

/**
 * 마이페이지 계정 칸의 '회원 탈퇴' 버튼과 확인 창.
 * '탈퇴하기'를 똑같이 입력해야 버튼이 눌리고, 탈퇴하면 로그아웃해서 로그인 화면으로 보내요.
 */
export default function WithdrawButton({ recordedDayCount }: WithdrawButtonProps) {
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [isPending, setIsPending] = useState(false);

  const open = () => {
    setTyped('');
    setIsOpen(true);
  };

  const close = () => {
    if (isPending) return;
    setIsOpen(false);
  };

  const handleWithdraw = async () => {
    setIsPending(true);
    try {
      await deleteAccountApi();
    } catch {
      setIsPending(false);
      showToast('탈퇴하지 못했어요. 잠시 후 다시 시도해 주세요.');
      return;
    }
    await logout('탈퇴했어요. 그동안 이용해 주셔서 고마워요.');
  };

  const dayText = recordedDayCount ? (
    <>
      지금까지 기록한 <b className="text-(--ink)">{recordedDayCount}일</b>의{' '}
    </>
  ) : null;

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={open}
        className="h-9 w-max cursor-pointer text-left text-sm text-(--err) hover:underline hover:underline-offset-3"
      >
        회원 탈퇴
      </button>

      <ConfirmDialog
        open={isOpen}
        title="정말 탈퇴할까요?"
        description={
          <>탈퇴하면 {dayText}식단 기록, 하루 목표, AI 주간 리포트가 모두 지워져요. 지운 기록은 되돌릴 수 없어요.</>
        }
        confirmLabel={isPending ? '탈퇴하는 중…' : '탈퇴하기'}
        isConfirmDisabled={typed.trim() !== CONFIRM_TEXT || isPending}
        onConfirm={handleWithdraw}
        onCancel={close}
      >
        <TextField
          className="mt-4"
          label={`확인을 위해 '${CONFIRM_TEXT}'를 입력해 주세요.`}
          value={typed}
          placeholder={CONFIRM_TEXT}
          autoComplete="off"
          disabled={isPending}
          onChange={event => setTyped(event.target.value)}
        />
      </ConfirmDialog>
    </>
  );
}
