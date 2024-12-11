import { useEffect, useState } from 'react';

import Layout from '../../components/Layout';
import ConnectWalletButton from '../../components/ConnectWalletButton';
import useUserTransaction from './hooks/useUserTransaction';
import { formatDate, formatAddress, formatAmount } from '../../utils/strings';
import { IconArrowLeft, IconArrowRight } from '../../components/Icons';

const Account = () => {
  const { transactions, page, limit, setPage, setLimit, totalPages } = useUserTransaction();
  const [pageInput, setPageInput] = useState(page + 1);

  const types = {
    bid: 'bid',
    'bid-reward': 'reward',
    refund: 'refund',
  };

  const correction = {
    bid: '-',
    'bid-reward': '+',
    refund: '+',
  };

  const back = () => pageInput && setPageInput(Math.max(pageInput - 1, 1));
  const next = () => pageInput && setPageInput(Math.min(pageInput + 1, totalPages));

  useEffect(() => {
    if (pageInput) setPage(pageInput - 1);
  }, [pageInput]);

  return (
    <Layout title="Account">
      <div className="h-full py-2 flex flex-col gap-2">
        <ConnectWalletButton buttonStyle={{ borderRadius: 12 }} />
        <div className="p-2 flex-1 overflow-y-auto flex flex-col gap-2 border border-gray-300 rounded-xl">
          <p className="text-xs uppercase">my transactions</p>
          <div className="px-2">
            <div className="grid grid-cols-12 gap-1">
              <div className="col-span-1">
                <p className="text-[9px]">#</p>
              </div>
              <div className="col-span-4">
                <p className="text-[9px]">Time</p>
              </div>
              <div className="col-span-2">
                <p className="text-[9px]">Type</p>
              </div>
              <div className="col-span-2">
                <p className={`text-[9px]`}>Amount</p>
              </div>
              <div className="col-span-3">
                <p className="text-[9px] text-right">Hash</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-1">
            {transactions.map((transaction, index) => (
              <div key={transaction.id} className={`p-2 rounded-lg ${index % 2 ? 'bg-orange-100' : 'bg-transparent'}`}>
                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-1">
                    <p className="text-[9px]">#{transaction.roundId}</p>
                  </div>
                  <div className="col-span-4">
                    <p className="text-[9px]">{formatDate(transaction.createdAt.toDate())}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[9px]">{types[transaction.type]}</p>
                  </div>
                  <div className="col-span-2">
                    <p
                      className={`text-[9px] ${
                        correction[transaction.type] === '+' ? 'text-green-500' : 'text-red-500'
                      }`}>
                      {correction[transaction.type]}
                      {transaction.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-[9px] text-right">
                      {formatAddress(transaction.transactionHash.split('-')[0], 5)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            <p className="text-xs">page</p>
            <input
              className="min-w-0 w-10 border rounded-md border-gray-400 outline-none text-center"
              value={pageInput}
              onChange={(e) => {
                const value = e.target.value;
                if (!/^[0-9]*$/.test(value)) return;
                setPageInput(Number(value) || '');
              }}
              onBlur={() => {
                if (pageInput) {
                  setPage(pageInput + 1);
                } else {
                  setPageInput(1);
                }
              }}
            />
            <p className="text-xs">of {totalPages}</p>
          </div>
          <button className="transition duration-300 active:scale-95" onClick={back}>
            <IconArrowLeft className="w-5 h-5" />
          </button>
          <button className="transition duration-300 active:scale-95" onClick={next}>
            <IconArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
