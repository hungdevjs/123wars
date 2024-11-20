import { useLocation, useNavigate } from 'react-router-dom';

import ConnectWalletButton from './ConnectWalletButton';
import { IconArrowLeft } from './Icons';

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const steps = pathname.split('/');
  const canBack = steps.length >= 3;
  const backPath = steps.slice(0, steps.length - 1).join('/');

  return (
    <div className="p-2 flex items-center justify-between">
      {canBack ? (
        <IconArrowLeft
          className="w-5 h-5 cursor-pointer"
          onClick={() => navigate(backPath)}
        />
      ) : (
        <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text">
          RapidWin
        </p>
      )}
      <ConnectWalletButton />
    </div>
  );
};

export default Header;
