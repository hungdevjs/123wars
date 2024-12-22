import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { startRound } from './services/game.service.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.middleware.js';
import environments from './utils/environments.js';

const { PORT } = environments;

const app = express();

app.use(cors());
app.use(express.json());

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('OK 1.0.62');
});

app.use('/api', routes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

global._io = io;
startRound();

server.listen(PORT, () => console.log(`server is running on port ${PORT}`));

export default app;
