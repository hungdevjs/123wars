const AppContainer = ({ children }) => {
  return (
    <div
      className="flex justify-center bg-black bg-center bg-cover"
      // style={{ backgroundImage: 'url(images/space.png)' }}
    >
      <div className="w-svw max-w-[960px]">{children}</div>
    </div>
  );
};

export default AppContainer;
