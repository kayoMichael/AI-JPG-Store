import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Layout from './Layout';
import AuthLayout from './components/layout/AuthLayout';
import SettingsLayout from './components/layout/SettingsLayout';
import Account from './pages/account/Account';
import AllImages from './pages/all-images/AllImages';
import AccountCreated from './pages/auth/AccountCreated';
import Login from './pages/auth/Login';
import Signout from './pages/auth/Signout';
import SignUp from './pages/auth/Signup';
import PersonalImages from './pages/collection/PersonalImage';
import CreateImage from './pages/create/CreateImage';
import ImageDetail from './pages/detail/ImageDetail';
import Error from './pages/error/Error';
import Images from './pages/image/Images';
import Dashboard from './pages/main/Dashboard';

axios.defaults.baseURL = import.meta.env.VITE_SERVER_HOST;
axios.defaults.withCredentials = true;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthLayout>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/images/:category" element={<Images />} />
            <Route path="/images/all" element={<AllImages />} />
            <Route path="/images/:imageCategory/:imageId" element={<ImageDetail />} />
            <Route path="/images/:userId/collection" element={<PersonalImages />} />
          </Route>
          <Route path="/create" element={<CreateImage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup/success" element={<AccountCreated />} />
          <Route path="/signout" element={<Signout />} />
          <Route
            path="/account"
            element={
              <SettingsLayout>
                <Account />
              </SettingsLayout>
            }
          />
          <Route path="/error" element={<Error />} />
        </Routes>
      </AuthLayout>
    </QueryClientProvider>
  );
}

export default App;
