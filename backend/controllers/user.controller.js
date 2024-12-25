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
