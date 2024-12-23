import { useState, useEffect } from 'react';

import { IconClose, IconCoin } from '../../../components/Icons';
import TransactionStatus from '../../../components/TransactionStatus';
import useWar from '../../../hooks/useWar';
import useSystemStore from '../../../stores/system.store';
import { validateTransaction } from '../../../services/user.service';
import { generateBetSignature } from '../../../services/round.service';

const BetConfirmation = ({ open, amount, option, close }) => {
  const activeRound = useSystemStore((state) => state.activeRound);

  const { id: roundId, status: roundStatus } = activeRound;

  const [status, setStatus] = useState({
    status: 'idle',
    value: '',
  });
  const { bet } = useWar();

  const confirm = async () => {
    setStatus({ status: 'loading', value: '' });

    try {
      const res = await generateBetSignature({ value: Number(amount), option });
      const { roundId, time, option: dataOption, value, signature } = res.data;
      const transactionHash = await bet({ roundId, time, option: dataOption, value, signature });
      await validateTransaction({ transactionHash });
      setStatus({
        status: 'success',
        value: 'Bid successful',
        transactionHash,
      });
    } catch (err) {
      console.error(err);
      setStatus({ status: 'error', value: err.message });
    }
  };

  useEffect(() => {
    if (!open) {
      setStatus({ status: 'idle', value: '' });
    }
  }, [open]);

  useEffect(() => {
    close();
  }, [roundId]);

  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 w-svw h-svh bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-black border border-gray-500 rounded-lg p-4 min-w-[320px] max-w-[80%] flex flex-col items-center gap-2">
        {status.status !== 'loading' && (
          <div className="absolute top-[16px] right-[16px] cursor-pointer" onClick={close}>
            <IconClose className="w-5 h-5" />
          </div>
        )}
        <div className="flex items-center justify-center">
          <p className="text-xs font-medium text-white">bet confirmation</p>
        </div>
        <div>
          <p className="font-medium text-center text-white">round #{roundId}</p>
          <div className="flex items-center justify-center gap-1">
            <p className="font-medium text-white">bet for</p>
            <img src={`icons/${option}.png`} alt={option} className="w-5 h-5" />
            <p className="font-medium text-white">{Number(amount).toLocaleString()}</p>
            <IconCoin className="w-5 h-5" />
          </div>
        </div>
        <TransactionStatus status={status} />
        <div className="w-full">
          <button
            type="button"
            className="w-full justify-center rounded-xl bg-indigo-500 px-3 py-2 font-medium text-white transition duration-100 active:scale-95 disabled:opacity-50"
            disabled={['loading', 'success'].includes(status.status) || roundStatus !== 'open'}
            onClick={confirm}
          >
            {status.status === 'loading' ? 'submitting' : `bet`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BetConfirmation;
