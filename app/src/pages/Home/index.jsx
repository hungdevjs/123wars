import GameCanvas from '../../components/GameCanvas';

const Home = () => {
  return (
    <div className="flex flex-col justify-center py-4" style={{ height: 'calc(100svh - 123px)' }}>
      <GameCanvas />
    </div>
  );
};

export default Home;
