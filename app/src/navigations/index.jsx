import { Routes, Route, Navigate } from 'react-router-dom';

import SplashScreen from '../components/SplashScreen';
import Home from '../pages/Home';
import Subscribe from '../pages/Subscribe';
import Layout from '../components/Layout';
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
        <Route path="/" element={<Subscribe />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default Navigations;
