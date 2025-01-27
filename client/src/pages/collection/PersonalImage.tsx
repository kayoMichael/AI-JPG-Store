import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PaginatedContent } from '@/components/layout/PaginatedContent';
import { FocusCards, Card } from '@/components/ui/focusCards';
import { useAuth } from '@/context/AuthContext';
import { usePagination } from '@/hooks/use-pagination';
const PersonalImages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  });
  const [activeSort, setActiveSort] = useState<'newest' | 'oldest' | 'alphabetical' | 'trending'>(
    'newest'
  );

  const { data, isLoading, pagination, handlePageChange, handleSortChange } = usePagination({
    queryKey: 'trendingImages',
    apiUrl: '/images/get',
    itemsPerPage: 24,
    userId: user?.id,
  });

  const handleSort = (option: 'newest' | 'oldest' | 'alphabetical' | 'trending') => {
    setActiveSort(option);
    handleSortChange(option);
  };

  return (
    <PaginatedContent
      title="My Created Images"
      data={data}
      isLoading={isLoading}
      activeSort={activeSort}
      pagination={pagination}
      onPageChange={handlePageChange}
      onSortChange={handleSort}
      renderContent={(data: Card[]) => <FocusCards cards={data} type="main" />}
    />
  );
};

export default PersonalImages;
