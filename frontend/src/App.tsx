import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Waiting from './pages/Waiting';
import Arena from './pages/Arena';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/waiting/:code" element={<Waiting />} />
      <Route path="/arena" element={<Arena />} />
    </Routes>
  );
}

export default App;
