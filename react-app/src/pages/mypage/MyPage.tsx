import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/authStore';
import { logoutApi } from '../../service/UserService';
import { useThemeStore, type ThemePreference } from '../../store/themeStore';
import SegmentedControl from '../../components/common/SegmentedControl';
import GoalSection from '../../features/goals/components/GoalSection';
import { useRecordedDayCount } from '../../features/foods/hooks/useRecordedDayCount';
import ChangePasswordForm from './ChangePasswordForm';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: '시스템' },
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' },
];

type SettingSectionProps = {
  id: string;
  title: string;
  description?: string;
  isFirst?: boolean;
  children: ReactNode;
};

// 시안의 설정 한 줄: 왼쪽 제목·설명, 오른쪽 내용 (760px 이하는 위아래로)
function SettingSection({ id, title, description, isFirst = false, children }: SettingSectionProps) {
  return (
    <section
      aria-labelledby={id}
      className={`grid gap-x-12 gap-y-3 border-t py-5 md:grid-cols-[220px_minmax(0,1fr)] md:py-6 ${
        isFirst ? 'border-(--ink)' : 'border-(--line)'
      }`}
    >
      <div>
        <h2 id={id} className="m-0 text-base font-bold text-(--ink)">
          {title}
        </h2>
        {description && <p className="mt-1 text-[13px] text-(--ink-2)">{description}</p>}
      </div>

      <div className="flex max-w-150 min-w-0 flex-col gap-4">{children}</div>
    </section>
  );
}

export default function MyPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const clearUser = useAuthStore(state => state.clearUser);
  const themePreference = useThemeStore(state => state.preference);
  const setThemePreference = useThemeStore(state => state.setPreference);

  const { data: recordedDayCount } = useRecordedDayCount(user?.id);

  const email = user?.email ?? '';
  const joinedAt = user?.created_at ? format(new Date(user.created_at), 'yyyy년 M월 d일') : '';

  const handleLogout = async () => {
    await logoutApi();

    clearUser();
    navigate('/login', { replace: true });
  };

  return (
    <div className="mx-auto flex w-full max-w-300 flex-col gap-5 px-4 pt-5 pb-12 md:gap-7 md:px-6 md:pt-8">
      <div className="flex flex-col justify-end gap-0.5 md:mt-5 md:min-h-19 md:pb-1">
        <h1 className="m-0 text-[28px] leading-[1.1] font-bold tracking-[-0.03em] text-(--ink) md:text-4xl">
          마이페이지
        </h1>
        <span className="text-sm text-(--ink-2)">{email}</span>
      </div>

      {/* AI 주간 리포트 설정은 8단계에서 추가해요. */}
      <div>
        {user && (
          <SettingSection
            id="mypage-goal"
            title="하루 목표"
            description="일일 기록과 월간 기록, 주간 리포트가 이 목표를 기준으로 보여요."
            isFirst
          >
            <GoalSection userId={user.id} />
          </SettingSection>
        )}

        <SettingSection id="mypage-password" title="비밀번호 변경" description="바꾼 뒤에는 다시 로그인해야 해요.">
          <ChangePasswordForm />
        </SettingSection>

        <SettingSection id="mypage-theme" title="화면 테마" description="시스템을 고르면 기기 설정을 따라가요.">
          <SegmentedControl
            ariaLabel="화면 테마"
            size="sm"
            options={THEME_OPTIONS}
            value={themePreference}
            onChange={setThemePreference}
          />
        </SettingSection>

        <SettingSection id="mypage-account" title="계정">
          <dl className="m-0 grid grid-cols-[96px_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
            <dt className="text-(--ink-2)">이메일</dt>
            <dd className="m-0 break-all text-(--ink)">{email}</dd>
            {joinedAt && (
              <>
                <dt className="text-(--ink-2)">가입일</dt>
                <dd className="m-0 text-(--ink)">{joinedAt}</dd>
              </>
            )}
            {recordedDayCount !== undefined && (
              <>
                <dt className="text-(--ink-2)">기록한 날</dt>
                <dd className="m-0 text-(--ink)">지금까지 {recordedDayCount}일</dd>
              </>
            )}
          </dl>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={handleLogout}
              className="h-9 w-max cursor-pointer text-left text-sm text-(--ink-2) hover:underline hover:underline-offset-3"
            >
              로그아웃
            </button>
          </div>
        </SettingSection>
      </div>
    </div>
  );
}
