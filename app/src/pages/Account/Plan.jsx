import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { IconCrypto } from '../../components/Icons';
import PlanConfirmModal from './components/PlanConfirmModal';
import usePlanStore from '../../stores/plan.store';
import useUserStore from '../../stores/user.store';
import { formatDate } from '../../utils/strings';

const Plan = () => {
  const user = useUserStore((state) => state.user);
  const userPlan = usePlanStore((state) => state.userPlan);
  const plans = usePlanStore((state) => state.plans);
  const fetch = usePlanStore((state) => state.fetch);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetch();
  }, [user?.id]);

  const userPlanId = userPlan?.plan?.planId;
  const expireTime = userPlan ? formatDate(userPlan.expireTime.toDate()) : null;
  const expired =
    userPlan && userPlan.expireTime.toDate().getTime() <= Date.now();

  const buttonText = (plan) => {
    if (plan.id === userPlanId) {
      if (expired) return `Expired. Renew (${userPlan.plan.priceInEth} ETH)`;
      return `Expired at ${expireTime}`;
    }

    if (!plan.priceInEth) return `Subscribe (FREE)`;

    return `Subscribe (${plan.priceInEth} ETH)`;
  };

  return (
    <div className="h-full overflow-y-auto px-2 flex flex-col gap-4">
      <p className="text-center">
        Subscribe to a plan and get 48 chances daily to claim ETH and point
        rewards dropped at random times — be the fastest and win!
      </p>
      <div className="flex-1 overflow-y-auto flex flex-col gap-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-4 rounded-xl ${
              plan.bg
            } flex flex-col items-center gap-2 ${
              plan.id === userPlanId && 'border border-indigo-900'
            }`}
          >
            <div>
              <div className="flex items-center justify-center gap-1">
                <p className="text-xl md:text-2xl font-semibold text-center uppercase">
                  {plan.name}
                </p>
                {plan.id === userPlanId && <p className="italic">(selected)</p>}
              </div>
              <p className="italic text-center">{plan.description}</p>
              <p className="italic text-center font-semibold">
                {plan.days} days
              </p>
            </div>
            <IconCrypto className="w-20 h-20" />
            <button
              type="button"
              disabled={plan.id === userPlanId && !expired}
              className="w-full justify-center rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition duration-300 active:bg-blue-700 disabled:opacity-60"
              onClick={() => setSelectedPlan(plan)}
            >
              {buttonText(plan)}
            </button>
          </div>
        ))}
      </div>
      <PlanConfirmModal
        plan={selectedPlan}
        close={() => setSelectedPlan(null)}
      />
    </div>
  );
};

export default Plan;
