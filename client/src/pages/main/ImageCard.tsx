import { FocusCards } from '@/components/ui/focusCards';

interface Props {
  images: { title: string; url: string; category: string }[];
}
const ImageCard = ({ images }: Props) => {
  console.log(images);
  return <FocusCards cards={images} />;
};

export default ImageCard;
