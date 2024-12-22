import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

import BarGraph from './BarGraph';
import RoundInfo from './RoundInfo';
import useSystemStore from '../../../stores/system.store';
import environments from '../../../utils/environments';

const { BACKEND_URL } = environments;

const socket = io(BACKEND_URL);

const Game = () => {
  const activeRound = useSystemStore((state) => state.activeRound);
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState([]);

  const rockImg = useRef(null);
  const paperImg = useRef(null);
  const scissorsImg = useRef(null);

  const rockSound = useRef(null);
  const paperSound = useRef(null);
  const scissorsSound = useRef(null);

  const prevGameState = useRef([]);

  useEffect(() => {
    // Listen for game state updates from the server
    socket.on('gameState', ({ gameState }) => {
      setGameState(gameState);
    });

    return () => {
      socket.off('gameState');
      socket.off('gameOver');
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each item
    gameState.forEach((item, index) => {
      let img;
      if (item.type === 'rock') {
        img = rockImg.current;
      } else if (item.type === 'paper') {
        img = paperImg.current;
      } else if (item.type === 'scissors') {
        img = scissorsImg.current;
      }

      if (img) {
        ctx.drawImage(img, item.x - 10, item.y - 10, 20, 20); // Draw image centered
      }

      const prevItem = prevGameState.current[index];
      if (prevItem && prevItem.type !== item.type) {
        if (item.type === 'rock') {
          rockSound.current.play();
        } else if (item.type === 'paper') {
          paperSound.current.play();
        } else if (item.type === 'scissors') {
          scissorsSound.current.play();
        }
      }
    });

    prevGameState.current = gameState;
  }, [gameState]);

  const counts = gameState.reduce(
    (result, item) => {
      result[item.type]++;
      return result;
    },
    { rock: 0, paper: 0, scissors: 0 }
  );

  return (
    <div className="overflow-y-auto overflow-x-hidden flex flex-col items-center gap-2">
      <p className="text-white text-center">round #{activeRound.id}</p>
      <div className="max-w-full">
        <div className="pt-8 w-full">
          <BarGraph counts={counts} />
        </div>
        <div className="relative border border-gray-500 max-w-full aspect-square">
          <canvas ref={canvasRef} width={800} height={800} className="w-full h-full" style={{ maxHeight: '80vh' }} />
          <div className="absolute top-0 left-0 w-full h-full">
            <RoundInfo />
          </div>
        </div>
      </div>

      <img ref={rockImg} src="icons/rock.png" alt="rock" style={{ display: 'none' }} />
      <img ref={paperImg} src="icons/paper.png" alt="paper" style={{ display: 'none' }} />
      <img ref={scissorsImg} src="icons/scissors.png" alt="scissors" style={{ display: 'none' }} />

      <audio ref={rockSound} src="audios/rock.mp3" preload="auto"></audio>
      <audio ref={paperSound} src="audios/paper.mp3" preload="auto"></audio>
      <audio ref={scissorsSound} src="audios/scissors.mp3" preload="auto"></audio>
    </div>
  );
};

export default Game;
