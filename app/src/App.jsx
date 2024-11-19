import SplashScreen from './components/SplashScreen';
import Navigations from './navigations';
import Layout from './components/Layout';
import useAuth from './hooks/useAuth';

const App = () => {
  const { loading } = useAuth();

  if (loading) return <SplashScreen />;

  return (
    <Layout>
      <Navigations />
    </Layout>
  );
};

export default App;
