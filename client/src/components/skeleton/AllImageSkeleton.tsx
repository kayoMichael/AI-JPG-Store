import SortingControls, { SortOption } from '@/components/layout/FeatureButton';
import { Skeleton } from '@/components/ui/skeleton';

interface AllImagesSkeletonProps {
  activeSort: SortOption;
  onSortChange: (option: SortOption) => void;
}

const AllImagesSkeleton = ({ activeSort, onSortChange }: AllImagesSkeletonProps) => {
  const ImageGridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 min-w-40 w-full">
      {[...Array(12)].map((_, idx) => (
        <div key={idx} className="relative">
          <Skeleton className="rounded-lg h-60 md:h-80 w-full" />
        </div>
      ))}
    </div>
  );

  const PaginationSkeleton = () => (
    <div className="flex justify-center gap-2 items-center mt-10">
      <Skeleton className="h-10 w-10 rounded-md" />
      <Skeleton className="h-10 w-10 rounded-md" />
      <Skeleton className="h-10 w-10 rounded-md" />
      <Skeleton className="h-6 w-6 rounded-full" />
      <Skeleton className="h-10 w-10 rounded-md" />
      <Skeleton className="h-10 w-10 rounded-md" />
    </div>
  );

  return (
    <>
      <div className="text-5xl mb-14 text-white">All Images</div>
      <div className="min-h-[400px]">
        <SortingControls activeSort={activeSort} onSortChange={onSortChange} />
        <ImageGridSkeleton />
      </div>
      <PaginationSkeleton />
    </>
  );
};

export default AllImagesSkeleton;
