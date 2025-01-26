import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Footer from '@/components/common/Footer';
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
import { capitalize } from '@/utils/capitalise';

const Images = () => {
  const { category } = useParams<{ category: string }>();
  const [uniqueAuthors, setUniqueAuthors] = useState<number>(0);
  const [totalLikes, setTotalLikes] = useState<number>(0);
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
  const navigate = useNavigate();

  useEffect(() => {
    if (!category) {
      navigate('/');
    }
  }, [category, navigate]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categoryImages', currentPage, sorting],
    queryFn: async () => {
      const response = await axios
        .get(
          `/images/get?limit=24&page=${currentPage}&category=${capitalize(category!)}&sortBy=${sorting.sortBy}&order=${sorting.order}`
        )
        .then((res) => res.data);
      setPagination(response.pagination);
      const images = response.images;
      const numberOfAuthors = new Set(
        images.map((image: { authorId: { _id: string } }) => image.authorId._id)
      ).size;
      const totalLikes = images.reduce(
        (acc: number, image: { likes: number }) => acc + image.likes,
        0
      );
      setUniqueAuthors(numberOfAuthors);
      setTotalLikes(totalLikes);
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

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <p className="text-white">No images found for this category.</p>
      </div>
    );
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
      setSorting({ sortBy: 'lexicographical', order: 'desc' });
    } else if (option === 'trending') {
      setSorting({ sortBy: 'likes', order: 'desc' });
    }
  };

  return (
    <>
      <div className="relative w-full min-h-[500px]">
        <div className="absolute bottom-1/4 left-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-white text-3xl md:text-6xl font-bold">
                {capitalize(category ?? '')}
              </h1>
            </div>

            <div className="text-white">
              <p className="text-lg md:mt-20">
                Collection Focused on {capitalize(category ?? '')} Art Style created by Generative
                AI
              </p>
              <div className="flex gap-4 text-sm mt-2">
                <span>Last Created: {data[0].createdAt.split('T')[0]}</span>
                <span>Collection Created: {data.at(-1).createdAt.split('T')[0]}</span>
              </div>
            </div>

            <div className="flex gap-6 text-white text-sm">
              <div>
                <p>Total Images</p>
                <p className="font-bold">{pagination?.totalItems}</p>
              </div>
              <div>
                <p>Total Likes</p>
                <p className="font-bold">{totalLikes}</p>
              </div>
              <div>
                <p>Last Posted</p>
                <p className="font-bold">{data[0].title}</p>
              </div>
              <div>
                <p>Visible</p>
                <p className="font-bold">100%</p>
              </div>
              <div>
                <p>Authors (Unique)</p>
                <p className="font-bold">{uniqueAuthors}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SortingControls
        activeSort={activeSort}
        onSortChange={(option: 'newest' | 'oldest' | 'alphabetical' | 'trending') =>
          handleSortChange(option)
        }
      />
      <FocusCards cards={data} type="category" />
      <div className="mt-10">
        <Pagination>
          <PaginationContent>{renderPaginationItems()}</PaginationContent>
        </Pagination>
      </div>
      <div className="-mx-24 -mb-10 mt-10">
        <Footer />
      </div>
    </>
  );
};

export default Images;
