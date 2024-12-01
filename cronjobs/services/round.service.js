import { firestore } from '../configs/firebase.config.js';

export const getActiveRoundId = async () => {
  const system = await firestore.collection('system').doc('main').get();
  const { activeRoundId } = system.data();

  return activeRoundId;
};

export const getActiveRound = async () => {
  const activeRoundId = await getActiveRoundId();

  const round = await firestore.collection('rounds').doc(activeRoundId).get();

  return { id: activeRoundId, ...round.data() };
};
