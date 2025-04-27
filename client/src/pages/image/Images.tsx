import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import Footer from '@/components/common/Footer';
import DynamicCover from '@/components/layout/DynamicCover';
import SortingControls from '@/components/layout/FeatureButton';
import { SortOption } from '@/components/layout/FeatureButton';
import AllImagesSkeleton from '@/components/skeleton/AllImageSkeleton';
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

interface SortingState {
  sortBy: string;
  order: string;
}

const Images = () => {
  const { category } = useParams<{ category: string }>();
  const [uniqueAuthors, setUniqueAuthors] = useState<number>(0);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sorting, setSorting] = useState<SortingState>({
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
  const location = useLocation();

  const getSortOption = (): SortOption => {
    const { sortBy, order } = sorting;

    if (sortBy === 'createdAt' && order === 'desc') return 'newest';
    if (sortBy === 'createdAt' && order === 'asc') return 'oldest';
    if (sortBy === 'lexicographical' && order === 'asc') return 'alphabetical';
    if (sortBy === 'lexicographical' && order === 'desc') return 'reverseAlphabetical';
    if (sortBy === 'likes' && order === 'desc') return 'trending';

    return 'newest';
  };

  useEffect(() => {
    if (!category) {
      navigate('/');
    }
  }, [category, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    const sort = params.get('sortBy');
    const order = params.get('order');

    if (page && /^\d+$/.test(page)) {
      setCurrentPage(Number(page));
    } else {
      setCurrentPage(1);
      params.set('page', '1');
      navigate(
        {
          pathname: location.pathname,
          search: params.toString(),
        },
        { replace: true }
      );
    }
    if (sort === 'lexicographical' || sort === 'createdAt' || sort === 'likes') {
      setSorting((prev) => ({
        ...prev,
        sortBy: sort,
      }));
    } else {
      params.set('sortBy', 'createdAt');
      setSorting((prev) => ({
        ...prev,
        sortBy: 'createdAt',
      }));
      navigate(
        {
          pathname: location.pathname,
          search: params.toString(),
        },
        { replace: true }
      );
    }
    if (order === 'asc' || order === 'desc') {
      setSorting((prev) => ({
        ...prev,
        order,
      }));
    } else {
      params.set('order', 'desc');
      setSorting((prev) => ({
        ...prev,
        order: 'desc',
      }));
      navigate(
        {
          pathname: location.pathname,
          search: params.toString(),
        },
        { replace: true }
      );
    }
  }, [location.search, location.pathname, navigate]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categoryImages', category, currentPage, sorting],
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
    staleTime: 1000 * 60 * 4,
    gcTime: 1000 * 60 * 7,
    refetchOnWindowFocus: false,
  });

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

  const renderPaginationItems = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const items = [];
    const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination;
    items.push(
      <PaginationItem key="prev" className="cursor-pointer">
        <PaginationPrevious
          onClick={() => handlePageChange(currentPage - 1)}
          className={!hasPrevPage ? 'pointer-events-none opacity-50' : ''}
        />
      </PaginationItem>
    );
    const createPageItem = (pageNum: number) => (
      <PaginationItem key={pageNum} className="cursor-pointer">
        <PaginationLink
          onClick={() => handlePageChange(pageNum)}
          isActive={currentPage === pageNum}
        >
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
          onClick={() => handlePageChange(currentPage + 1)}
          className={!hasNextPage ? 'pointer-events-none opacity-50' : ''}
        />
      </PaginationItem>
    );

    return items;
  };

  function handleSortChange(option: SortOption) {
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

    const params = new URLSearchParams(location.search);
    params.set('sortBy', newSorting.sortBy);
    params.set('order', newSorting.order);
    params.set('page', '1');

    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
      },
      { replace: true }
    );
  }

  if (isLoading) {
    return (
      <>
        <DynamicCover />
        <div className="mt-96"></div>
        <AllImagesSkeleton activeSort={getSortOption()} onSortChange={handleSortChange} />
      </>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <p className="text-white">No images found for this category.</p>
      </div>
    );
  }

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
      <SortingControls activeSort={getSortOption()} onSortChange={handleSortChange} />
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
