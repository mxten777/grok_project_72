import { cn } from '../utils/cn';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-secondary-200",
        className
      )}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Skeleton className="h-48 w-full mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-8 w-1/3 mb-4" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
};

export const DashboardCardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-8 w-1/4" />
    </div>
  );
};