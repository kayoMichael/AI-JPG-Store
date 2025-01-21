import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import Image from '../common/Image';

interface ImageCarouselProps {
  color: string;
}

export function ImageCarousel({ color }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = [...Array(20)].map((_, i) => ({
    src: `/placeholder.svg?height=200&width=200&text=${i + 1}`,
    alt: `AI generated image ${i + 1}`,
  }));

  const imagesPerSlide = 5;
  const totalSlides = Math.ceil(images.length / imagesPerSlide);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isHovered) return;

    const intervalId = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isHovered, nextSlide]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {[...Array(totalSlides)].map((_, slideIndex) => (
          <div key={slideIndex} className="flex-shrink-0 w-full">
            <div className="flex justify-between space-x-4">
              {images
                .slice(slideIndex * imagesPerSlide, (slideIndex + 1) * imagesPerSlide)
                .map((image, imageIndex) => (
                  <div key={imageIndex} className="w-1/5">
                    <Image
                      src={image.src || '/placeholder.svg'}
                      alt={image.alt}
                      width={200}
                      height={200}
                      className={`rounded-lg ${color} object-cover`}
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
