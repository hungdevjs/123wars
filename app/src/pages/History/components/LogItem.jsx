import { IconUser } from '../../../components/Icons';
import { formatAddress, formatDate } from '../../../utils/strings';
import { chain } from '../../../configs/thirdweb.config';

const types = {
  bid: 'bid',
  'bid-reward': 'won',
  refund: 'refund',
};
const getText = ({ name, type, amount, roundId }) => {
  if (type === 'bid') return `has bid ${amount.toLocaleString()} PPX in round #${roundId}`;
  if (type === 'bid-reward') return `has won ${amount.toLocaleString()} PPX in round #${roundId}`;
  if (type === 'refund') return `has been refunded ${amount.toLocaleString()} PPX in round #${roundId}`;
  return '';
};

const textColors = {
  bid: 'text-blue-500',
  'bid-reward': 'text-green-500',
  refund: 'text-orange-500',
};

const LogItem = ({ transaction }) => {
  const { userId, address, username, avatar, type, amount, transactionHash, roundId, createdAt } = transaction;

  const Avatar = avatar ? (
    <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full" />
  ) : (
    <IconUser className="w-8 h-8" fill="#000000" />
  );

  const name = username || formatAddress(address, 8);
  const text = getText({ name, type, amount, roundId });

  return (
    <div className={`p-2 flex items-center gap-2 border-b border-b-gray-200`}>
      {Avatar}
      <div className="flex flex-col gap-1">
        <p className="text-xs">{formatDate(createdAt.toDate())}</p>
        <p>{name}</p>
        <p className={`text-[12px] italic ${textColors[type]}`}>{text}</p>
        {transactionHash && (
          <p
            className="text-xs underline cursor-pointer"
            onClick={() => window.open(`${chain.blockExplorers[0]?.url}/tx/${transactionHash}`)}>
            View transaction
          </p>
        )}
      </div>
    </div>
  );
};

export default LogItem;
