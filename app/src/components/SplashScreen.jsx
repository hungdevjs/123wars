const SplashScreen = () => {
  return (
    <div className="w-svw h-svh bg-black flex items-center justify-center">
      <div className="flex space-x-2 justify-center items-center">
        <div className="h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-3 w-3 bg-white rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
