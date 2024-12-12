import { firestore } from '../configs/firebase.config.js';
import quickNode from '../configs/quicknode.config.js';
import environments from '../utils/environments.js';

const { NETWORK_ID } = environments;

const initSystem = async () => {
  const lastBlock = await quickNode.getBlockNumber();
  await firestore.collection('chains').doc(NETWORK_ID).set({ lastBlock });

  await firestore
    .collection('system')
    .doc('main')
    .set({
      activeRoundId: '0',
      bidStep: 500,
      timeStep: 2 * 60,
      nextRoundPrizePercent: 0.1,
      minRoundDuration: 2 * 60 * 60,
      lastWinner: null,
    });
  await firestore.collection('system').doc('round-craw-status').set({ value: 'idle' });
};

initSystem()
  .then(() => console.log('ok'))
  .catch((err) => console.error(err));
