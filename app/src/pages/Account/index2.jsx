import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import {
  IconArrowRight,
  IconR,
  IconRank,
  IconCheck,
  IconLoading,
} from '../../components/Icons';
import usePointStore from '../../stores/point.store';
import useUserStore from '../../stores/user.store';
import { validatePhoneNumber } from '../../services/user.service';

const navs = [
  { name: 'Account plan', path: '/account/plan' },
  { name: 'Account activities', path: '/account/activities' },
];

const Account = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const point = usePointStore((state) => state.point);
  const rank = usePointStore((state) => state.rank);
  const fetch = usePointStore((state) => state.fetch);
  const [loading, setLoading] = useState(false);

  const verifyPhone = async () => {
    setLoading(true);
    try {
      const res = await validatePhoneNumber();
      setUser({ ...user, phone: res.data });
      toast.success('Verified phone number');
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) {
      fetch();
    }
  }, [user?.id]);

  if (!user) return null;

  return (
    <div className="h-full overflow-y-auto px-2 flex flex-col gap-2">
      <div className="p-4 rounded-xl bg-indigo-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={user.avatar}
            alt="avatar"
            className="block rounded-full w-12 h-12"
          />
          <div>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs italic">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-indigo-50 flex items-center justify-between">
        <div className="w-full flex items-center justify-between gap-2">
          <div>
            <p>Phone verification</p>
            {!user.phone && (
              <>
                <p className="text-[9px] italic text-red-500">
                  Link your phone number to start claim rewards
                </p>
                <p className="text-[9px] italic text-red-500">
                  Open wallet popup, link phone number and click Verify
                </p>
              </>
            )}
          </div>
          {user.phone ? (
            <IconCheck className="w-5 h-5" />
          ) : (
            <button
              type="button"
              disabled={loading}
              className="justify-center rounded-lg bg-blue-500 p-1 w-14 h-6 flex justify-center text-xs text-white transition duration-300 active:bg-blue-700 disabled:opacity-60"
              onClick={verifyPhone}
            >
              {loading ? (
                <IconLoading className="animate-spin w-4 h-4" />
              ) : (
                'Verify'
              )}
            </button>
          )}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-indigo-50 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-0.5">
            <div className="flex items-center">
              <p className="text-sm font-semibold text-indigo-600">$</p>
              <IconR className="w-3 h-3" />
            </div>
            <p>point</p>
          </div>

          <p className="text-[9px] italic">
            $R point will be reset everyday at 0h00 UTC
          </p>
        </div>
        <div>
          <p className="font-medium">{point.toLocaleString()}</p>
          <div className="flex items-center justify-center gap-1">
            <IconRank className="w-3 h-3" />
            <p className="text-sm font-bold text-green-700">
              {typeof rank === 'number' ? rank.toLocaleString() : rank}
            </p>
          </div>
        </div>
      </div>

      {navs.map((nav) => (
        <button
          key={nav.name}
          className="p-4 rounded-xl bg-indigo-50 flex items-center justify-between"
          onClick={() => navigate(nav.path)}
        >
          <p>{nav.name}</p>
          <IconArrowRight className="w-4 h-4 opacity-70" />
        </button>
      ))}
    </div>
  );
};

export default Account;
