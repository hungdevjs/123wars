import { updateRound, checkRoundEnded } from '../services/round.service.js';

const crawRoundData = async () => {
  await updateRound();
  await checkRoundEnded();
};

export default crawRoundData;
