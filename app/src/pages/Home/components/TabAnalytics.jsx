import useSystemStore from '../../../stores/system.store';
import useRound from '../../../hooks/useRound';

const TabAnalytics = () => {
  const { recentWinners } = useRound();
  const winners = useSystemStore((state) => state.winners);

  const totalWinningTimes = winners.rock + winners.paper + winners.scissors;
  const rockWinningPercentage = totalWinningTimes ? winners.rock / totalWinningTimes : 0;
  const paperWinningPercentage = totalWinningTimes ? winners.paper / totalWinningTimes : 0;
  const scissorsWinningPercentage = totalWinningTimes ? winners.scissors / totalWinningTimes : 0;

  const winnerDatas = [
    { icon: 'icons/rock.png', winningTimes: winners.rock, percentage: rockWinningPercentage, color: '#616d77' },
    { icon: 'icons/paper.png', winningTimes: winners.paper, percentage: paperWinningPercentage, color: '#e8ba5c' },
    {
      icon: 'icons/scissors.png',
      winningTimes: winners.scissors,
      percentage: scissorsWinningPercentage,
      color: '#fd5d72',
    },
  ];

  return (
    <div className="h-full p-4 flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <p className="text-white uppercase">winning times</p>
        <div className="flex flex-col gap-1">
          {winnerDatas.map((item) => (
            <div key={item.icon} className="flex items-center gap-2">
              <img src={item.icon} alt={item.icon} className="w-5" />
              <div
                className="h-5 rounded-md overflow-hidden"
                style={{ width: `${item.percentage * 400}px`, background: item.color }}
              />
              <div className="w-20">
                <p className="text-white">{item.winningTimes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-white uppercase">recent winners</p>
        <div className="flex flex-wrap gap-1">
          {recentWinners.map((winner, index) => (
            <div key={index} className="w-5">
              <img src={`icons/${winner}.png`} alt="winner" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabAnalytics;
