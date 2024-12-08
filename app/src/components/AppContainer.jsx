const AppContainer = ({ children }) => {
  return (
    <div className="flex justify-center bg-black">
      <div className="w-svw max-w-[960px]">{children}</div>
    </div>
  );
};

export default AppContainer;
