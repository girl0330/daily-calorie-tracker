import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/authStore';
import { logoutApi } from '../../service/UserService';
import { useThemeStore, type ThemePreference } from '../../store/themeStore';
import SegmentedControl from '../../components/common/SegmentedControl';

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

      {/* 하루 목표와 AI 주간 리포트 설정은 4단계에서 추가해요. */}
      <div>
        <SettingSection id="mypage-password" title="비밀번호 변경" description="바꾼 뒤에는 다시 로그인해야 해요." isFirst>
          <Link
            to="/change-password"
            className="inline-flex h-9 w-max items-center rounded-lg border border-(--muted) px-3.5 text-[13px] font-medium text-(--ink) transition-colors duration-150 hover:border-(--ink-2)"
          >
            비밀번호 변경하기
          </Link>
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
