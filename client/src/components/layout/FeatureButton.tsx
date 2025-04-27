import { SortAsc, SortDesc, Clock, CalendarDays, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

import { cn } from '@/utils/merge';

export type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'reverseAlphabetical' | 'trending';

const SortingControls = ({
  onSortChange,
  activeSort,
}: {
  onSortChange: (option: SortOption) => void;
  activeSort: SortOption;
}) => {
  const [_, setDateButtonState] = useState<'newest' | 'oldest'>('newest');
  const [__, setAlphaButtonState] = useState<'alphabetical' | 'reverseAlphabetical'>(
    'alphabetical'
  );
  useEffect(() => {
    if (activeSort === 'newest' || activeSort === 'oldest') {
      setDateButtonState(activeSort);
    }
    if (activeSort === 'alphabetical' || activeSort === 'reverseAlphabetical') {
      setAlphaButtonState(activeSort);
    }
  }, [activeSort]);

  const handleDateToggle = () => {
    if (activeSort === 'newest') {
      onSortChange('oldest');
    } else if (activeSort === 'oldest') {
      onSortChange('newest');
    } else {
      onSortChange('newest');
    }
  };

  const handleAlphaToggle = () => {
    if (activeSort === 'alphabetical') {
      onSortChange('reverseAlphabetical');
    } else if (activeSort === 'reverseAlphabetical') {
      onSortChange('alphabetical');
    } else {
      onSortChange('alphabetical');
    }
  };

  const handleTrendingSort = () => {
    onSortChange('trending');
  };
  const buttons = [
    {
      id: 'date',
      onClick: handleDateToggle,
      icon: activeSort === 'oldest' ? CalendarDays : Clock,
      label: activeSort === 'oldest' ? 'Oldest' : 'Newest',
      isActive: activeSort === 'newest' || activeSort === 'oldest',
    },
    {
      id: 'alpha',
      onClick: handleAlphaToggle,
      icon: activeSort === 'reverseAlphabetical' ? SortDesc : SortAsc,
      label: activeSort === 'reverseAlphabetical' ? 'Z-A' : 'A-Z',
      isActive: activeSort === 'alphabetical' || activeSort === 'reverseAlphabetical',
    },
    {
      id: 'trending',
      onClick: handleTrendingSort,
      icon: Star,
      label: 'Trending',
      isActive: activeSort === 'trending',
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {buttons.map(({ id, onClick, icon: Icon, label, isActive }) => (
        <button
          key={id}
          onClick={onClick}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full transition-all',
            'text-sm font-medium',
            'border border-neutral-200 dark:border-neutral-800',
            'dark:hover:bg-neutral-800',
            isActive
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-none hover:bg-neutral-700'
              : 'bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 hover:bg-neutral-100'
          )}
        >
          <Icon size={16} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default SortingControls;
