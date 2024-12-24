import ConnectWalletButton from '../../components/ConnectWalletButton';
import Game from './components/Game';
import Panel from './components/Panel';

const Home = () => {
  return (
    <div className="h-svh py-2 overflow-y-auto flex flex-col">
      <div className="p-2 flex items-center justify-between">
        {/* <p className="font-medium">Round #{id}</p> */}
        <p className="text-3xl font-semibold text-white">123 wars</p>
        <ConnectWalletButton />
      </div>
      <div className="p-2 grid grid-cols-12 gap-2">
        <div className="col-span-12 lg:col-span-6">
          <Game />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <Panel />
        </div>
      </div>
    </div>
  );
};

export default Home;
