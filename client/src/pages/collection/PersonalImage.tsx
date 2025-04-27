import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { PaginatedContent } from '@/components/layout/PaginatedContent';
import { FocusCards, Card } from '@/components/ui/focusCards';
import { useAuth } from '@/context/AuthContext';
import { usePagination } from '@/hooks/use-pagination';
import { useToast } from '@/hooks/use-toast';
const PersonalImages = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('toast')) {
      toast({
        title: 'Image Deleted',
        description: 'Your image has been deleted successfully.',
        variant: 'default',
      });
      params.delete('toast');
      navigate(
        {
          pathname: location.pathname,
          search: params.toString(),
        },
        { replace: true }
      );
    }
  }, [location.search, location.pathname, toast, navigate]);

  const [activeSort, setActiveSort] = useState<'newest' | 'oldest' | 'alphabetical' | 'trending'>(
    'newest'
  );

  const { data, isLoading, pagination, handlePageChange, handleSortChange } = usePagination({
    queryKey: 'Personal Images',
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
