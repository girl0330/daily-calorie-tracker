const SkeletonBlock = ({ className = '' }: { className?: string }) => {
  return <div className={`animate-pulse rounded-md bg-(--neutral-4) ${className}`} />;
};

const SectionHeaderSkeleton = () => {
  return <SkeletonBlock className="h-6 w-28" />;
};

const DateNavigatorSkeleton = () => {
  return (
    // 실제 DateNavigator와 같은 높이만 유지하고
    // 내부 스켈레톤은 표시하지 않는다.
    <div className="h-20 shrink-0 border-b border-(--neutral-4) bg-(--white)" />
  );
};

const FoodInputSkeleton = () => {
  return (
    <section className="flex min-h-0 flex-col border-y border-r border-(--neutral-4) bg-(--white) px-6 py-5">
      <SectionHeaderSkeleton />

      <div className="flex min-h-0 flex-1 items-center py-5">
        <SkeletonBlock className="h-40 w-full" />
      </div>
    </section>
  );
};

const NutritionSkeleton = () => {
  return (
    <section className="flex min-h-0 flex-col border-y border-(--neutral-4) bg-(--white) px-6 py-5">
      <SectionHeaderSkeleton />

      <div className="mt-5 grid min-h-0 flex-1 grid-cols-[minmax(0,2fr)_minmax(80px,1fr)] items-center rounded-lg border border-(--neutral-4) px-8">
        <SkeletonBlock className="h-24 w-[75%]" />

        <div className="flex justify-center">
          <SkeletonBlock className="aspect-square w-24 rounded-full md:w-32" />
        </div>
      </div>
    </section>
  );
};

const MealSkeleton = () => {
  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex h-[60px] shrink-0 items-center justify-center border-b border-(--neutral-4)">
        <SkeletonBlock className="h-6 w-32" />
      </div>

      <div className="min-h-0 flex-1 p-4">
        <SkeletonBlock className="h-36 w-full" />
      </div>
    </div>
  );
};

const CardBoardSkeleton = () => {
  return (
    <section className="bg-(--white) px-6 py-5">
      <SectionHeaderSkeleton />

      <div className="mt-5 grid grid-cols-1 border border-(--neutral-4) xl:grid-cols-3 xl:divide-x xl:divide-(--neutral-4)">
        {Array.from({ length: 3 }).map((_, index) => (
          <MealSkeleton key={index} />
        ))}
      </div>
    </section>
  );
};

const DailyTrackerSkeleton = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col" aria-hidden="true">
      <DateNavigatorSkeleton />

      <div className="grid shrink-0 xl:grid-cols-2">
        <div className="hidden lg:block">
          <FoodInputSkeleton />
        </div>

        <NutritionSkeleton />
      </div>

      <div className="min-h-0 flex-1">
        <CardBoardSkeleton />
      </div>
    </div>
  );
};

export default DailyTrackerSkeleton;
