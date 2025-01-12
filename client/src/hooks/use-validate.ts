import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '@/context/AuthContext';

function useValidate() {
  const { setAuth } = useAuth();

  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const res = await axios.get('/auth/check');
      setAuth(res.data.user);
      return res.data.user;
    },
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) {
        return false;
      }
      return failureCount < 3;
    },
    refetchInterval: 1000 * 60 * 15,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
  });
}

export default useValidate;
