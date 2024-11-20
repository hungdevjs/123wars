import { formatDate } from '../../utils/strings';

const activities = [
  {
    id: 1,
    createdAt: 1732067693266,
    content: 'Puzzle solved. Gained 15 R points',
  },
  {
    id: 2,
    createdAt: 1732067593266,
    content: 'Puzzle solved. Gained 5 R points',
  },
  {
    id: 3,
    createdAt: 1732067493266,
    content: 'Reward claimed successfully. Gained 0.002 ETH',
  },
  {
    id: 4,
    createdAt: 1732067393266,
    content: 'Reward claimed failed. 0.2s slower',
  },
  { id: 5, createdAt: 1732067293266, content: 'Account created' },
];

const Activity = () => {
  return (
    <div className="h-full px-2 flex flex-col">
      <div className="grid grid-cols-12 p-2">
        <div className="col-span-4 flex items-center">
          <p className="text-sm font-semibold">Time</p>
        </div>
        <div className="col-span-8 flex items-center">
          <p className="text-sm font-semibold">Activity</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-1">
        {activities.map((activity, index) => {
          return (
            <div
              key={activity.id}
              className={`grid grid-cols-12 p-2 rounded-lg ${
                index % 2 && 'bg-indigo-50'
              }`}
            >
              <div className="col-span-4 flex items-center">
                <p className="text-xs">{formatDate(activity.createdAt)}</p>
              </div>
              <div className="col-span-8 flex items-center">
                <p className="text-xs">{activity.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Activity;
