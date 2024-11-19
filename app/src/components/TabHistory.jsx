import useMatch from '../hooks/useMatch';
import { formatDate } from '../utils/strings';

const TabHistory = () => {
  const { matches } = useMatch();

  return (
    <div className="h-full p-4 flex flex-col gap-2">
      <div className="p-2 grid grid-cols-12">
        {/* <div className="col-span-6">
          <p className="text-left font-medium text-sm md:text-base">ID</p>
        </div> */}
        <div className="col-span-6">
          <p className="text-left font-medium text-sm md:text-base">Date</p>
        </div>
        <div className="col-span-6">
          <p className="text-right font-medium text-sm md:text-base">Winner</p>
        </div>
      </div>
      <div className="grow overflow-auto flex flex-col gap-1">
        {matches.map((item, index) => (
          <div key={item.id} className={`p-2 grid grid-cols-12 rounded ${index % 2 ? 'bg-stone-100' : ''}`}>
            {/* <div className="col-span-6 flex items-center">
              <p className="text-left text-sm md:text-base text-ellipsis overflow-hidden whitespace-nowrap">
                {item.id}
              </p>
            </div> */}
            <div className="col-span-6 flex items-center">
              <p className="text-left text-sm md:text-base">{formatDate(item.createdAt.toDate())}</p>
            </div>
            <div className="col-span-6 flex items-center justify-end">
              <img className="w-[20px]" src={`images/${item.winner}.png`} alt="winner" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabHistory;
