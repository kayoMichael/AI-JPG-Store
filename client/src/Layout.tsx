import { Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import Container from './components/container/Container';
import DynamicCover from './components/layout/DynamicCover';
import Navbar from './components/layout/Navbar';

export default function Layout() {
  const { category } = useParams();
  return (
    <>
      {category ? (
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[500px] h-3/4">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent h-3/4 min-h-[500px]" />
          <Navbar />
          <DynamicCover />
          <Container>
            <Outlet />
          </Container>
        </div>
      ) : (
        <>
          <Navbar />
          <DynamicCover />
          <Container>
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
}
