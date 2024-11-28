import { useState, useEffect } from 'react';
import moment from 'moment';

import { IconClose } from '../../../components/Icons';
import TransactionStatus from '../../../components/TransactionStatus';
import { validateTransaction } from '../../../services/user.service';
import useSmartContract from '../../../hooks/useSmartContract';
import usePlanStore from '../../../stores/plan.store';

const PlanConfirmModal = ({ plan, close }) => {
  const [status, setStatus] = useState({
    status: 'idle',
    value: '',
  });
  const { subscribe } = useSmartContract();
  const fetch = usePlanStore((state) => state.fetch);

  const confirm = async () => {
    setStatus({ status: 'loading', value: '' });

    try {
      const transactionHash = await subscribe(plan);
      await validateTransaction({ transactionHash });
      await fetch();
      setStatus({ status: 'success', value: 'Subcribed', transactionHash });
    } catch (err) {
      setStatus({ status: 'error', value: err.message });
    }
  };

  useEffect(() => {
    if (!plan) {
      setStatus({ status: 'idle', value: '' });
    }
  }, [plan]);

  if (!plan) return null;

  return (
    <div className="fixed top-0 left-0 w-svw h-svh bg-black bg-opacity-70 flex items-center justify-center">
      <div className="relative bg-white rounded-xl p-4 min-w-[320px] max-w-[80%] flex flex-col items-center gap-2">
        {status.status !== 'loading' && (
          <div
            className="absolute top-[16px] right-[16px] cursor-pointer"
            onClick={close}
          >
            <IconClose className="w-5 h-5" />
          </div>
        )}
        <div>
          <p className="text-xs text-center">Subscribe plan</p>
          <p className="text-xl font-medium text-center text-green-600 uppercase">
            {plan.name}
          </p>
        </div>
        <div>
          <p className="text-xs text-center">Estimated expire time</p>
          <p>{moment().add(plan.days, 'd').format('DD/MM/YYYY HH:mm:ss')}</p>
        </div>
        <div>
          <p className="text-xs text-center text-red-500 italic">
            Your current plan will be overrided
          </p>
        </div>
        {<TransactionStatus status={status} />}
        <div className="w-full">
          <button
            type="button"
            className="w-full justify-center rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition duration-300 active:bg-blue-700 disabled:opacity-60"
            disabled={['loading', 'success'].includes(status.status)}
            onClick={confirm}
          >
            {status.status === 'loading'
              ? 'SUBMITTING'
              : `SUBSCRIBE (${
                  plan.priceInEth ? `${plan.priceInEth} ETH` : 'FREE'
                })`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanConfirmModal;
