import { Routes, Route, Navigate } from 'react-router-dom';

import Rank from '../pages/Rank';

const RankRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Rank />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default RankRoutes;
