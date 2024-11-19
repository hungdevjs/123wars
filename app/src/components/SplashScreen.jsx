const SplashScreen = () => {
  return (
    <div className="w-svw h-svh bg-[url('images/background.webp')] bg-cover bg-center">
      <div className="w-full h-full relative">
        <div className="absolute top-[80%] py-4 bg-black bg-opacity-60  w-full flex flex-col items-center justify-center gap-4">
          <p className="text-3xl text-white font-semibold">Loading</p>
          <div className="flex space-x-2 justify-center items-center">
            <div className="h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-3 w-3 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
