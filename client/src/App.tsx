import axios from 'axios';
import { Route, Routes } from 'react-router-dom';

import Layout from './Layout';
import Login from './pages/Login';
import SignUp from './pages/Signup';

axios.defaults.baseURL = 'http://localhost:8000';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<h2></h2>} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
