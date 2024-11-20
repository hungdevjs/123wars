import { Routes, Route, Navigate } from 'react-router-dom';

import Puzzle from '../pages/Puzzle';

const PuzzleRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Puzzle />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default PuzzleRoutes;
