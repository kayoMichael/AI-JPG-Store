import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import AppearenceAccount from './AppearenceAccount';
import ProfileAccount from './ProfileAccount';
import SecurityAccount from './SecurityAccount';

const Account = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const validPages = ['profile', 'appearance', 'security'];
  const queryParams = new URLSearchParams(location.search);
  const current = queryParams.get('current');

  useEffect(() => {
    if (!validPages.includes(current ?? '')) {
      queryParams.set('current', 'profile');
      navigate(`?${queryParams.toString()}`, { replace: true });
    }
  }, [location.search]);

  const renderContent = () => {
    switch (current) {
      case 'profile':
        return <ProfileAccount />;
      case 'appearance':
        return <AppearenceAccount />;
      case 'security':
        return <SecurityAccount />;
      default:
        return <div className="p-4">Loading...</div>;
    }
  };

  return <div className="w-full">{renderContent()}</div>;
};

export default Account;
