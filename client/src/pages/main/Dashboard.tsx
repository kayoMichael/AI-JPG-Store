import { CarouselCards } from './CarouselCards';
import ImageCard from './ImageCard';

import SortingControls from '@/components/layout/FeatureButton';

const Dashboard = () => {
  return (
    <div className="relative">
      <CarouselCards />
      <SortingControls onSortChange={() => console.log('hello world')} />
      <ImageCard />
    </div>
  );
};

export default Dashboard;
