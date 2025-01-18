import { Outlet } from 'react-router-dom';

import Container from './components/container/Container';
import Navbar from './components/layout/Navbar';

export default function Layout() {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-[600px] -z-10 bg-[linear-gradient(180deg,#1e3a4a_0%,#1f3942_25%,rgba(40,60,80,0.7)_50%,rgba(255,255,255,0.2)_90%,#ffffff_100%)]" />
      <Navbar />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
