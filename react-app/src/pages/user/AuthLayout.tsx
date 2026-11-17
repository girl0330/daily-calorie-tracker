import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  /** 폼 아래 글자 링크들(다른 인증 화면으로 가기) */
  footer?: ReactNode;
};

/**
 * 로그인·회원가입·비밀번호 찾기·재설정이 함께 쓰는 틀. (2026-11-18 고른 시안 C)
 * 위에서부터 영양소 색 띠 → 앱 이름과 소개 한 줄 → 제목과 설명 → 폼 → 아래 글자 링크.
 */
export default function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <main className="flex min-h-svh justify-center bg-(--bg) px-4 pt-12 pb-10 md:items-center md:py-16">
      <div className="w-full max-w-100">
        {/* 탄수화물·단백질·지방 색 띠(꾸밈이라 화면 읽기에서는 건너뛰어요) */}
        <div aria-hidden="true" className="mb-6 flex h-1.5 overflow-hidden rounded-full">
          <span className="flex-5 bg-(--carbs)" />
          <span className="flex-3 bg-(--protein)" />
          <span className="flex-2 bg-(--fat)" />
        </div>

        <p className="m-0 text-sm font-bold text-(--brand)">Daily Tracker</p>
        <p className="m-0 mt-0.5 text-[13px] text-(--muted)">오늘 먹은 걸 기록하고 한 주를 돌아봐요.</p>

        <h1 className="m-0 mt-8 text-[28px] leading-[1.15] font-bold tracking-[-0.03em] text-(--ink)">{title}</h1>
        <p className="m-0 mt-1.5 text-sm break-keep text-(--ink-2)">{description}</p>

        <div className="mt-6">{children}</div>

        {footer && <div className="mt-6 flex flex-col items-center gap-2.5 text-sm text-(--ink-2)">{footer}</div>}
      </div>
    </main>
  );
}

type AuthNoticeProps = {
  /** error: 실패 안내(빨강) / ok: 완료 안내(초록) */
  tone: 'error' | 'ok';
  children: ReactNode;
};

/** 폼 안의 안내 상자. 서버에서 실패했거나(비밀번호가 틀림 등) 끝났을 때(메일 보냄) 보여 줘요. */
export function AuthNotice({ tone, children }: AuthNoticeProps) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`m-0 rounded-lg px-3 py-2.5 text-[13px] break-keep ${
        tone === 'error' ? 'bg-(--err-soft) text-(--err)' : 'bg-(--ok-soft) text-(--ok)'
      }`}
    >
      {children}
    </p>
  );
}

type AuthLinkProps = {
  to: string;
  /** strong: 갈색 굵은 밑줄 링크(예: '회원가입') / 기본: 흐린 글자 링크(예: '비밀번호를 잊었어요') */
  strong?: boolean;
  children: ReactNode;
};

/** 아래 글자 링크. 다른 인증 화면으로 가요. */
export function AuthLink({ to, strong = false, children }: AuthLinkProps) {
  return (
    <Link
      to={to}
      className={
        strong
          ? 'font-bold text-(--brand) underline underline-offset-3 hover:no-underline'
          : 'text-(--ink-2) hover:underline hover:underline-offset-3'
      }
    >
      {children}
    </Link>
  );
}
