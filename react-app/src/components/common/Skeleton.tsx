type SkeletonProps = {
  className?: string;
};

// 시안의 스켈레톤 블록: 불러오는 동안 자리만 잡아 두는 회색 막대. 크기와 모양은 className으로 정해요.
export default function Skeleton({ className = '' }: SkeletonProps) {
  // 같은 속성의 클래스가 두 개면 어느 쪽이 이길지 장담할 수 없어서, 모서리를 넘겨받으면 기본값을 빼요.
  const radiusClassName = className.includes('rounded-') ? '' : 'rounded-md';

  return (
    <span
      aria-hidden="true"
      className={`block animate-skeleton bg-(--skel) motion-reduce:animate-none ${radiusClassName} ${className}`}
    />
  );
}
