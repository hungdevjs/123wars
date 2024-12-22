import { useState, useEffect, useRef } from 'react';

import useSystemStore from '../../../stores/system.store';

const RoundInfo = () => {
  const activeRound = useSystemStore((state) => state.activeRound);
  const [seconds, setSeconds] = useState('--');
  const interval = useRef();

  const { status, id, startTime, winner } = activeRound;

  const clearCountdown = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }
  };

  const countdown = () => {
    const now = Date.now();
    const diff = startTime.toDate().getTime() - now;

    if (diff < 0) {
      clearCountdown();
      return;
    }

    setSeconds(Math.floor(diff / 1000));
  };

  useEffect(() => {
    clearCountdown();
    if (status === 'pending') {
      interval.current = setInterval(countdown, 1000);
    }
  }, [status, startTime]);

  if (status === 'open') return null;

  if (status === 'pending')
    return (
      <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white bg-opacity-80 rounded-lg w-3/4 p-4 flex flex-col items-center justify-center gap-2">
          <p className="text-center font-medium">Round #{id} starts in</p>
          <p className="text-4xl text-center font-semibold">{seconds || 'starting'}</p>
        </div>
      </div>
    );

  if (status === 'closed')
    return (
      <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white bg-opacity-80 rounded-lg w-3/4 p-4 flex flex-col items-center justify-center gap-2">
          <p className="text-center font-medium">Round #{id} ended</p>
          <p className="text-4xl text-center font-semibold">{winner} won!</p>
        </div>
      </div>
    );
};

export default RoundInfo;
