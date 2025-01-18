import { useEffect, useState } from 'react';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { DirectionAwareHover } from '@/components/ui/heroCard';

interface CarouselCard {
  id: number;
  title: string;
  description: string;
  price: string;
}

const cards: CarouselCard[] = [
  { id: 1, title: 'Digital Art Collection', description: 'By Artist One', price: '0.52 ETH' },
  { id: 2, title: 'Nature Series', description: 'By Artist Two', price: '0.15 ETH' },
  { id: 3, title: 'Abstract Moments', description: 'By Artist Three', price: '0.12 ETH' },
  { id: 4, title: 'Urban Landscapes', description: 'By Artist Four', price: '0.08 ETH' },
  { id: 5, title: 'Cosmic Dreams', description: 'By Artist Five', price: '0.25 ETH' },
  { id: 6, title: 'Ocean Depths', description: 'By Artist Six', price: '0.18 ETH' },
  { id: 7, title: 'Mountain Peaks', description: 'By Artist Seven', price: '0.22 ETH' },
  { id: 8, title: 'Desert Nights', description: 'By Artist Eight', price: '0.30 ETH' },
];

export const CarouselCards = () => {
  const [api, setApi] = useState<any>();

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
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {cards.map((card) => (
            <CarouselItem key={card.id} className="pl-2 md:pl-4 md:basis-1/4">
              <div className="h-[30rem] relative flex justify-center">
                <DirectionAwareHover imageUrl="https://images.unsplash.com/photo-1663765970236-f2acfde22237?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                  <p className="font-bold text-xl">In the mountains</p>
                  <p className="font-normal text-sm">$1299 / night</p>
                </DirectionAwareHover>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
