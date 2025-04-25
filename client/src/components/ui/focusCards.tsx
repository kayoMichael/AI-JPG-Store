import { Heart } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Image from '../common/Image';

import { AiModels } from '@/constant/AiModels';
import { cn } from '@/utils/merge';

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    type,
  }: {
    card: Card;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    type: 'main' | 'category';
  }) => {
    const aiModel = AiModels.find((model) => model.id === parseInt(card.aiModel));
    const navigate = useNavigate();
    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => navigate(`/images/${card.category}/${card._id}`)}
        className={cn(
          'rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-80 w-full transition-all duration-300 ease-out cursor-pointer',
          hovered !== null && hovered !== index && 'blur-sm scale-[0.98]'
        )}
      >
        <div className="w-full h-full relative">
          <Image src={card.url} className="mx-auto" priority={true} loading="eager" />
        </div>
        <div
          className={cn(
            'absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300',
            hovered === index ? 'opacity-100' : 'opacity-0'
          )}
        >
          {type === 'main' ? (
            <div className="w-full max-w-md flex flex-col gap-2 p-4">
              <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                {card.title}
              </div>
              <div className="flex gap-2 items-center justify-between">
                <p className="text-sm bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                  {card.category}
                </p>
                <div className="flex gap-2 items-center">
                  <Heart strokeWidth={2} className="h-4 w-4" color="red" />
                  <p className="text-sm bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                    {card.likes}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md flex flex-col gap-2 p-4">
              <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                {card.title}
              </div>
              <div className="flex gap-2 items-center justify-between">
                <p className="text-sm bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                  {aiModel?.name}
                </p>
                <div className="flex gap-2 items-center">
                  <Heart strokeWidth={2} className="h-4 w-4" color="red" />
                  <p className="text-sm bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                    {card.likes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';

export type Card = {
  title: string;
  url: string;
  category: string;
  authorId: { name: string };
  likes: number;
  aiModel: string;
  _id: string;
};

export function FocusCards({ cards, type }: { cards: Card[]; type: 'main' | 'category' }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 min-w-40 w-full">
      {' '}
      {cards.map((card, index) => (
        <Card
          key={card.title}
          type={type}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
