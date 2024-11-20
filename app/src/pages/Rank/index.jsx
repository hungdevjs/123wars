import { IconETH, IconR } from '../../components/Icons';
import { formatAmount, shortenEmail } from '../../utils/strings';

const leaderboard = [
  { id: 1, rank: 1, email: 'hungdev.js@gmail.com', point: 4455, reward: 0.02 },
  {
    id: 2,
    rank: 2,
    email: 'hungdev.js+1@gmail.com',
    point: 4233,
    reward: 0.015,
  },
  {
    id: 3,
    rank: 3,
    email: 'hungdev.js+2@gmail.com',
    point: 4140,
    reward: 0.01,
  },
  {
    id: 4,
    rank: 4,
    email: 'hungdev.js+3@gmail.com',
    point: 4005,
    reward: 0.008,
  },
  {
    id: 5,
    rank: 5,
    email: 'hungdev.js+4@gmail.com',
    point: 3634,
    reward: 0.006,
  },
  {
    id: 6,
    rank: 6,
    email: 'hungdev.js+5@gmail.com',
    point: 2122,
    reward: 0.004,
  },
];

const ranks = {
  1: '/images/gold-medal.png',
  2: '/images/silver-medal.png',
  3: '/images/bronze-medal.png',
};

const Rank = () => {
  return (
    <div className="h-full px-2 flex flex-col">
      <p className="text-center text-xs italic">
        Leaderboard will be reset everyday at 0h00 UTC
      </p>
      <div className="grid grid-cols-12 p-2">
        <div className="col-span-2 flex items-center">
          <p className="font-semibold">#</p>
        </div>
        <div className="col-span-4 flex items-center">
          <p className="font-semibold text-sm">Email</p>
        </div>
        <div className="col-span-4 flex justify-center items-center gap-0.5">
          <div className="flex items-center">
            <p className="text-sm font-semibold text-indigo-600">$</p>
            <IconR className="w-3 h-3" />
          </div>
          <p className="text-center text-sm font-semibold">point</p>
        </div>
        <div className="col-span-2 flex justify-end items-center">
          <p className="text-sm font-semibold">Reward</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-1">
        {leaderboard.map((user, index) => {
          const rankIcon = ranks[user.rank];
          return (
            <div
              key={user.id}
              className={`grid grid-cols-12 p-2 rounded-lg ${
                index % 2 && 'bg-indigo-50'
              }`}
            >
              <div className="col-span-2 flex items-center">
                <div className="w-4 flex justify-center">
                  {rankIcon ? (
                    <img src={rankIcon} alt="medal" className="w-4 h-4" />
                  ) : (
                    <p className="text-xs font-semibold">{user.rank}</p>
                  )}
                </div>
              </div>
              <div className="col-span-4 flex items-center">
                <p className="text-xs">{shortenEmail(user.email)}</p>
              </div>
              <div className="col-span-4 flex justify-center items-center">
                <p className="text-xs">{user.point.toLocaleString()}</p>
              </div>
              <div className="col-span-2 flex justify-end items-center">
                <p className="text-right text-xs">
                  {formatAmount(user.reward, 5)}
                </p>
                <IconETH className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rank;
