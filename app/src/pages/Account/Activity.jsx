import { useEffect } from 'react';

import useActivityStore from '../../stores/activity.store';
import useUserStore from '../../stores/user.store';
import ActivityItem from './components/ActivityItem';

const Activity = () => {
  const activities = useActivityStore((state) => state.activities);
  const fetch = useActivityStore((state) => state.fetch);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user?.id) {
      fetch();
    }
  }, [user?.id]);

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
            <ActivityItem key={activity.id} activity={activity} index={index} />
          );
        })}
      </div>
    </div>
  );
};

export default Activity;
