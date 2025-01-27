import { useEffect, useState } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardSkeleton = () => {
  const [itemsToShow, setItemsToShow] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsToShow(1);
      } else if (width < 1000) {
        setItemsToShow(2);
      } else if (width < 1424) {
        setItemsToShow(3);
      } else {
        setItemsToShow(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const CarouselSkeleton = () => (
    <div className="w-full">
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {[...Array(itemsToShow)].map((_, idx) => (
            <CarouselItem
              key={idx}
              className={`pl-2 md:pl-4 ${
                itemsToShow === 1
                  ? 'basis-full'
                  : itemsToShow === 2
                    ? 'basis-1/2'
                    : itemsToShow === 3
                      ? 'basis-1/3'
                      : 'basis-1/4'
              }`}
            >
              <div className="relative h-64 sm:h-72 md:h-80 lg:h-96">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
  const RecentImagesSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 min-w-40 w-full">
      {[...Array(8)].map((_, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <Skeleton className="h-60 md:h-80 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
  const CategoriesSkeleton = () => (
    <div className="relative w-full">
      <div className="flex w-full overflow-x-hidden pb-10">
        <div className="flex flex-row gap-4 pl-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="rounded-3xl">
              <Skeleton className="h-80 w-56 md:h-[40rem] md:w-96 rounded-3xl" />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-5 right-0 flex justify-end gap-2 mr-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
  return (
    <div className="relative">
      <CarouselSkeleton />
      <div className="mt-24 flex flex-col gap-8">
        <Skeleton className="h-12 w-64" />
        <RecentImagesSkeleton />
        <div className="py-8">
          <Skeleton className="h-12 w-64 mb-10" />
          <CategoriesSkeleton />
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
