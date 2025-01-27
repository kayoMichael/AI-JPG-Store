import { useEffect, useState } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel';
import { DirectionAwareHover } from '@/components/ui/heroCard';

interface Props {
  _id: string;
  title: string;
  url: string;
  category: string;
  likes: number;
  authorId: { name: string };
}

type CarouselCardsProps = {
  featuredData: Props[];
};

export const CarouselCards = ({ featuredData }: CarouselCardsProps) => {
  const [api, setApi] = useState<CarouselApi>();
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

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="w-full">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: 'start',
          loop: true,
          slidesToScroll: itemsToShow,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {featuredData.map((card) => (
            <CarouselItem
              key={card._id}
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
                <div className="w-full h-full aspect-[1/1]">
                  <DirectionAwareHover
                    imageUrl={card.url}
                    imageId={card._id}
                    imageCategory={card.category}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col p-4">
                      <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                        {card.title}
                      </div>
                      <p className="text-sm bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                        {card.category}
                      </p>
                    </div>
                  </DirectionAwareHover>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CarouselCards;
