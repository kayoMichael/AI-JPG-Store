import { ReactNode } from 'react';

import SortingControls from '@/components/layout/FeatureButton';
import AllImagesSkeleton from '@/components/skeleton/AllImageSkeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface PaginatedContentProps<T> {
  title: string;
  data: T[];
  isLoading: boolean;
  activeSort: 'newest' | 'oldest' | 'alphabetical' | 'trending';
  pagination?: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onPageChange: (page: number) => void;
  onSortChange: (option: 'newest' | 'oldest' | 'alphabetical' | 'trending') => void;
  renderContent: (data: T[]) => ReactNode;
}

export function PaginatedContent<T>({
  title,
  data,
  isLoading,
  activeSort,
  pagination,
  onPageChange,
  onSortChange,
  renderContent,
}: PaginatedContentProps<T>) {
  const renderPaginationItems = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const items = [];
    const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination;

    items.push(
      <PaginationItem key="prev" className="cursor-pointer">
        <PaginationPrevious
          onClick={() => onPageChange(currentPage - 1)}
          className={!hasPrevPage ? 'pointer-events-none opacity-50' : ''}
        />
      </PaginationItem>
    );

    const createPageItem = (pageNum: number) => (
      <PaginationItem key={pageNum} className="cursor-pointer">
        <PaginationLink onClick={() => onPageChange(pageNum)} isActive={currentPage === pageNum}>
          {pageNum}
        </PaginationLink>
      </PaginationItem>
    );

    items.push(createPageItem(1));

    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === totalPages) continue;
      items.push(createPageItem(i));
    }

    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (totalPages > 1) {
      items.push(createPageItem(totalPages));
    }

    items.push(
      <PaginationItem key="next" className="cursor-pointer">
        <PaginationNext
          onClick={() => onPageChange(currentPage + 1)}
          className={!hasNextPage ? 'pointer-events-none opacity-50' : ''}
        />
      </PaginationItem>
    );

    return items;
  };

  if (isLoading) {
    return <AllImagesSkeleton activeSort={activeSort} onSortChange={onSortChange} />;
  }

  return (
    <>
      <div className="text-5xl mb-14 text-white">{title}</div>
      <div className="min-h-[400px]">
        {data.length >= 4 ? (
          <SortingControls activeSort={activeSort} onSortChange={onSortChange} />
        ) : data.length == 0 ? (
          <div className="text-white">
            You have not created a Image yet. You can create one in the Image Creation Page.{' '}
          </div>
        ) : null}
        {renderContent(data)}
      </div>
      <div className="mt-10">
        <Pagination>
          <PaginationContent>{renderPaginationItems()}</PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
