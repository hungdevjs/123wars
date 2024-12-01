import { Routes, Route, Navigate } from 'react-router-dom';

import Game from '../pages/Game';

const GameRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Game />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default GameRoutes;
