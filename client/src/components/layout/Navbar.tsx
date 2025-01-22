import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import Container from '../container/Container';
import NavbarSkeleton from '../skeleton/NavbarSkeleton';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

import Profile from './Profile';

import useCategory from '@/context/CategoryContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const user = useAuth((state) => state.user);
  const navigate = useNavigate();
  const { imageCategory } = useParams();
  const { categoryRef } = useCategory();
  const isHomePage = window.location.pathname === '/';
  const scrollToCategory = () => {
    if (!isHomePage) {
      navigate('/?scrollToCategory=true');
      return;
    }
    categoryRef?.scrollIntoView({ behavior: 'smooth' });
  };

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
        isScrolled || imageCategory ? 'bg-white border-b shadow-sm' : 'bg-transparent'
      }`}
    >
      <Container className="h-16">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center justify-start gap-4">
            <a href="/" className="flex items-center gap-2">
              <Logo className="h-9 w-9" />
              <span
                className={`hidden md:text-lg md:block lg:text-2xl ${isScrolled || imageCategory ? 'text-black' : 'text-white'}`}
              >
                AI Image Store
              </span>
              <Separator
                orientation="vertical"
                className={`h-6 ml-3 hidden md:block ${isScrolled || imageCategory ? 'bg-gray-200' : 'bg-gray-400'}`}
              />
            </a>

            <div className="flex items-center gap-4 md:gap-6 mr-14">
              <Link to={'/images/all'}>
                <Button
                  variant="ghost"
                  className={` ${isScrolled || imageCategory ? 'text-gray-700' : 'text-white hover:bg-gray-400'}`}
                >
                  All Images
                </Button>
              </Link>
              <div className="isolate">
                <Button
                  variant="ghost"
                  onClick={scrollToCategory}
                  className={`${isScrolled || imageCategory ? 'text-gray-700' : 'text-white hover:bg-gray-400'}`}
                >
                  Categories
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Profile user={userData} />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
