import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';

import Layout from './Layout';
import AuthLayout from './components/layout/AuthLayout';
import SettingsLayout from './components/layout/SettingsLayout';
import Account from './pages/account/Account';
import Login from './pages/auth/Login';
import Signout from './pages/auth/Signout';
import SignUp from './pages/auth/Signup';

axios.defaults.baseURL = import.meta.env.VITE_SERVER_HOST;
axios.defaults.withCredentials = true;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthLayout>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<h2></h2>} />
          </Route>
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
        </Routes>
      </AuthLayout>
    </QueryClientProvider>
  );
}

export default App;
