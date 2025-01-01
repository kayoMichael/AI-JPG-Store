import { Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';

function App() {
  return (
    <Routes>
      <Route index element={<Navbar />} />
      <Route path="/recent" element={<div>Recent</div>} />
    </Routes>
  );
}

export default App;
