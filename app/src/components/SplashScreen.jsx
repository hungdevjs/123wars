import ConnectWalletButton from './ConnectWalletButton';

const SplashScreen = () => {
  return (
    <div className="w-svw h-svh bg-black flex flex-col items-center justify-center gap-2">
      <div className="flex space-x-2 justify-center items-center">
        <div className="h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-3 w-3 bg-white rounded-full animate-bounce"></div>
      </div>
      <ConnectWalletButton buttonStyle={{ display: 'none' }} />
    </div>
  );
};

export default SplashScreen;
