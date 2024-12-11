import { updateRound } from '../services/round.service.js';

const crawRoundData = async () => {
  await updateRound();
};

export default crawRoundData;
