import { useState } from 'react';

import ConnectWalletButton from '../../../components/ConnectWalletButton';
import { IconETH, IconRUBY, IconGOLD, IconEdit } from '../../../components/Icons';
import useUserStore from '../../../stores/user.store';
import { formatAmount } from '../../../utils/strings';

const TabAccount = () => {
  const user = useUserStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="grow overflow-auto p-4 flex flex-col gap-2">
      <div className="flex flex-col items-center gap-1">
        <div className="w-20 h-20 sm:w-40 sm:h-40 rounded-full flex items-center justify-center overflow-hidden relative">
          <img src={user.avatar} alt="avatar" className="block" />
          <div className="absolute bottom-0 w-full h-10 bg-slate-300 flex items-center justify-center cursor-pointer transition duration-300 opacity-20 hover:opacity-40">
            <p className="font-bold">Edit</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-2xl sm:text-3xl font-bold">{user.username}</p>
        </div>
      </div>
      <ConnectWalletButton />
      <div className="p-4 bg-slate-100 rounded">
        <p className="text-slate-600 text-sm">ETH balance</p>
        <div className="flex items-center gap-1">
          <p className="text-2xl sm:text-4xl font-semibold">{formatAmount(user.ethBalance, 4)}</p>
          <IconETH className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
      </div>
      <div className="p-4 bg-slate-100 rounded">
        <p className="text-slate-600 text-sm">RUBY balance</p>
        <div className="flex items-center gap-1">
          <p className="text-2xl sm:text-4xl font-semibold">{formatAmount(user.tokenBalance, 4)}</p>
          <IconRUBY className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
      </div>

      <div className="p-4 bg-slate-100 rounded">
        <p className="text-slate-600 text-sm">GOLD balance</p>
        <div className="flex items-center gap-1">
          <p className="text-2xl sm:text-4xl font-semibold">{formatAmount(user.xTokenBalance, 4)}</p>
          <IconGOLD className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
      </div>
      <div className="p-4 bg-slate-100 rounded">
        <p className="text-slate-600 text-sm">Matches played</p>
        <div className="flex items-center gap-1">
          <p className="text-2xl sm:text-4xl font-semibold">{user.matchesPlayed}</p>
        </div>
      </div>
      <div className="p-4 bg-slate-100 rounded">
        <p className="text-slate-600 text-sm">Profit estimation</p>
        <div className="flex items-center gap-1">
          <p className="text-2xl sm:text-4xl font-semibold">{user.profitEstimation}</p>
          <IconETH className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
      </div>
    </div>
  );
};

export default TabAccount;
