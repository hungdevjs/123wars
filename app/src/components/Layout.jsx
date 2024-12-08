import { useNavigate } from "react-router-dom";

import { IconArrowLeft } from "./Icons";

const Layout = ({ backPath = "/", title, children }) => {
  const navigate = useNavigate();

  return (
    <div className="h-svh w-full  bg-white overflow-y-auto p-4 flex flex-col gap-2">
      <div className="relative h-10 flex items-center justify-center">
        <p className="font-medium">{title}</p>
        <button
          className="absolute top-0 left-0 w-10 aspect-square rounded-xl border border-gray-200 flex items-center justify-center transition duration-300 active:scale-95"
          onClick={() => navigate(backPath)}
        >
          <IconArrowLeft className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};

export default Layout;
