import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import History from '../pages/History';
import Info from '../pages/Info';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/history" element={<History />} />
      <Route path="/info" element={<Info />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default PublicRoutes;
