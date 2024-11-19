import { useState } from 'react';

import ConnectWalletButton from './ConnectWalletButton';
import { IconETH, IconRUBY, IconSwitch } from './Icons';
import useUser from '../hooks/useUser';
import { formatAmount } from '../utils/strings';

const TabSwap = () => {
  const { user } = useUser();
  const [type, setType] = useState('buy');
  const [amount, setAmount] = useState('');

  const icons =
    type === 'buy'
      ? {
          left: { text: 'ETH', icon: IconETH },
          right: { text: 'RUBY', icon: IconRUBY },
        }
      : {
          left: { text: 'RUBY', icon: IconRUBY },
          right: { text: 'ETH', icon: IconETH },
        };

  const toggle = () => {
    setType(type === 'buy' ? 'sell' : 'buy');
  };

  if (!user) return null;

  return (
    <div className="grow overflow-auto p-4 flex flex-col gap-2">
      <ConnectWalletButton />
      <div className="flex items-center gap-2">
        <div className="w-1/2 p-4 bg-slate-100 rounded">
          <p className="text-slate-600 text-sm">ETH balance</p>
          <div className="flex items-center gap-1">
            <p className="text-4xl font-semibold">{formatAmount(user.ethBalance, 4)}</p>
            <IconETH className="w-10 h-10" />
          </div>
        </div>
        <div className="w-1/2 p-4 bg-slate-100 rounded">
          <p className="text-slate-600 text-sm">RUBY balance</p>
          <div className="flex items-center gap-1">
            <p className="text-4xl font-semibold">{formatAmount(user.tokenBalance, 4)}</p>
            <IconRUBY className="w-10 h-10" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="p-4 bg-slate-100 rounded">
          <p className="">Sell</p>
          <div className="flex items-center">
            <input
              className="w-full bg-transparent outline-none py-4 border-none text-3xl sm:text-4xl"
              placeholder="0.0"
              value={amount}
              onChange={(e) => {
                if (!/^\d*\.?\d*$/.test(e.target.value)) return;
                setAmount(e.target.value);
              }}
            />
            <div className="flex items-center">
              {<icons.left.icon className="w-10 h-10" />}
              <p className="text-2xl sm:text-4xl text-slate-700">{icons.left.text}</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg bg-slate-100 border-4 border-white cursor-pointer transition duration-300 hover:bg-slate-200 active:scale-95 flex items-center justify-center"
            onClick={toggle}
          >
            <IconSwitch className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 bg-slate-100 rounded">
          <p className="">Buy</p>
          <div className="flex items-center">
            <input
              className="w-full bg-transparent outline-none py-4 border-none text-3xl sm:text-4xl"
              placeholder="0.0"
              disabled
            />
            <div className="flex items-center">
              {<icons.right.icon className="w-10 h-10" />}
              <p className="text-2xl sm:text-4xl text-slate-700">{icons.right.text}</p>
            </div>
          </div>
        </div>
      </div>
      <button className="w-full transition duration-300 bg-blue-500 active:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Swap
      </button>
    </div>
  );
};

export default TabSwap;
