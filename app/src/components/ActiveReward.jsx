import { useState } from 'react';

import useSystemStore from '../stores/system.store';

const ActiveReward = () => {
  const activeReward = useSystemStore((state) => state.activeReward);
  const [loading, setLoading] = useState(false);

  if (!activeReward) return null;

  const { amount, type, winners } = activeReward;

  const claimed = !!winners.length;

  const claim = async () => {};

  return (
    <div className="fixed top-0 left-0 w-svw h-svh z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="relative bg-white rounded-xl p-4 min-w-[320px] max-w-[80%] flex flex-col items-center gap-2">
        <p className="font-medium text-center uppercase">Airdrop reward</p>
        <div className="flex items-center justify-center gap-2">
          <p className="text-2xl text-excited text-indigo-900">
            {amount} {type}
          </p>
        </div>
        <div></div>
        <button
          type="button"
          className="w-full justify-center rounded-lg bg-blue-500 px-3 py-2 font-semibold text-white transition duration-300 active:bg-blue-700 disabled:opacity-60"
          disabled={loading || claimed}
          onClick={claim}
        >
          Claim
        </button>
      </div>
    </div>
  );
};

export default ActiveReward;
