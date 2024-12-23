import { IconLoading, IconError, IconSuccess } from './Icons';
import { chain } from '../configs/thirdweb.config';

const TransactionStatus = ({ status }) => {
  if (status.status === 'loading')
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <IconLoading className="animate-spin w-8 h-8" />
        <p className="text-sm italic text-center text-white">Submitting transaction...</p>
      </div>
    );

  if (status.status === 'error')
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <IconError className="w-8 h-8" />
        <p className="text-sm italic text-center text-red-700">{status.value}</p>
      </div>
    );

  if (status.status === 'success')
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <IconSuccess className="w-8 h-8" />
        <p className="text-sm italic text-center text-green-700">{status.value}</p>
        {status.transactionHash && (
          <p
            className="text-xs text-center underline cursor-pointer"
            onClick={() => window.open(`${chain.blockExplorers[0]?.url}/tx/${status.transactionHash}`)}
          >
            View transaction
          </p>
        )}
      </div>
    );

  return null;
};

export default TransactionStatus;
