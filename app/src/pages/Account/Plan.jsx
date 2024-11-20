import { IconCrypto } from '../../components/Icons';

const plans = [
  {
    name: '7 days',
    description: 'A quick sprint to test your reflexes',
    price: 0.001,
    days: 7,
    bg: 'bg-green-200',
  },
  {
    name: '30 days',
    description: 'Maximize your opportunities to win',
    price: 0.003,
    days: 30,
    bg: 'bg-indigo-200',
  },
  {
    name: '60 days',
    description: 'A marathon for the dedicated reward hunter',
    price: 0.005,
    days: 60,
    bg: 'bg-orange-200',
  },
];

const Plan = () => {
  return (
    <div className="h-full overflow-y-auto px-2 flex flex-col gap-4">
      <p className="font-medium text-center">
        Subscribe to a plan and get 3 chances daily to claim ETH and point
        rewards dropped at random times — be the fastest and win!
      </p>
      <div className="flex-1 overflow-y-auto flex flex-col gap-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-4 rounded-xl ${plan.bg} flex flex-col items-center gap-2`}
          >
            <div>
              <p className="text-xl md:text-2xl font-semibold text-center uppercase">
                {plan.name}
              </p>
              <p className="italic text-center">{plan.description}</p>
            </div>
            <IconCrypto className="w-20 h-20" />
            <button
              type="button"
              className="w-full justify-center rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition duration-300 active:bg-blue-700 disabled:opacity-60"
            >
              {`SUBSCRIBE (${plan.price} ETH)`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plan;
