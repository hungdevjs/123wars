import { thirdwebAuth } from '../configs/thirdweb.config.js';

const middleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split(' ')?.[1];

    const authResult = await thirdwebAuth.verifyJWT({ jwt: token });
    if (!authResult.valid) throw new Error('API error: Bad credential');

    req.userId = authResult.parsedJWT.sub.toLowerCase();

    next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(401);
  }
};

export default middleware;
