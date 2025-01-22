import { FocusCards } from '@/components/ui/focusCards';

interface Props {
  images: {
    title: string;
    url: string;
    category: string;
    authorId: { name: string };
    likes: number;
    aiModel: string;
    _id: string;
  }[];
}
const ImageCard = ({ images }: Props) => {
  return <FocusCards cards={images} type="main" />;
};

export default ImageCard;
