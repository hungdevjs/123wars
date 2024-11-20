import { useNavigate } from 'react-router-dom';

import { IconArrowRight, IconR, IconRank } from '../../components/Icons';

const navs = [
  { name: 'Account plan', path: '/account/plan' },
  { name: 'Account activities', path: '/account/activities' },
];

const assets = [
  { type: 'free-plan', days: 3 },
  { type: 'free-plan', days: 3 },
  { type: 'free-plan', days: 3 },
];

const Account = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto px-2 flex flex-col gap-2">
      <div className="p-4 rounded-xl bg-indigo-50 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-0.5">
            <div className="flex items-center">
              <p className="text-sm font-semibold text-indigo-600">$</p>
              <IconR className="w-3 h-3" />
            </div>
            <p>point</p>
          </div>

          <p className="text-[10px] italic">
            $R point will be reset everyday at 0h00 UTC
          </p>
        </div>
        <div>
          <p className="font-medium">{(4200).toLocaleString()}</p>
          <div className="flex items-center justify-center gap-1">
            <IconRank className="w-3 h-3" />
            <p className="text-sm font-bold text-green-700">16</p>
          </div>
        </div>
      </div>

      {navs.map((nav) => (
        <button
          key={nav.name}
          className="p-4 rounded-xl bg-indigo-50 flex items-center justify-between"
          onClick={() => navigate(nav.path)}
        >
          <p className="font-medium">{nav.name}</p>
          <IconArrowRight className="w-4 h-4 opacity-70" />
        </button>
      ))}
    </div>
  );
};

export default Account;
