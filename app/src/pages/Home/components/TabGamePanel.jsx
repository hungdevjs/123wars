import { useState } from 'react';

import useSystemStore from '../../../stores/system.store';
import useRound from '../../../hooks/useRound';
import { IconCoin } from '../../../components/Icons';

const TabGamePanel = () => {
  const { recentWinners } = useRound();
  const winners = useSystemStore((state) => state.winners);
  const activeRound = useSystemStore((state) => state.activeRound);
  const [option, setOption] = useState(null);
  const [amount, setAmount] = useState(0);

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

  const { status, id, bettings } = activeRound;

  const formattedAmount = Number(amount).toLocaleString();

  const toggleOption = (item) => setOption(item === option ? null : item);

  const valid =
    status === 'pending' && ['rock', 'paper', 'scissors'].includes(option) && amount > 0 && !isNaN(Number(amount));

  return (
    <div className="h-full py-2 flex flex-col gap-4">
      <p className="text-white">round #{id}</p>
      <div className="flex flex-col gap-2">
        <p className="text-white underline">betting</p>
        <div className="flex items-center gap-2">
          {['rock', 'paper', 'scissors'].map((item) => (
            <div
              key={item}
              className={`flex-1 p-2 cursor-pointer rounded-lg border ${
                item === option ? 'border-white bg-indigo-500 bg-opacity-50' : 'border-slate-500'
              } flex items-center justify-center gap-2`}
              onClick={() => toggleOption(item)}
            >
              <img src={`icons/${item}.png`} alt={item} className="w-8" />
              <div className="flex flex-col">
                <p className="text-white text-xs">{bettings?.[item]?.count || 0} bets</p>
                <div className="flex items-center gap-1">
                  <p className="text-white text-xs">{(bettings?.[item]?.value || 0).toLocaleString()}</p>
                  <IconCoin className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <p className="text-white">amount</p>
          <div className="flex items-center gap-2 border border-slate-500 rounded-lg px-4 py-2">
            <input
              className="flex-1 bg-transparent outline-none border-none text-white"
              placeholder="0.0"
              value={formattedAmount}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '');
                if (!/^\d*\.?\d*$/.test(value)) return;
                setAmount(value);
              }}
            />
            <IconCoin className="w-5 h-5" />
          </div>
        </div>
        <button
          className="w-full transition duration-100 bg-indigo-500 active:bg-indigo-700 disabled:opacity-40 text-white font-medium py-2 px-4 rounded-lg"
          disabled={!valid}
        >
          bet
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-white underline">statistics</p>
        <div className="flex flex-col gap-1">
          <p className="text-white">winning times</p>
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
          <p className="text-white">recent winners</p>
          <div className="flex flex-wrap gap-2">
            {recentWinners.map((winner, index) => (
              <div key={index} className="w-5">
                <img src={`icons/${winner}.png`} alt="winner" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabGamePanel;
