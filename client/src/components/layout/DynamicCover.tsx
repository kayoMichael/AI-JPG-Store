import { useMatch, useParams } from 'react-router-dom';

import Image from '../common/Image';

const staticCover = {
  anime: (
    <Image
      src="/cover/anime.jpg"
      alt="Anime"
      priority={true}
      loading="eager"
      className="absolute top-0 left-0 w-full h-3/4 -z-10  min-h-[500px]"
    />
  ),

  baroque: (
    <Image
      src="/cover/baroque.png"
      alt="Baroque"
      priority={true}
      loading="eager"
      className="absolute top-0 left-0 w-full h-3/4 -z-10  min-h-[500px]"
    />
  ),
  root: (
    <div className="absolute top-0 left-0 w-full h-[600px] -z-10 bg-[linear-gradient(180deg,#1e3a4a_0%,#1f3942_25%,rgba(40,60,80,0.7)_50%,rgba(255,255,255,0.2)_90%,#ffffff_100%)]" />
  ),
  photography: (
    <Image
      src="/cover/photography.webp"
      priority={true}
      loading="eager"
      className="absolute top-0 left-0 w-full h-3/4 -z-10  min-h-[500px]"
    />
  ),
  cyberpunk: (
    <Image
      src="/cover/cyberpunk.png"
      priority={true}
      loading="eager"
      className="absolute top-0 left-0 w-full h-3/4 -z-10  min-h-[500px]"
    />
  ),
  contemporary: (
    <Image
      src="/cover/contemporary.webp"
      priority={true}
      loading="eager"
      className="absolute top-0 left-0 w-full h-3/4 -z-10  min-h-[500px]"
    />
  ),
  renaissance: (
    <Image
      src="/cover/renaissance.jpg"
      priority={true}
      loading="eager"
      className="absolute top-0 left-0 w-full h-3/4 -z-10  min-h-[500px]"
    />
  ),
  impressionism: (
    <Image
      src="/cover/impressionism.jpg"
      priority={true}
      loading="eager"
      className="absolute top-0 left-0 w-full h-3/4 -z-10  min-h-[500px]"
    />
  ),
  space: (
    <Image
      src="/cover/space.png"
      priority={true}
      loading="eager"
      className="absolute top-0 left-0 w-full h-3/4 -z-10  min-h-[500px]"
    />
  ),
  all: (
    <div className="absolute top-0 left-0 w-full h-[600px] -z-10 bg-[linear-gradient(180deg,#1e3a4a_0%,#1f3942_25%,rgba(40,60,80,0.7)_50%,rgba(255,255,255,0.2)_90%,#ffffff_100%)]" />
  ),
};

const DynamicCover = () => {
  const isRoot = useMatch('/');
  const isAllImages = useMatch('/images/all');
  const { category } = useParams<{ category: 'anime' | 'baroque' }>();
  return isRoot || isAllImages ? staticCover.root : category ? staticCover[category] : null;
};

export default DynamicCover;
