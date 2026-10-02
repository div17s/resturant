import { cn } from '../../lib/utils';

export const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-stone-800/60', className)}
      {...props}
    />
  );
};

export const DishCardSkeleton = () => {
  return (
    <div className="bg-stone-900/60 border border-stone-800 rounded-xl overflow-hidden p-5 flex flex-col sm:flex-row gap-5">
      <Skeleton className="w-full sm:w-28 h-40 sm:h-28 rounded-lg shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-14" />
        </div>
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};
