import * as services from '../services/user.service.js';

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

export const validatePhoneNumber = async (req, res) => {
  try {
    const { userId } = req;
    const data = await services.validatePhoneNumber({ userId });

    return res.status(200).send(data);
  } catch (err) {
    console.error(err);
    return res.status(400).send(`API error: ${err.message}`);
  }
};

export const checkReward = async (req, res) => {
  try {
    const { userId } = req;
    await services.checkReward({ userId });

    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.status(400).send(`API error: ${err.message}`);
  }
};
