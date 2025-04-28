import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { SortOption } from '@/components/layout/FeatureButton';

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
  const effectiveUserIdRef = useRef(userId);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    const sort = params.get('sortBy');
    const order = params.get('order');
    let needsUpdate = false;
    const newParams = new URLSearchParams(params.toString());
    if (page && /^\d+$/.test(page)) {
      setCurrentPage(Number(page));
    } else {
      setCurrentPage(1);
      newParams.set('page', '1');
      needsUpdate = true;
    }
    if (sort === 'lexicographical' || sort === 'createdAt' || sort === 'likes') {
      setSorting((prev) => ({
        ...prev,
        sortBy: sort,
      }));
    } else {
      setSorting((prev) => ({
        ...prev,
        sortBy: initialSort.sortBy,
      }));
      newParams.set('sortBy', initialSort.sortBy);
      needsUpdate = true;
    }
    if (order === 'asc' || order === 'desc') {
      setSorting((prev) => ({
        ...prev,
        order,
      }));
    } else {
      setSorting((prev) => ({
        ...prev,
        sortBy: initialSort.sortBy,
        order: initialSort.order,
      }));
      newParams.set('order', initialSort.order);
      needsUpdate = true;
    }
    if (needsUpdate) {
      navigate(
        {
          pathname: location.pathname,
          search: newParams.toString(),
        },
        { replace: true }
      );
    }
  }, []);

  useEffect(() => {
    if (userId) {
      effectiveUserIdRef.current = userId;
    }
  }, [userId]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [queryKey, location.pathname, currentPage, sorting],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        page: currentPage.toString(),
        sortBy: sorting.sortBy,
        order: sorting.order,
        personal: (queryKey === 'Personal Images').toString(),
      });
      if (category) params.append('category', category);
      if (effectiveUserIdRef.current)
        params.append('authorId', effectiveUserIdRef.current.toString());

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('refetch')) {
      refetch();
      params.delete('refetch');
      navigate(
        {
          pathname: location.pathname,
          search: params.toString(),
        },
        { replace: true }
      );
    }
  }, [location.search, location.pathname, navigate, refetch]);

  const pagination = data?.pagination as PaginationState;

  useEffect(() => {
    if (isError) {
      navigate('/error');
    }
  }, [isError, navigate]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      const params = new URLSearchParams(location.search);
      params.set('page', page.toString());
      setCurrentPage(page);
      navigate(
        {
          pathname: location.pathname,
          search: params.toString(),
        },
        { replace: true }
      );
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 50);
    }
  };

  const handleSortChange = (option: SortOption) => {
    let newSorting: SortingState;

    if (option === 'oldest') {
      newSorting = { sortBy: 'createdAt', order: 'asc' };
    } else if (option === 'newest') {
      newSorting = { sortBy: 'createdAt', order: 'desc' };
    } else if (option === 'alphabetical') {
      newSorting = { sortBy: 'lexicographical', order: 'asc' };
    } else if (option === 'reverseAlphabetical') {
      newSorting = { sortBy: 'lexicographical', order: 'desc' };
    } else if (option === 'trending') {
      newSorting = { sortBy: 'likes', order: 'desc' };
    } else {
      newSorting = { sortBy: 'createdAt', order: 'desc' };
    }
    setSorting(newSorting);

    const params = new URLSearchParams(location.search);
    params.set('sortBy', newSorting.sortBy);
    params.set('order', newSorting.order);

    params.set('page', '1');
    setCurrentPage(1);

    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
      },
      { replace: true }
    );
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
