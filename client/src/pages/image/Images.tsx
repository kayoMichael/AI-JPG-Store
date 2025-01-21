import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import SortingControls from '@/components/layout/FeatureButton';
import { FocusCards } from '@/components/ui/focusCards';
import { capitalize } from '@/utils/capitalise';

const Images = () => {
  const { category } = useParams<{ category: string }>();
  const [uniqueAuthors, setUniqueAuthors] = useState<number>(0);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const navigate = useNavigate();
  useEffect(() => {
    if (!category) {
      navigate('/');
    }
  }, [category, navigate]);
  const { data, isLoading } = useQuery({
    queryKey: ['categoryImages'],
    queryFn: async () => {
      const response = await axios
        .get(`/images/get?limit=25&category=${capitalize(category!)}`)
        .then((res) => res.data);
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
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) {
    return null;
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
                <p>Total volume</p>
                <p className="font-bold">{data.length}</p>
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
      <SortingControls onSortChange={() => {}} />
      <FocusCards cards={data} type="category" />
    </>
  );
};

export default Images;
