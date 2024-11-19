import { IconRUBY, IconGOLD, IconArrowLeft, IconArrowRight } from './Icons';
import { formatDate, formatAmount } from '../utils/strings';
import useTransaction from '../hooks/useTransaction';

const currencies = {
  GOLD: <IconGOLD className="w-5 h-5" />,
  RUBY: <IconRUBY className="w-5 h-5" />,
};

const TabTransaction = () => {
  const { transactions, page, limit, totalPages, back, next } = useTransaction();

  const renderedTransactions = transactions.slice(page * limit, (page + 1) * limit);
  const canBack = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <div className="h-full p-4 flex flex-col gap-2">
      <div className="p-2 grid grid-cols-12">
        {/* <div className="hidden xl:block xl:col-span-3">
          <p className="text-left font-medium text-sm md:text-base">ID</p>
        </div> */}
        <div className="col-span-5">
          <p className="text-left font-medium text-sm md:text-base">Date</p>
        </div>
        <div className="col-span-2">
          <p className="text-right font-medium text-sm md:text-base">Amt</p>
        </div>
        <div className="col-span-2">
          <p className="text-right font-medium text-sm md:text-base">Opt</p>
        </div>
        <div className="col-span-3">
          <p className="text-right font-medium text-sm md:text-base">Outcome</p>
        </div>
      </div>
      <div className="grow overflow-auto flex flex-col gap-1">
        {renderedTransactions.map((transaction, index) => (
          <div key={transaction.id} className={`p-2 grid grid-cols-12 rounded ${index % 2 ? 'bg-stone-100' : ''}`}>
            {/* <div className="hidden xl:flex xl:col-span-3 items-center">
              <p className="text-left text-sm md:text-base text-ellipsis overflow-hidden whitespace-nowrap">
                {transaction.id}
              </p>
            </div> */}
            <div className="col-span-5 flex items-center">
              <p className="text-left text-sm md:text-base">{formatDate(transaction.createdAt.toDate())}</p>
            </div>
            <div className="col-span-2 flex items-center justify-end gap-1">
              <p className="text-right text-sm md:text-base font-medium">{formatAmount(transaction.value)}</p>
              {currencies[transaction.currency]}
            </div>
            <div className="col-span-2 flex items-center justify-end">
              <img className="w-[20px]" src={`images/${transaction.option}.png`} alt="option" />
            </div>
            <div className="col-span-3 flex items-center justify-end gap-1">
              <p
                className={`text-right text-sm md:text-base font-medium ${
                  transaction.status === 'win' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {transaction.status === 'win' ? '+' : ''}
                {formatAmount(transaction.outcome)}
              </p>
              {transaction.status === 'win' ? currencies.RUBY : currencies[transaction.currency]}
            </div>
          </div>
        ))}
      </div>
      <div className="pt-2 flex items-center justify-end gap-4">
        <p>
          {page + 1} of {totalPages}
        </p>
        <div className="flex items-center gap-4">
          <button
            className="transition duration-300 active:scale-90 disabled:opacity-50 disabled:cursor-default"
            disabled={!canBack}
            onClick={back}
          >
            <IconArrowLeft className="w-5 h-5" />
          </button>
          <button
            className="transition duration-300 active:scale-90 disabled:opacity-50 disabled:cursor-default"
            disabled={!canNext}
            onClick={next}
          >
            <IconArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabTransaction;
