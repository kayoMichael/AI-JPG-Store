import { Skeleton } from '@/components/ui/skeleton';

const DetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Skeleton className="h-full w-full" />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          <div className="h-1/3 w-full rounded-md border p-4 md:h-2/3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
      <div>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} className="aspect-[4/3] w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailSkeleton;
