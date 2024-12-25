import { firestore } from '../configs/firebase.config.js';

const initSystem = async () => {
  const rounds = await firestore.collection('rounds').get();
  const transactions = await firestore.collection('transactions').get();
  const systemMainDocRef = firestore.collection('system').doc('main');
  const systemWinnersDocRef = firestore.collection('system').doc('winners');

  const batch = firestore.batch();

  [...rounds.docs, ...transactions.docs].map((doc) => batch.delete(doc.ref));

  batch.set(systemMainDocRef, {
    activeRoundId: '0',
    configs: {
      multiplier: 3,
    },
    addresses: {
      token: '0x935c61DADC5a3B7D8B1019D445740A2324571726'.toLowerCase(),
      game: '0x96b2211Be62f9D00f1ab0A186371358CD7969A12'.toLowerCase(),
      router: '0x9929fACA79699eEDC79e023234D983e614D80f4E'.toLowerCase(),
      factory: '0x88429007d4Ae3aE6FE0e641366D025DF2EE3666F'.toLowerCase(),
      pair: '0x287f6C8f8E3B2122E79F1382C7ef3f6A86A27b95'.toLowerCase(),
      weth: '0x4200000000000000000000000000000000000006'.toLowerCase(),
    },
  });

  batch.set(systemWinnersDocRef, {
    paper: 0,
    rock: 0,
    scissors: 0,
  });

  await batch.commit();
};

initSystem()
  .then(() => console.log('ok'))
  .catch((err) => console.error(err));
