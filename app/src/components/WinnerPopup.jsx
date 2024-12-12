import { useEffect, useState } from 'react';

import useSystemStore from '../stores/system.store';
import useUserStore from '../stores/user.store';
import { IconCoin } from './Icons';
import { checkReward } from '../services/user.service';
import { toast } from 'sonner';

const WinnerPopup = () => {
  const system = useSystemStore((state) => state.system);
  const user = useUserStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { lastWinner } = system || {};

  const receive = async () => {
    setLoading(true);

    try {
      await checkReward();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user && lastWinner && user.id === lastWinner.userId && !lastWinner.checked) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [lastWinner, user]);

  const { amount, roundId } = lastWinner || {};

  return (
    <div
      className={`fixed top-0 left-0 w-svw h-svh p-4 bg-black flex flex-col justify-center items-center transition duration-300 ${
        open ? 'z-50 opacity-1' : '-z-50 opacity-0'
      }`}>
      <p className="text-3xl text-white text-center font-medium uppercase">You won round #{roundId}</p>
      <div className="relative flex items-center justify-center">
        <img src="/images/glow.png" alt="glow" className="w-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <IconCoin className="w-full h-full" />
        </div>
      </div>
      {amount && <p className="text-[50px] text-white text-center font-bold uppercase">{amount.toLocaleString()}</p>}
      <div className="py-8 w-full">
        <button
          type="button"
          className="w-full justify-center rounded-xl bg-white px-3 py-2 font-semibold transition duration-300 active:scale-95 disabled:opacity-50"
          disabled={loading}
          onClick={receive}>
          <p className="uppercase">{loading ? 'receiving' : 'receive'}</p>
        </button>
      </div>
    </div>
  );
};

export default WinnerPopup;
