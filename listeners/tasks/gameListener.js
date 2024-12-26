import { Contract } from '@ethersproject/contracts';
import { formatEther } from '@ethersproject/units';
import systemCommands from 'system-commands';

import War from '../assets/abis/War.json' assert { type: 'json' };
import admin, { firestore } from '../configs/firebase.config.js';
import { getProvider } from '../configs/quicknode.config.js';
import environments from '../utils/environments.js';
import { date } from '../utils/strings.js';
import { delay } from '../utils/functions.js';

const { NODE_ENV, NETWORK_ID } = environments;

const Events = {
  BetCreated: 'BetCreated',
};

const gameListener = async () => {
  console.log(`========== start gameListener at ${date()} ==========`);

  const system = await firestore.collection('system').doc('main').get();
  const { addresses } = system.data();

  let provider;
  while (!provider?._wsReady) {
    try {
      provider = getProvider();
      await delay(2000);
    } catch (err) {
      console.error(err);
      console.error(`========== FAILED establish provider, err ${err.message} ==========`);
      await delay(5000);
    }
  }

  // provider listeners
  provider.on('error', async (error) => {
    console.error(error);
    console.error(`========== FAILED provider gameListener at ${date()}, err ${error.message} ==========`);

    if (NODE_ENV === 'production') {
      try {
        console.log('========== retart pm2 process ==========');
        await systemCommands('pm2 restart GAME-LISTENER');
      } catch (err) {
        console.error(err);
        console.error(`========== FAILED restart pm2 process ==========`);
      }
    }
  });

  process.on('uncaughtException', async (error) => {
    console.error(`========== FAILED process gameListener at ${date()}, err ${error.message} ==========`);

    try {
      provider._websocket.terminate();
    } catch (err) {
      console.error(`========== FAILED terminate websocket ==========`);

      if (NODE_ENV === 'production') {
        try {
          console.log('========== retart pm2 process ==========');
          await systemCommands('pm2 restart GAME-LISTENER');
        } catch (err) {
          console.error(err);
          console.error(`========== FAILED restart pm2 process ==========`);
        }
      }
    }
  });

  process.on('unhandledRejection', async (reason, promise) => {
    console.error(`========== FAILED unhandledRejection gameListener at ${date()}, reason ${reason} ==========`);

    try {
      provider._websocket.terminate();
    } catch (err) {
      console.error(`========== FAILED terminate websocket ==========`);

      if (NODE_ENV === 'production') {
        try {
          console.log('========== retart pm2 process ==========');
          await systemCommands('pm2 restart GAME-LISTENER');
        } catch (err) {
          console.error(err);
          console.error(`========== FAILED restart pm2 process ==========`);
        }
      }
    }
  });

  provider._websocket.on('close', () => {
    console.log(`========== provider socket closed, restart at ${date()} ==========`);
    contract.removeAllListeners(Object.values(Events));
    gameListener();
  });

  console.log(`========== start listen game contract ${addresses.game} on network ${NETWORK_ID} ==========`);
  const contract = new Contract(addresses.game, War.abi, provider);

  contract.on(Events.BetCreated, async (roundId, option, from, value, event) => {
    const options = {
      1: 'rock',
      2: 'paper',
      3: 'scissors',
    };

    const data = {
      roundId: `${roundId.toString()}`,
      option: options[option.toString()],
      from: from.toLowerCase(),
      value: Number(formatEther(value)),
      transactionHash: event.transactionHash,
    };
    await processBetCreatedEvent(data);
  });
};

const processBetCreatedEvent = async ({ roundId, option, from, value, transactionHash }) => {
  console.log(`========== start processBetCreatedEvent at ${date()} ==========`, {
    roundId,
    option,
    from,
    value,
    transactionHash,
  });
  try {
    const txRef = firestore.collection('transactions').doc(transactionHash);
    await firestore.runTransaction(async (transaction) => {
      const tx = await transaction.get(txRef);
      if (tx.exists) {
        console.log(
          `========== CANCEL processBetCreatedEvent, transaction ${transactionHash} is already processed ==========`
        );
        return;
      }

      const userRef = firestore.collection('users').where('address', '==', from).limit(1);
      const user = await transaction.get(userRef);
      if (!user.empty) {
        transaction.set(txRef, {
          userId: user.docs[0].id,
          address: from.toLowerCase(),
          type: 'bet',
          roundId: roundId,
          option,
          value,
          transactionHash,
          status: 'success',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      const roundRef = firestore.collection('rounds').doc(roundId);
      const countKey = `bettings.${option}.count`;
      const valueKey = `bettings.${option}.value`;
      transaction.update(roundRef, {
        [countKey]: admin.firestore.FieldValue.increment(1),
        [valueKey]: admin.firestore.FieldValue.increment(value),
      });
    });
    console.log(`========== SUCCESS start processBetCreatedEvent at ${date()} ==========`);
  } catch (err) {
    console.error(err);
    console.log(`========== FAILED start processBetCreatedEvent at ${date()}, err ${err.message} ==========`);
  }
};

export default gameListener;
