import generateRewards from './tasks/generateRewards.js';
import expireUserPlan from './tasks/expireUserPlan.js';

const INTERVAL_GENERATE_REWARDS = 3.7 * 60 * 1000;
const INTERVAL_EXPIRE_USER_PLAN = 5 * 60 * 1000;

const main = () => {
  expireUserPlan();
  setInterval(generateRewards, INTERVAL_GENERATE_REWARDS);
  setInterval(expireUserPlan, INTERVAL_EXPIRE_USER_PLAN);
};

main();
