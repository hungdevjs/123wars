import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const navs = [
  { name: 'Arena', path: '/' },
  { name: 'Account', path: '/menu' },
];

const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  return (
    <div className="h-[67px] p-2 flex items-center justify-between border-b border-slate-400">
      <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text">
        TriStrike
      </p>
      <div className="relative flex flex-col justify-center items-center">
        <button className="group h-10 w-10" onClick={toggle}>
          <div className="grid justify-items-center gap-1.5">
            <span
              className={`h-1 w-8 rounded-full bg-black transition duration-300 ${
                open ? 'rotate-45 translate-y-2.5' : ''
              }`}
            ></span>
            <span className={`h-1 w-8 rounded-full bg-black transition duration-300 ${open ? 'scale-x-0' : ''}`}></span>
            <span
              className={`h-1 w-8 rounded-full bg-black transition duration-300 ${
                open ? '-rotate-45 -translate-y-2.5' : ''
              }`}
            ></span>
          </div>
        </button>
        <div
          className={`${
            open ? 'block' : 'hidden'
          } transition duration-300 absolute top-full right-0 rounded bg-white w-[180px] shadow-xl`}
        >
          {navs.map((nav, index) => (
            <Fragment key={nav.name}>
              <div
                className="p-2 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition duration-300"
                onClick={() => {
                  navigate(nav.path);
                  setOpen(false);
                }}
              >
                <p className="font-medium">{nav.name}</p>
              </div>
              {index < navs.length && <hr />}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
