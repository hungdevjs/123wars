import admin, { firestore } from '../configs/firebase.config.js';

const plans = [
  {
    id: '0',
    name: 'Flash Start',
    description: 'Test your speed in your first 3 days',
    days: 3,
    priceInEth: 0,
  },
  {
    id: '1',
    name: 'Rapid Dash',
    description: 'A quick sprint to test your reflexes',
    days: 7,
    priceInEth: 0.001,
  },
  {
    id: '2',
    name: 'Momentum Ride',
    description: 'Maximize your opportunities to win',
    days: 30,
    priceInEth: 0.003,
  },
  {
    id: '3',
    name: 'Endurance Edge',
    description: 'A marathon for the dedicated reward hunter',
    days: 60,
    priceInEth: 0.005,
  },
];

const seed = async () => {
  console.log('creating system');
  await firestore.collection('system').doc('main').set({
    activeRoundId: '1',
    numberOfEthRewardsPerRound: 4,
    numberOfPointRewardsPerRound: 44,
    ethRewardsPerRound: 0.004,
    pointPerRound: 1000,
  });
  console.log('created system');

  console.log('creating round');
  await firestore.collection('rounds').doc('1').set({
    numberOfEthRewards: 4,
    numberOfDistributedEthRewards: 0,
    numberOfPointRewards: 44,
    numberOfDistributedPointRewards: 0,
    ethVault: 0.004,
    pointVault: 1000,
    activeRewardId: null,
    status: 'open',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log('created round');

  console.log('creating round reward time');
  await firestore.collection('round-reward-time').doc('1').set({
    nextTimeRewardGenerated: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log('created round reward time');

  console.log('creating plans');
  for (const plan of plans) {
    const { id: planId, ...rest } = plan;
    await firestore
      .collection('plans')
      .doc(planId)
      .set({ ...rest });
  }
  console.log('created plans');
};

seed()
  .then(() => console.log('ok'))
  .catch((err) => console.error(err));
