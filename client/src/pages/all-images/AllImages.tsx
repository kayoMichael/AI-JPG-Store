import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import SortingControls from '@/components/layout/FeatureButton';
import { FocusCards } from '@/components/ui/focusCards';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

const Trending = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeSort, setActiveSort] = useState<'newest' | 'oldest' | 'alphabetical' | 'trending'>(
    'newest'
  );
  const [sorting, setSorting] = useState<{ sortBy: string; order: string }>({
    sortBy: 'createdAt',
    order: 'desc',
  });
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['trendingImages', currentPage, sorting],
    queryFn: async () => {
      const response = await axios
        .get(
          `/images/get?limit=24&page=${currentPage}&sortBy=${sorting.sortBy}&order=${sorting.order}`
        )
        .then((res) => res.data);
      setPagination(response.pagination);
      const images = response.images;
      return images;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (isError) {
      navigate('/error');
    }
  }, [isError, navigate]);

  if (isLoading) {
    return null;
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      setCurrentPage(page);
    }
  };

  const renderPaginationItems = () => {
    if (!pagination || pagination.totalPages === 1) return null;

    const items = [];

    items.push(
      <PaginationItem key="prev" className="cursor-pointer">
        <PaginationPrevious
          onClick={() => handlePageChange(currentPage - 1)}
          className={!pagination.hasPrevPage ? 'pointer-events-none opacity-50' : ''}
        />
      </PaginationItem>
    );

    items.push(
      <PaginationItem key={1}>
        <PaginationLink onClick={() => handlePageChange(1)} isActive={pagination.currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (pagination.currentPage !== 1 && pagination.currentPage !== pagination.totalPages) {
      items.push(
        <PaginationItem key={pagination.currentPage}>
          <PaginationLink isActive>{pagination.currentPage}</PaginationLink>
        </PaginationItem>
      );
    }

    if (pagination.currentPage < pagination.totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (pagination.totalPages > 1) {
      items.push(
        <PaginationItem key={pagination.totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(pagination.totalPages)}
            isActive={pagination.currentPage === pagination.totalPages}
          >
            {pagination.totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (pagination.hasNextPage) {
      items.push(
        <PaginationItem key="next" className="cursor-pointer">
          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
        </PaginationItem>
      );
    }

    return items;
  };

  const handleSortChange = (option: 'newest' | 'oldest' | 'alphabetical' | 'trending') => {
    setActiveSort(option);
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
  return (
    <>
      <div className="text-5xl mb-14 text-white">All Images</div>
      <div className="min-h-[400px]">
        <SortingControls
          activeSort={activeSort}
          onSortChange={(option: 'newest' | 'oldest' | 'alphabetical' | 'trending') =>
            handleSortChange(option)
          }
        />
        <FocusCards cards={data} type="main" />
      </div>
      <div className="mt-10">
        <Pagination>
          <PaginationContent>{renderPaginationItems()}</PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default Trending;
