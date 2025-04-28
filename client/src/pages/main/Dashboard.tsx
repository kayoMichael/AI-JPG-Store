import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import Categories from '../categories/Categories';

import { CarouselCards } from './CarouselCards';
import ImageCard from './ImageCard';

import DashboardSkeleton from '@/components/skeleton/DashboardSkeleton';
import useCategory from '@/context/CategoryContext';

const Dashboard = () => {
  const { categoryRef, setCategoryRef } = useCategory();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const shouldScrollToCategory = searchParams.get('scrollToCategory');

    if (shouldScrollToCategory === 'true' && categoryRef) {
      setTimeout(() => {
        categoryRef.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState({}, '', '/');
        setCategoryRef(null);
      }, 200);
    }
  }, [categoryRef, setCategoryRef]);

  const { data, isLoading } = useQuery({
    queryKey: ['mainImages'],
    queryFn: async () => {
      const response = await Promise.all([
        axios.get('/images/get?limit=32&order=asc').then((res) => res.data),
        axios.get('/images/get?limit=12').then((res) => res.data),
      ]);
      return { featuredImages: response[0].images, regularImages: response[1].images };
    },
    refetchInterval: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="relative">
      <CarouselCards featuredData={data?.featuredImages} />
      <div className="mt-24 flex flex-col gap-8">
        <div className="text-5xl font-semibold">Recently Shared</div>
        <ImageCard images={data?.regularImages} />
        <Link
          to="/images/all"
          className="flex justify-end items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900"
        >
          See More
          <ArrowRight />
        </Link>
        <Categories />
      </div>
    </div>
  );
};

export default Dashboard;
