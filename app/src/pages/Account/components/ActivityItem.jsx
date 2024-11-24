import { useMemo } from 'react';

import { formatDate } from '../../../utils/strings';
import { IconHello } from '../../../components/Icons';

const icons = {
  'new-account': IconHello,
};

const ActivityItem = ({ activity, index }) => {
  const text = useMemo(() => {
    const { type } = activity;
    if (type === 'new-account') return 'Joined RapidWin';
    return '';
  }, [activity]);

  const Icon = icons[activity.type];

  return (
    <div
      className={`grid grid-cols-12 p-2 rounded-lg ${
        index % 2 && 'bg-indigo-50'
      }`}
    >
      <div className="col-span-4 flex items-center">
        <p className="text-xs">{formatDate(activity.createdAt.toDate())}</p>
      </div>
      <div className="col-span-8 flex items-center gap-1">
        <Icon className="w-5 h-5" />
        <p className="text-xs">{text}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
