import { Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<h2></h2>} />
        <Route path="/recent" element={<div>Recent</div>} />
      </Routes>
    </>
  );
}

export default App;
