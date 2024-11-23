import * as services from '../services/auth.service.js';

export const generateLoginPayload = async (req, res) => {
  try {
    const { address, chainId } = req.query;
    const payload = await services.generateLoginPayload({ address, chainId });

    return res.status(200).send(payload);
  } catch (err) {
    console.error(err);
    return res.status(400).send(`API error: ${err.message}`);
  }
};

export const validateLoginPayload = async (req, res) => {
  try {
    const token = await services.validateLoginPayload(req.body);

    return res.status(200).send(token);
  } catch (err) {
    console.error(err);
    return res.status(400).send(`API error: ${err.message}`);
  }
};

export const getMe = async (req, res) => {
  try {
    const { userId } = req;
    const data = await services.getMe(userId);
    return res.status(200).send(data);
  } catch (err) {
    console.error(err);
    return res.status(400).send(`API error: ${err.message}`);
  }
};
