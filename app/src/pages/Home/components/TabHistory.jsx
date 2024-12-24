import { useState, useEffect } from 'react';

import { IconCoin, IconArrowLeft, IconArrowRight } from '../../../components/Icons';
import useUserTransaction from '../../../hooks/useUserTransaction';
import useUserStore from '../../../stores/user.store';
import { formatDate, formatAddress } from '../../../utils/strings';
import { chain } from '../../../configs/thirdweb.config';

const TabHistory = () => {
  const user = useUserStore((state) => state.user);
  const { transactions, page, setPage, totalPages } = useUserTransaction();

  const [pageInput, setPageInput] = useState(page + 1);

  const correction = {
    bet: '-',
    'bet-reward': '+',
  };

  const back = () => pageInput && setPageInput(Math.max(pageInput - 1, 1));
  const next = () => pageInput && setPageInput(Math.min(pageInput + 1, totalPages));

  useEffect(() => {
    if (pageInput) setPage(pageInput - 1);
  }, [pageInput]);

  if (!user)
    return (
      <div className="h-full py-2 flex justify-center items-center">
        <p className="text-white">sign in to view your bets</p>
      </div>
    );

  return (
    <div className="h-full py-2 flex flex-col gap-2">
      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        <div className="px-2">
          <div className="grid grid-cols-12 gap-1">
            <div className="col-span-1">
              <p className="text-[9px] sm:text-base text-white">#</p>
            </div>
            <div className="col-span-3">
              <p className="text-[9px] sm:text-base text-white">time</p>
            </div>
            <div className="col-span-3">
              <p className="text-[9px] sm:text-base text-white">type</p>
            </div>
            <div className="col-span-2">
              <p className={`text-[9px] sm:text-base text-white`}>amount</p>
            </div>
            <div className="col-span-3">
              <p className="text-[9px] sm:text-base text-right text-white">hash</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-1">
          {transactions.map((transaction, index) => (
            <div key={transaction.id} className={`p-2 rounded-lg ${index % 2 ? 'bg-indigo-800' : 'bg-transparent'}`}>
              <div className="grid grid-cols-12 gap-1">
                <div className="col-span-1">
                  <p className="text-[9px] sm:text-base text-white">#{transaction.roundId}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-[9px] sm:text-base text-white">{formatDate(transaction.createdAt.toDate())}</p>
                </div>
                <div className="col-span-3 flex items-center gap-1">
                  <p className="text-[9px] sm:text-base text-white">{transaction.type}</p>
                  <img
                    src={`icons/${transaction.option}.png`}
                    alt={transaction.option}
                    className="w-3 h-3 md:w-5 md:h-5"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-1">
                  <p
                    className={`text-[9px] sm:text-base ${
                      correction[transaction.type] === '+' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {correction[transaction.type]}
                    {transaction.value.toLocaleString()}
                  </p>
                  <IconCoin className="w-3 h-3 md:w-5 md:h-5" />
                </div>
                <div className="col-span-3">
                  {transaction.status === 'success' || transaction.transactionHash ? (
                    <p
                      className="text-[9px] sm:text-base text-white text-right underline cursor-pointer"
                      onClick={() => window.open(`${chain.blockExplorers[0]?.url}/tx/${transaction.transactionHash}`)}
                    >
                      {formatAddress(transaction.transactionHash.split('-')[0], 5)}
                    </p>
                  ) : (
                    <p className="text-[9px] sm:text-base text-white text-right">{transaction.status}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-base text-white">page</p>
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
          <p className="text-xs sm:text-base text-white">of {totalPages}</p>
        </div>
        <button className="transition duration-300 active:scale-95" onClick={back}>
          <IconArrowLeft className="w-5 h-5" />
        </button>
        <button className="transition duration-300 active:scale-95" onClick={next}>
          <IconArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TabHistory;
