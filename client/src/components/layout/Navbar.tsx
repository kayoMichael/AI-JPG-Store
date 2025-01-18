import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import Container from '../container/Container';
import NavbarSkeleton from '../skeleton/NavbarSkeleton';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';

import Profile from './Profile';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const user = useAuth((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const {
    data: userData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['navbarUser', user?.id],
    queryFn: async () => {
      const response = await axios.get(`/user/get/${user!.id}`).then((res) => res.data._doc);
      return response;
    },
    enabled: !!user,
    refetchInterval: 1000 * 60 * 30,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (error) {
      navigate('/error');
    }
  });

  if (isLoading) {
    return <NavbarSkeleton />;
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white border-b shadow-sm' : 'bg-transparent'
      }`}
    >
      <Container className="h-16">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center justify-start gap-4">
            <a href="/" className="flex items-center gap-2">
              <Logo className="h-9 w-9" />
              <span
                className={`text-sm md:text-lg lg:text-2xl ${isScrolled ? 'text-black' : 'text-white'}`}
              >
                JPG Store
              </span>
              <Separator
                orientation="vertical"
                className={`h-6 ${isScrolled ? 'bg-gray-200' : 'bg-gray-400'}`}
              />
            </a>

            <div className="flex items-center gap-4 md:gap-6 mr-16">
              <Link to={'/categories'}>
                <Button
                  variant="ghost"
                  className={`hover:text-gray-200 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
                >
                  Favourites
                </Button>
              </Link>
              <Button variant="ghost" className={` ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                Trending
              </Button>
              <div className="isolate">
                <Link to={'/create'}>
                  <Button
                    variant="ghost"
                    className={`hover:text-gray-200 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
                  >
                    Create
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`md:block absolute left-2 top-1/2 transform -translate-y-1/2 size-5 hidden ${
                  isScrolled ? 'text-gray-400' : 'text-muted-foreground'
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <Input
                type="search"
                placeholder="Search..."
                className={`pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary border-2 w-full hidden lg:inline-flex ${
                  isScrolled
                    ? 'bg-gray-50 text-gray-700 border-gray-200'
                    : 'bg-muted text-muted-foreground'
                }`}
              />
            </div>
            <Profile user={userData} />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
