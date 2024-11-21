import express from 'express';
import cors from 'cors';

import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.middleware.js';
import environments from './utils/environments.js';

const { PORT } = environments;

const main = async () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(errorHandler);

  app.get('/', (req, res) => {
    res.send('OK 1.0.62');
  });

  app.use('/api', routes);

  app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
};

main();
