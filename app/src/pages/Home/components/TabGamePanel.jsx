import { useState } from 'react';

import useSystemStore from '../../../stores/system.store';
import useRound from '../../../hooks/useRound';
import useUserStore from '../../../stores/user.store';
import { IconCoin } from '../../../components/Icons';
import BetConfirmation from './BetConfirmation';
import { formatAmount } from '../../../utils/strings';

const TabGamePanel = () => {
  const { recentWinners, roundBets } = useRound();
  const user = useUserStore((state) => state.user);
  const winners = useSystemStore((state) => state.winners);
  const activeRound = useSystemStore((state) => state.activeRound);
  const [option, setOption] = useState(null);
  const [amount, setAmount] = useState(0);
  const [openConfirmation, setOpenConfirmation] = useState(false);

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
    !!user &&
    status === 'open' &&
    ['rock', 'paper', 'scissors'].includes(option) &&
    amount > 0 &&
    !isNaN(Number(amount));

  const totalBetValue = Object.values(roundBets).reduce((sum, value) => sum + value, 0);

  return (
    <div className="h-full py-2 flex flex-col gap-4">
      <p className="text-white">round #{id}</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-white underline">betting</p>
          <div className="flex items-center gap-1">
            <p className="text-white italic">
              maximum returns: {(Math.max(...Object.values(roundBets)) * 4 - totalBetValue).toLocaleString()}
            </p>
            <IconCoin className="w-3 h-3 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="pt-2 flex items-center gap-2">
          {['rock', 'paper', 'scissors'].map((item) => (
            <div
              key={item}
              className={`relative flex-1 p-2 cursor-pointer rounded-lg border ${
                item === option
                  ? 'border-white bg-indigo-500 bg-opacity-50'
                  : roundBets[item] > 0
                  ? 'border-indigo-500'
                  : 'border-slate-500'
              } flex items-center justify-center gap-2`}
              onClick={() => toggleOption(item)}
            >
              <img src={`icons/${item}.png`} alt={item} className="w-8" />
              <div className="flex flex-col">
                <p className="text-white text-xs md:text-sm">{formatAmount(bettings?.[item]?.count || 0, 2)} bets</p>
                <div className="flex items-center gap-1">
                  <p className="text-white text-xs md:text-sm">{(bettings?.[item]?.value || 0).toLocaleString()}</p>
                  <IconCoin className="w-4 h-4" />
                </div>
              </div>
              {roundBets[item] > 0 && (
                <div className="absolute top-0 right-[8px] -translate-y-1/2 py-0.5 px-2 rounded-lg bg-indigo-500 flex items-center gap-1">
                  <p className="text-white font-medium text-[9px]">{roundBets[item].toLocaleString()}</p>
                  <IconCoin className="w-3 h-3" />
                </div>
              )}
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
          onClick={() => setOpenConfirmation(true)}
        >
          {user ? 'bet' : 'sign in to bet'}
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

      <BetConfirmation
        roundId={activeRound.id}
        amount={amount}
        option={option}
        open={openConfirmation}
        close={() => setOpenConfirmation(false)}
      />
    </div>
  );
};

export default TabGamePanel;
