import SplashScreen from '../components/SplashScreen';
import PublicRoutes from './PublicRoutes';
import MainRoutes from './MainRoutes';
import useWallet from '../hooks/useWallet';
import useSystemStore from '../stores/system.store';
import useUserStore from '../stores/user.store';

const Navigations = () => {
  const { loading } = useWallet();
  const system = useSystemStore((state) => state.system);
  const activeRound = useSystemStore((state) => state.activeRound);
  const user = useUserStore((state) => state.user);
  const initialized = useUserStore((state) => state.initialized);

  const isLoading = loading || !system || !activeRound || !initialized;
  if (isLoading) return <SplashScreen />;

  if (!user) return <PublicRoutes />;

  return <MainRoutes />;
};

export default Navigations;
