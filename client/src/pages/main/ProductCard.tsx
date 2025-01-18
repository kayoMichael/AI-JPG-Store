import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/merge';

interface ProductCardProps {
  title: string;

  price: string;

  image: string;

  className?: string;
}

const ProductCard = ({ title, price, image, className }: ProductCardProps) => {
  return (
    <Card className={cn('overflow-hidden group cursor-pointer', className)}>
      <CardContent className="p-0">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>

          <p className="text-primary font-bold">{price}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
