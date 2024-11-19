import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import Menu from '../pages/Menu';

const Navigations = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Navigations;
