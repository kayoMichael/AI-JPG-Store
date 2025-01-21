import { SortAsc, Clock, CalendarDays } from 'lucide-react';

import { cn } from '@/utils/merge';

type SortOption = 'newest' | 'oldest' | 'alphabetical';

const SortingControls = ({
  onSortChange,
  activeSort,
}: {
  onSortChange: (option: SortOption) => void;
  activeSort: SortOption;
}) => {
  const handleSort = (option: SortOption) => {
    onSortChange(option);
  };

  const buttons = [
    {
      id: 'newest',
      icon: Clock,
      label: 'Newest',
    },
    {
      id: 'oldest',
      icon: CalendarDays,
      label: 'Oldest',
    },
    {
      id: 'alphabetical',
      icon: SortAsc,
      label: 'A-Z',
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {buttons.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => handleSort(id as SortOption)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full transition-all',
            'text-sm font-medium',
            'border border-neutral-200 dark:border-neutral-800',
            'hover:bg-neutral-100 dark:hover:bg-neutral-800',
            activeSort === id
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
              : 'bg-white text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300'
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
