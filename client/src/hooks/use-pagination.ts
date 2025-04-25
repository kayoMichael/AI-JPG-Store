import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface SortingState {
  sortBy: string;
  order: string;
}

interface UsePaginationProps {
  queryKey: string;
  apiUrl: string;
  itemsPerPage?: number;
  category?: string;
  userId?: string;
  initialSort?: SortingState;
}

export const usePagination = ({
  queryKey,
  apiUrl,
  itemsPerPage = 24,
  category,
  userId,
  initialSort = { sortBy: 'createdAt', order: 'desc' },
}: UsePaginationProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>(initialSort);

  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKey, location.pathname, currentPage, sorting],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        page: currentPage.toString(),
        sortBy: sorting.sortBy,
        order: sorting.order,
      });
      if (category) params.append('category', category);
      if (userId) params.append('authorId', userId);

      const response = await axios.get(`${apiUrl}?${params.toString()}`).then((res) => res.data);
      return {
        images: response.images,
        pagination: response.pagination,
      };
    },
    staleTime: 1000 * 60 * 4,
    gcTime: 1000 * 60 * 7,
    refetchOnWindowFocus: false,
  });

  const pagination = data?.pagination as PaginationState;

  useEffect(() => {
    if (isError) {
      navigate('/error');
    }
  }, [isError, navigate]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      setCurrentPage(page);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 50);
    }
  };

  const handleSortChange = (option: 'newest' | 'oldest' | 'alphabetical' | 'trending') => {
    if (option === 'oldest') {
      setSorting({ sortBy: 'createdAt', order: 'asc' });
    } else if (option === 'newest') {
      setSorting({ sortBy: 'createdAt', order: 'desc' });
    } else if (option === 'alphabetical') {
      setSorting({ sortBy: 'lexicographical', order: 'asc' });
    } else if (option === 'trending') {
      setSorting({ sortBy: 'likes', order: 'desc' });
    }
  };

  return {
    data: data?.images || [],
    isLoading,
    pagination,
    currentPage,
    handlePageChange,
    handleSortChange,
    sorting,
  };
};
