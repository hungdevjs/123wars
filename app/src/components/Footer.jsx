import { useLocation, useNavigate } from 'react-router-dom';

import { IconFeed, IconPuzzle, IconRank, IconUser } from './Icons';
import useUserStore from '../stores/user.store';

const navs = [
  { name: 'Feed', path: '/', icon: IconFeed },
  { name: 'Puzzles', path: '/puzzles', icon: IconPuzzle },
  { name: 'Rank', path: '/rank', icon: IconRank },
  { name: 'Account', path: '/account', icon: IconUser },
];

const Footer = () => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path) => path.split('/')[1] === pathname.split('/')[1];

  const renderedNavs = user ? navs : navs.slice(0, 3);

  return (
    <div className="p-2 flex items-center">
      {renderedNavs.map((nav) => (
        <button
          key={nav.name}
          className={`${
            user ? 'w-1/4' : 'w-1/3'
          } p-2 rounded-xl flex flex-col items-center gap-0.5 transition duration-300 ${
            isActive(nav.path) ? 'bg-indigo-100' : ''
          }`}
          onClick={() => navigate(nav.path)}
        >
          <nav.icon className="w-5 h-5" />
          <p className="text-sm md:text-base font-semibold">{nav.name}</p>
        </button>
      ))}
    </div>
  );
};

export default Footer;
