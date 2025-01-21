import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo, useEffect } from 'react';

import Categories from '../categories/Categories';

import { CarouselCards } from './CarouselCards';
import ImageCard from './ImageCard';

import useCategory from '@/context/CategoryContext';

const Dashboard = () => {
  const { categoryRef, setCategoryRef } = useCategory();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const shouldScrollToCategory = searchParams.get('scrollToCategory');

    if (shouldScrollToCategory === 'true' && categoryRef) {
      categoryRef.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState({}, '', '/');
      setCategoryRef(null);
    }
  }, [categoryRef, setCategoryRef]);

  const { data, isLoading } = useQuery({
    queryKey: ['mainImages'],
    queryFn: async () => {
      const response = await axios.get('/images/get?limit=36').then((res) => res.data);
      return response.images;
    },
    refetchInterval: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });
  const { featuredImages, regularImages } = useMemo(() => {
    if (!data) return { featuredImages: [], regularImages: [] };

    return {
      featuredImages: data.slice(0, 12),
      regularImages: data.slice(12, 24),
    };
  }, [data]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="relative">
      <CarouselCards featuredData={featuredImages} />
      <div className="mt-24 flex flex-col gap-8">
        <div className="text-5xl font-semibold">Recently Shared</div>
        <ImageCard images={regularImages} />
        <Categories />
      </div>
    </div>
  );
};

export default Dashboard;
