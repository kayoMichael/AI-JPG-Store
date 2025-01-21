import { HorizontalCarousel, Card } from '@/components/ui/horizontalCarousel';

const data = [
  {
    category: 'Impressionism',
    title: 'Exploring Impressionism',
    src: 'https://storage.googleapis.com/image-storage-xyz/static/Impression%2CSunRise.jpg',
    content: <div></div>,
  },
  {
    category: 'Anime',
    title: 'Anime is the new black.',
    src: 'https://storage.googleapis.com/image-storage-xyz/static/violet-evergarden.jpg',
    content: <div></div>,
  },
  {
    category: 'Photography',
    title: 'Realistic visuals',
    src: '/category/photography.jpg',
    content: <div></div>,
  },
  {
    category: 'Renaissance',
    title: 'High, Early and Mannerism',
    src: 'https://storage.googleapis.com/image-storage-xyz/static/mona_lisa.jpg',
    content: <div></div>,
  },
  {
    category: 'Baroque',
    title: 'Baroque Art and Architecture',
    src: 'https://storage.googleapis.com/image-storage-xyz/static/baroque.jpg',
    content: <div></div>,
  },
  {
    category: 'Contemporary',
    title: 'Modern Art Drawn by Modern Technology',
    src: 'https://storage.googleapis.com/image-storage-xyz/static/contemporary.jpg',
    content: <div></div>,
  },
  {
    category: 'Space',
    title: 'Down To Earth',
    src: '/category/space.jpg',
    content: <div></div>,
  },
  {
    category: 'Cyberpunk',
    title: 'Including Fictional ones',
    src: '/category/cyberpunk.jpg',
    content: <div></div>,
  },
];

const ImageCarousel = () => {
  const cards = data.map((card, index) => <Card key={card.src} card={card} index={index} />);

  return <HorizontalCarousel items={cards} />;
};

export default ImageCarousel;
