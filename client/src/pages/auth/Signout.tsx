import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Logo from '../../components/common/Logo';
import Spinner from '../../components/common/Spinner';

import { Button } from '@/components/ui/button';

const Signout = () => {
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/logout');
      console.log(res.data);
    } catch {
      navigate('/404');
    } finally {
      setLoading(false);
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-16">
        <Logo className="h-16 w-16 mx-auto" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sorry To See You Go!
        </h2>
      </div>
      <div className="flex justify-center mt-6">
        <Button onClick={handleLogout}>
          {Loading ? (
            <>
              <Spinner className="inline w-5 h-5 mr-2 fill-primary-300" /> Processing...
            </>
          ) : (
            'Sign out'
          )}
        </Button>
      </div>
    </div>
  );
};

export default Signout;
