import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react'; // Note: we don't need useState anymore
import { useLocation, useNavigate } from 'react-router-dom';

import AppearenceAccount from './AppearenceAccount';
import Loading from './Loading';
import ProfileAccount from './ProfileAccount';
import SecurityAccount from './SecurityAccount';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Account = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const current = queryParams.get('current');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user]);

  useEffect(() => {
    if (!['profile', 'appearance', 'security'].includes(current ?? '')) {
      queryParams.set('current', 'profile');
      navigate(`?${queryParams.toString()}`, { replace: true });
    }
  }, [location.search]);

  const {
    data: userData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['userData', user?.id],
    queryFn: async () => {
      const response = await axios.get(`/user/get/${user!.id}`).then((res) => res.data._doc);
      return {
        profile: {
          username: response.name,
          email: response.email,
          bio: response.bio,
          urls: response.urls,
        },
        appearence: {
          profileImage: response.profileImage,
        },
      };
    },
    enabled: !!user,
  });

  const renderContent = () => {
    if (!userData) return null;

    switch (current) {
      case 'profile':
        return <ProfileAccount userId={user!.id} defaultValues={userData.profile} />;
      case 'appearance':
        return <AppearenceAccount />;
      case 'security':
        return <SecurityAccount />;
      default:
        return null;
    }
  };

  if (isLoading) return <Loading />;
  if (error) {
    toast({
      title: 'Something Went Wrong...',
      description: error.message,
    });
    return null;
  }

  return <div className="w-full">{renderContent()}</div>;
};

export default Account;
