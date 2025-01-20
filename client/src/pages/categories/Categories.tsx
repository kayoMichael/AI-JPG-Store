import { useRef, useEffect } from 'react';

import ImageCarousel from './ImageCarousel';

import useCategory from '@/context/CategoryContext';

const Categories = () => {
  const categoryRef = useRef(null);
  const setCategoryRef = useCategory((state) => state.setCategoryRef);

  useEffect(() => {
    setCategoryRef(categoryRef.current);
  }, [setCategoryRef]);
  return (
    <main className="py-8" ref={categoryRef}>
      <h1 className="text-5xl font-bold mb-10">Image Categories</h1>
      <ImageCarousel />
    </main>
  );
};

export default Categories;
