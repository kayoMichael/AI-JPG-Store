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
    src: 'https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    src: 'https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: <div></div>,
  },
  {
    category: 'Cyberpunk',
    title: 'Including Fictional ones',
    src: 'https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: <div></div>,
  },
];

const ImageCarousel = () => {
  const cards = data.map((card, index) => <Card key={card.src} card={card} index={index} />);

  return <HorizontalCarousel items={cards} />;
};

export default ImageCarousel;
