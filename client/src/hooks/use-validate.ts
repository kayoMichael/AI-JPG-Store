import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '@/context/AuthContext';

function useValidate() {
  const { setAuth } = useAuth();

  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const res = await axios.get('/auth/check');
      if (res.data.sessionExists === false) {
        setAuth(null);
        return null;
      }
      setAuth(res.data.user);
      return res.data.user;
    },
    refetchInterval: 1000 * 60 * 15,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
  });
}

export default useValidate;
