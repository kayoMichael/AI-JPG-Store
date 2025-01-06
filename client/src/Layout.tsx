import { Outlet } from 'react-router-dom';

import Container from './components/container/Container';
import Navbar from './components/layout/Navbar';

export default function Layout() {
  return (
    <>
      <Navbar />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
