import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import AppearenceAccount from './AppearenceAccount';
import Loading from './Loading';
import ProfileAccount from './ProfileAccount';
import SecurityAccount from './SecurityAccount';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Account = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const current = searchParams.get('current');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const validTabs = ['profile', 'appearance', 'security'];
    if (!validTabs.includes(current ?? '')) {
      setSearchParams({ current: 'profile' });
    }
  }, [current, setSearchParams]);

  const {
    data: userData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      const response = await axios.get(`/user/get/${user!.id}`).then((res) => res.data._doc);
      return {
        profile: {
          username: response.name,
          email: response.email,
          bio: response.bio,
          urls: response.urls,
        },
        profileImage: response.profileImage || 'https://github.com/shadcn.png',
      };
    },
    enabled: !!user,
    refetchInterval: 1000 * 60 * 30,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Something Went Wrong...',
        variant: 'destructive',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      navigate('/');
    }
  }, [error, toast, navigate]);

  const renderContent = () => {
    if (!userData) return null;

    switch (current) {
      case 'profile':
        return <ProfileAccount userId={user!.id} defaultValues={userData.profile} />;
      case 'appearance':
        return <AppearenceAccount userId={user!.id} profileImage={userData.profileImage} />;
      case 'security':
        return <SecurityAccount />;
      default:
        return null;
    }
  };

  if (isLoading) return <Loading />;

  return <div className="w-full">{renderContent()}</div>;
};

export default Account;
