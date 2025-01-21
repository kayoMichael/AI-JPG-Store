import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';

import Layout from './Layout';
import AuthLayout from './components/layout/AuthLayout';
import SettingsLayout from './components/layout/SettingsLayout';
import Account from './pages/account/Account';
import AllImages from './pages/all-images/AllImages';
import Login from './pages/auth/Login';
import Signout from './pages/auth/Signout';
import SignUp from './pages/auth/Signup';
import CreateImage from './pages/create/CreateImage';
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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthLayout>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/images/:category" element={<Images />} />
            <Route path="/images/all" element={<AllImages />} />
          </Route>
          <Route path="/create" element={<CreateImage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
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
