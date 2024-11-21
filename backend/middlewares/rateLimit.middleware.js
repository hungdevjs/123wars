import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 1000, // 1 second
  max: 5, // limit each IP/user to 5 requests per windowMs
  keyGenerator: function (req) {
    return `${req.originalUrl}-${req.originalUrl}`; // use user ID as the key
  },
  handler: function (req, res, next) {
    res.status(429).json({
      message: 'Too many requests, please try again later.',
    });
  },
});

export default limiter;
