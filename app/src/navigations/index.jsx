import { Routes, Route, Navigate } from "react-router-dom";

import SplashScreen from "../components/SplashScreen";
import Home from "../pages/Home";
import History from "../pages/History";
import Info from "../pages/Info";
import Swap from "../pages/Swap";
import Account from "../pages/Account";
import useWallet from "../hooks/useWallet";
import useSystemStore from "../stores/system.store";

const Navigations = () => {
  const { loading } = useWallet();
  const system = useSystemStore((state) => state.system);
  const activeRound = useSystemStore((state) => state.activeRound);

  const isLoading = loading || !system || !activeRound;
  if (isLoading) return <SplashScreen />;

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

export default Navigations;
