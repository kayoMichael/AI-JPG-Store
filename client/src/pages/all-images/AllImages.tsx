import { useState } from 'react';

import { PaginatedContent } from '@/components/layout/PaginatedContent';
import { FocusCards } from '@/components/ui/focusCards';
import { Card } from '@/components/ui/focusCards';
import { usePagination } from '@/hooks/use-pagination';

const Trending = () => {
  const [activeSort, setActiveSort] = useState<'newest' | 'oldest' | 'alphabetical' | 'trending'>(
    'newest'
  );

  const { data, isLoading, pagination, handlePageChange, handleSortChange } = usePagination({
    queryKey: 'trending Images',
    apiUrl: '/images/get',
    itemsPerPage: 24,
  });

  const handleSort = (option: 'newest' | 'oldest' | 'alphabetical' | 'trending') => {
    setActiveSort(option);
    handleSortChange(option);
  };

  return (
    <PaginatedContent
      title="All Images"
      data={data || []}
      isLoading={isLoading}
      activeSort={activeSort}
      pagination={pagination}
      onPageChange={handlePageChange}
      onSortChange={handleSort}
      renderContent={(data: Card[]) => <FocusCards cards={data} type="main" />}
    />
  );
};

export default Trending;
