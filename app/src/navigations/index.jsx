import { Routes, Route, Navigate } from 'react-router-dom';

import SplashScreen from '../components/SplashScreen';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import PuzzleRoutes from './PuzzleRoutes';
import RankRoutes from './RankRoutes';
import AccountRoutes from './AccountRoutes';
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';

const Navigations = () => {
  useUser();
  const { loading } = useAuth();

  if (loading) return <SplashScreen />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/puzzles/*" element={<PuzzleRoutes />} />
        <Route path="/rank/*" element={<RankRoutes />} />
        <Route path="/account/*" element={<AccountRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default Navigations;
