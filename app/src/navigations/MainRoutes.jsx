import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import History from '../pages/History';
import Info from '../pages/Info';
import Swap from '../pages/Swap';
import Account from '../pages/Account';

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/history" element={<History />} />
      <Route path="/info" element={<Info />} />
      <Route path="/account" element={<Account />} />
      <Route path="/swap" element={<Swap />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default MainRoutes;
