import axios from 'axios';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from './Layout';
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Signout from './pages/auth/Signout';
import SignUp from './pages/auth/Signup';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  const { setAuth } = useAuth();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth/check');
        setAuth(response.data.user);
      } catch {}
    };

    checkAuth();
  }, [setAuth]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<h2></h2>} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signout" element={<Signout />} />
      </Routes>
    </>
  );
}

export default App;
