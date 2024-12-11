import { checkRoundEnded } from '../services/round.service.js';

const checkRoundEnd = async () => {
  await checkRoundEnded();
};

export default checkRoundEnd;
