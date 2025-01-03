import { useEffect, useState } from 'react';
import { toEther } from 'thirdweb';
import { toast } from 'sonner';

import { IconETH, IconCoin, IconSwitch } from '../../../components/Icons';
import TransactionStatus from '../../../components/TransactionStatus';
import { formatAmount } from '../../../utils/strings';
import useUserStore from '../../../stores/user.store';
import useSwap from '../../../hooks/useSwap';

const TabSwap = () => {
  const user = useUserStore((state) => state.user);
  const {
    setTokenIn,
    setEthIn,
    tokenInputToEthData,
    ethInputToTokenData,
    isLoadingTokenToEth,
    isLoadingEthToToken,
    swapEthToToken,
    swapTokenToEth,
  } = useSwap();
  const [type, setType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState({
    status: 'idle',
    value: '',
  });

  const ethOut = toEther(tokenInputToEthData?.[1] || '0');
  const tokenOut = toEther(ethInputToTokenData?.[1] || '0');
  const loadingOut = type === 'buy' ? isLoadingEthToToken : isLoadingTokenToEth;

  const confirm = async () => {
    setStatus({ status: 'loading', value: '' });

    try {
      const swap = type === 'buy' ? swapEthToToken : swapTokenToEth;
      const transactionHash = await swap();
      toast.success('swap successful');
      setAmount(0);
      setStatus({
        status: 'success',
        value: 'Swap successful',
        transactionHash,
      });
    } catch (err) {
      console.error(err);
      setStatus({ status: 'error', value: err.message });
    }
  };

  const icons =
    type === 'buy'
      ? {
          left: { text: 'ETH', icon: IconETH },
          right: { text: 'Pitcoin', icon: IconCoin },
        }
      : {
          left: { text: 'Pitcoin', icon: IconCoin },
          right: { text: 'ETH', icon: IconETH },
        };

  const toggle = () => {
    setType(type === 'buy' ? 'sell' : 'buy');
    setAmount(0);
  };

  const valid = !!user;

  useEffect(() => {
    const fn = type === 'buy' ? setEthIn : setTokenIn;
    const value = Number(amount);
    fn(value || 0);
  }, [amount]);

  return (
    <div className="overflow-auto py-2 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="w-1/2 p-2 rounded-lg border border-slate-500">
          <p className="text-white text-sm">ETH balance</p>
          <div className="flex items-center gap-1">
            <p className="font-semibold text-white">{formatAmount(0, 4)}</p>
            <IconETH className="w-5 h-5" />
          </div>
        </div>
        <div className="w-1/2 p-2 rounded-lg border border-slate-500">
          <p className="text-white text-sm">Pitcoin balance</p>
          <div className="flex items-center gap-1">
            <p className="font-semibold text-white">{formatAmount(0, 4)}</p>
            <IconCoin className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="p-2 rounded-lg border border-slate-500">
          <p className="text-white">sell</p>
          <div className="flex items-center">
            <input
              className="flex-1 bg-transparent outline-none py-2 border-none text-white"
              placeholder="0.0"
              value={amount}
              onChange={(e) => {
                if (!/^\d*\.?\d*$/.test(e.target.value)) return;
                setAmount(e.target.value);
              }}
              disabled={status.status === 'loading'}
            />
            <div className="flex items-center gap-1">
              {<icons.left.icon className="w-5 h-5" />}
              <p className="text-white">{icons.left.text}</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-lg bg-black border border-slate-500 cursor-pointer transition duration-100 active:scale-95 flex items-center justify-center"
            onClick={toggle}
          >
            <IconSwitch className="w-4 h-4" />
          </button>
        </div>
        <div className="p-2 rounded-lg border border-slate-500">
          <p className="text-white">buy</p>
          <div className="flex items-center">
            <input
              className="flex-1 bg-transparent outline-none py-2 border-none text-white"
              placeholder="0.0"
              value={loadingOut ? 'loading...' : type === 'buy' ? tokenOut : ethOut}
              disabled
            />
            <div className="flex items-center gap-1">
              {<icons.right.icon className="w-5 h-5" />}
              <p className="text-white">{icons.right.text}</p>
            </div>
          </div>
        </div>
      </div>
      <button
        className="w-full transition duration-100 bg-indigo-500 active:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-40"
        disabled={!valid || loadingOut || status.status === 'loading'}
        onClick={confirm}
      >
        {status.status === 'loading' ? 'submitting' : user ? 'swap' : 'sign in to swap'}
      </button>
      <div className="py-2">
        <TransactionStatus status={status} />
      </div>
    </div>
  );
};

export default TabSwap;
