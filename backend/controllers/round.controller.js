import * as services from '../services/round.service.js';

export const generateBetSignature = async (req, res) => {
  try {
    const { userId } = req;
    const { value, option } = req.body;
    const data = await services.generateBetSignature({ userId, value, option });

    return res.status(200).send(data);
  } catch (err) {
    console.error(err);
    return res.status(400).send(`API error: ${err.message}`);
  }
};
