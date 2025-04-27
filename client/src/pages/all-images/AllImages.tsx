import { useState } from 'react';

import { SortOption } from '@/components/layout/FeatureButton';
import { PaginatedContent } from '@/components/layout/PaginatedContent';
import { FocusCards } from '@/components/ui/focusCards';
import { Card } from '@/components/ui/focusCards';
import { usePagination } from '@/hooks/use-pagination';

const Trending = () => {
  const [activeSort, setActiveSort] = useState<SortOption>('newest');

  const { data, isLoading, pagination, handlePageChange, handleSortChange } = usePagination({
    queryKey: 'trending Images',
    apiUrl: '/images/get',
    itemsPerPage: 24,
  });

  const handleSort = (option: SortOption) => {
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
