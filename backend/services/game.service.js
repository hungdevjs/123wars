import shuffle from 'lodash.shuffle';

import { create, lock, start, end, getActiveRoundId, sendRewards } from './round.service.js';
import configs from '../configs/game.config.js';

const { width, height, itemCount, itemTypes, speed, size, lockTime, openTime } = configs;

const getRandomVelocity = () => {
  return {
    x: (Math.random() * 2 - 1) * speed,
    y: (Math.random() * 2 - 1) * speed,
  };
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const startRound = async () => {
  await create();
  await delay(openTime);

  const roundId = await getActiveRoundId();
  await lock({ roundId });
  await delay(lockTime);

  await start({ roundId });

  const gameState = [];
  const shuffled = shuffle([
    { x: 250, y: 150 },
    { x: 700, y: 450 },
    { x: 150, y: 650 },
  ]);
  const initCoordinates = {
    rock: shuffled[0],
    paper: shuffled[1],
    scissors: shuffled[2],
  };
  itemTypes.forEach((type) => {
    for (let i = 0; i < itemCount; i++) {
      const position = initCoordinates[type];
      const velocity = getRandomVelocity();
      gameState.push({
        type,
        x: position.x,
        y: position.y,
        vx: velocity.x,
        vy: velocity.y,
      });
    }
  });

  let looping = false;
  const gameLoop = setInterval(async () => {
    if (looping) return;

    looping = true;
    try {
      // Update positions and handle edge of canvas collisions
      gameState.forEach((item) => {
        item.x += item.vx;
        item.y += item.vy;

        // Bounce off walls
        if (item.x - size / 2 <= 0 || item.x + size / 2 >= width) item.vx *= -1;
        if (item.y - size / 2 <= 0 || item.y + size / 2 >= height) item.vy *= -1;

        // Simulate simple "touch" collision detection
        gameState.forEach((otherItem) => {
          if (item !== otherItem && Math.abs(item.x - otherItem.x) < size && Math.abs(item.y - otherItem.y) < size) {
            // Check winning condition
            if (
              (item.type === 'rock' && otherItem.type === 'scissors') ||
              (item.type === 'scissors' && otherItem.type === 'paper') ||
              (item.type === 'paper' && otherItem.type === 'rock')
            ) {
              otherItem.type = item.type; // Loser turns into the winner's type

              // Change the velocity of both items on collision
              const newVelocity1 = getRandomVelocity();
              const newVelocity2 = getRandomVelocity();

              item.vx = newVelocity1.x;
              item.vy = newVelocity1.y;
              otherItem.vx = newVelocity2.x;
              otherItem.vy = newVelocity2.y;
            }
          }
        });
      });

      // Emit updated game state
      global._io.emit('gameState', { gameState });

      const counts = {
        rock: 0,
        paper: 0,
        scissors: 0,
      };
      gameState.map((item) => counts[item.type]++);

      if (counts.rock === itemCount * 3 || counts.paper === itemCount * 3 || counts.scissors === itemCount * 3) {
        const winner = counts.rock > 0 ? 'rock' : counts.paper > 0 ? 'paper' : 'scissors';
        global._io.emit('gameOver', {
          winner,
        });
        clearInterval(gameLoop);

        await end({ roundId, winner });
        sendRewards({ roundId });
        await delay(2000);
        startRound();
      }
    } catch (err) {
      console.error(err);
    }

    looping = false;
  }, 1000 / 30);
};
