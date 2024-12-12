import Layout from '../../components/Layout';
import useSystemStore from '../../stores/system.store';

const Info = () => {
  const system = useSystemStore((state) => state.system);

  const { bidStep, timeStep, minRoundDuration, nextRoundPrizePercent } = system;

  return (
    <Layout title="Info">
      <div className="flex flex-col gap-2">
        <p className="text-lg text-center uppercase">how to play?</p>
        <div className="flex flex-col gap-2">
          <p>
            <span className="font-semibold">AuctionX</span> is a super simple game.
          </p>
          <p>
            A round starts with a reward amount and{' '}
            <span className="italic font-medium">{Math.round(minRoundDuration / (60 * 60))} hours</span> of playing
            time.
          </p>
          <p>Players bid on the reward, the highest bidder before time runs out receives the reward.</p>
        </div>
        <hr />
        <p className="text-lg text-center uppercase">game variables</p>
        <div className="flex flex-col gap-2">
          <p>
            Every time a player bids, the playing time increases by{' '}
            <span className="italic font-medium">{Math.round(timeStep / 60)} minutes</span>.
          </p>
          <p>
            A new bid needs to be at least{' '}
            <span className="italic font-medium">{bidStep.toLocaleString()} PPX tokens</span> more than the current
            highest bid.
          </p>
          <p>
            The <span className="italic font-medium">2nd position</span> loses all the token they bid, while the{' '}
            <span className="italic font-medium">3rd position and below</span> receive{' '}
            <span className="italic font-medium">{(1 - nextRoundPrizePercent) * 100}%</span> of their token back.
          </p>
          <p>
            Every bid sends <span className="italic font-medium">{nextRoundPrizePercent * 100}%</span> of its to next
            round reward.
          </p>
        </div>
        <hr />
        <p className="text-lg text-center uppercase">read more</p>
        <div className="flex flex-col gap-2">
          <p>
            <span className="font-semibold">AuctionX</span> is a fully on-chain game on{' '}
            <a target="_blank" href="https://www.base.org/" className="underline italic">
              Base
            </a>
            .
          </p>
          <p>
            Inspired by{' '}
            <a
              target="_blank"
              href="https://en.wikipedia.org/wiki/Dollar_auction"
              className="underline italic cursor-pointer">
              Dollar Auction game theory
            </a>
            .
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Info;
