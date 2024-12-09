import { Contract } from '@ethersproject/contracts';
import { formatEther } from '@ethersproject/units';
import system from 'system-commands';

import DollarAuction from '../assets/abis/DollarAuction.json' assert { type: 'json' };
import admin, { firestore } from '../configs/firebase.config.js';
import { getProvider } from '../configs/quicknode.config.js';
import environments from '../utils/environments.js';
import { date } from '../../cronjobs/utils/strings.js';
import { delay } from '../../app/src/utils/functions.js';
import { updateRound } from '../services/round.service.js';

const { NODE_ENV, NETWORK_ID, DOLLAR_AUCTION_ADDRESS } = environments;

const Events = {
  BidCreated: 'BidCreated',
  Refund: 'Refund',
  RoundEnded: 'RoundEnded',
  RoundCreated: 'RoundCreated',
};

const dollarAuctionListener = async () => {
  console.log(`========== start dollarAuctionListener at ${date()} ==========`);

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
    console.error(`========== FAILED provider dollarAuctionListener at ${date()}, err ${error.message} ==========`);

    if (NODE_ENV === 'production') {
      try {
        console.log('========== retart pm2 process ==========');
        await system('pm2 restart DOLLAR-AUCTION-LISTENER');
      } catch (err) {
        console.error(err);
        console.error(`========== FAILED restart pm2 process ==========`);
      }
    }
  });

  process.on('uncaughtException', async (error) => {
    console.error(`========== FAILED process dollarAuctionListener at ${date()}, err ${error.message} ==========`);

    try {
      provider._websocket.terminate();
    } catch (err) {
      console.error(`========== FAILED terminate websocket ==========`);

      if (NODE_ENV === 'production') {
        try {
          console.log('========== retart pm2 process ==========');
          await system('pm2 restart DOLLAR-AUCTION-LISTENER');
        } catch (err) {
          console.error(err);
          console.error(`========== FAILED restart pm2 process ==========`);
        }
      }
    }
  });

  process.on('unhandledRejection', async (reason, promise) => {
    console.error(
      `========== FAILED unhandledRejection dollarAuctionListener at ${date()}, reason ${reason} ==========`
    );

    try {
      provider._websocket.terminate();
    } catch (err) {
      console.error(`========== FAILED terminate websocket ==========`);

      if (NODE_ENV === 'production') {
        try {
          console.log('========== retart pm2 process ==========');
          await system('pm2 restart DOLLAR-AUCTION-LISTENER');
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
    dollarAuctionListener();
  });

  console.log(
    `========== start listen dollar auction contract ${DOLLAR_AUCTION_ADDRESS} on network ${NETWORK_ID} ==========`
  );
  const contract = new Contract(DOLLAR_AUCTION_ADDRESS, DollarAuction.abi, provider);

  contract.on(Events.BidCreated, async (roundId, bidder, amount, event) => {
    const data = {
      roundId: `${roundId.toString()}`,
      address: bidder.toLowerCase(),
      amount: Number(formatEther(amount)),
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
    };
    await processBidCreatedEvent(data);
  });

  contract.on(Events.Refund, async (roundId, to, amount, event) => {
    const data = {
      roundId: `${roundId.toString()}`,
      address: to.toLowerCase(),
      amount: Number(formatEther(amount)),
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
    };
    await processRefundEvent(data);
  });
};

const processBidCreatedEvent = async ({ roundId, address, amount, blockNumber, transactionHash }) => {
  console.log(`========== start processBidCreatedEvent at ${date()} ==========`, {
    roundId,
    address,
    amount,
    blockNumber,
    transactionHash,
  });
  try {
    const txRef = firestore.collection('transactions').doc(transactionHash);
    const chainRef = firestore.collection('chains').doc(NETWORK_ID);

    await firestore.runTransaction(async (transaction) => {
      const tx = await transaction.get(txRef);
      if (tx.exists) {
        console.log(
          `========== CANCEL processBidCreatedEvent, transaction ${transactionHash} is already processed ==========`
        );
        return;
      }

      const userRef = firestore.collection('users').where('address', '==', address).limit(1);
      const user = await transaction.get(userRef);
      transaction.set(txRef, {
        userId: user.empty ? null : user.docs[0].id,
        address,
        type: 'bid',
        roundId: roundId,
        amount,
        transactionHash,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      transaction.set(chainRef, { lastBlock: blockNumber });
    });

    await updateRound();
    console.log(`========== SUCCESS start processBidCreatedEvent at ${date()} ==========`);
  } catch (err) {
    console.error(err);
    console.log(`========== FAILED start processBidCreatedEvent at ${date()}, err ${err.message} ==========`);
  }
};

const processRefundEvent = async ({ roundId, address, amount, blockNumber, transactionHash }) => {
  console.log(`========== start processBidCreatedEvent at ${date()} ==========`, {
    roundId,
    address,
    amount,
    blockNumber,
    transactionHash,
  });
  try {
    const txRef = firestore.collection('transactions').doc(`${transactionHash}-refund`);
    const chainRef = firestore.collection('chains').doc(NETWORK_ID);

    await firestore.runTransaction(async (transaction) => {
      const tx = await transaction.get(txRef);
      if (tx.exists) return;

      const userRef = firestore.collection('users').where('address', '==', address).limit(1);
      const user = await transaction.get(userRef);
      transaction.set(txRef, {
        userId: user.empty ? null : user.docs[0].id,
        address,
        type: 'refund',
        roundId: roundId,
        amount,
        transactionHash,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      transaction.set(chainRef, { lastBlock: blockNumber });
    });

    await updateRound();
    console.log(`========== SUCCESS start processBidCreatedEvent at ${date()} ==========`);
  } catch (err) {
    console.error(err);
    console.log(`========== FAILED start processBidCreatedEvent at ${date()}, err ${err.message} ==========`);
  }
};

export default dollarAuctionListener;
