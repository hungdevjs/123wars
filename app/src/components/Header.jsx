import ConnectWalletButton from './ConnectWalletButton';

const Header = () => {
  return (
    <div className="p-2 flex items-center justify-between">
      <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text">
        RapidWin
      </p>
      <ConnectWalletButton />
    </div>
  );
};

export default Header;
