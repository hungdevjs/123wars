import moment from 'moment';

import admin, { firestore } from '../configs/firebase.config.js';
import * as services from '../services/round.service.js';
import { randomInRange } from '../utils/numbers.js';
import { date } from '../utils/strings.js';

const generateRewards = async () => {
  console.log(`========== generateRewards, ${date()} ==========`);
  try {
    const activeRoundId = await services.getActiveRoundId();
    const roundRef = firestore.collection('rounds').doc(activeRoundId);
    const roundRewardTimeRef = firestore
      .collection('round-reward-time')
      .doc(activeRoundId);

    await firestore.runTransaction(async (transaction) => {
      const now = Date.now();
      const roundRewardTime = await transaction.get(roundRewardTimeRef);
      const { nextTimeRewardGenerated } = roundRewardTime.data();
      if (now < nextTimeRewardGenerated.toDate().getTime()) return;

      const round = await transaction.get(roundRef);
      const {
        numberOfEthRewards,
        numberOfDistributedEthRewards,
        numberOfPointRewards,
        numberOfDistributedPointRewards,
        ethVault,
        pointVault,
      } = round.data();

      const hasEthReward = numberOfEthRewards > numberOfDistributedEthRewards;
      const hasPointReward =
        numberOfPointRewards > numberOfDistributedPointRewards;

      if (!hasEthReward && !hasPointReward) return;

      let type = 'eth';
      if (!hasEthReward) {
        type = 'point';
      } else if (hasPointReward) {
        const random = Math.random();
        if (random > 0.5) {
          type = 'point';
        }
      }

      const turnLeft =
        type === 'eth'
          ? numberOfEthRewards - numberOfDistributedEthRewards
          : numberOfPointRewards - numberOfDistributedPointRewards;

      const vault = type === 'eth' ? ethVault : pointVault;

      let amount = vault;
      if (turnLeft > 1) {
        amount = randomInRange(0, vault / turnLeft);
        amount = Math.floor(amount * 10000) / 10000;
        while (amount === 0) {
          amount = randomInRange(0, vault / turnLeft);
          amount = Math.floor(amount * 10000) / 10000;
        }
      }

      const startOfHour = moment().startOf('hour').toDate().getTime();
      const midHour = startOfHour + 30 * 60 * 1000;
      const startOfNextHour = startOfHour + 60 * 60 * 1000;
      const startRange = now < midHour ? midHour : startOfNextHour;
      const endRange = startRange + 30 * 60 * 1000;
      const newNextTimeRewardGeneratedUnix = randomInRange(
        startRange + 3 * 60 * 1000,
        endRange - 3 * 60 * 1000
      );

      // create rewards
      const rewardRef = firestore.collection('rewards').doc();
      transaction.set(rewardRef, {
        type,
        amount,
        roundId: activeRoundId,
        winners: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expireTime: admin.firestore.Timestamp.fromMillis(now + 15 * 1000),
      });
      transaction.update(roundRewardTimeRef, {
        nextTimeRewardGenerated: admin.firestore.Timestamp.fromMillis(
          newNextTimeRewardGeneratedUnix
        ),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      transaction.update(
        roundRef,
        type === 'eth'
          ? {
              numberOfDistributedEthRewards:
                admin.firestore.FieldValue.increment(1),
              ethVault: admin.firestore.FieldValue.increment(-amount),
              activeRewardId: rewardRef.id,
            }
          : {
              numberOfDistributedPointRewards:
                admin.firestore.FieldValue.increment(1),
              pointVault: admin.firestore.FieldValue.increment(-amount),
              activeRewardId: rewardRef.id,
            }
      );
    });
    console.log(`========== SUCCESS generateRewards, ${date()} ==========`);
  } catch (err) {
    console.error(
      `========== FAILED generateRewards, ${date()}, error: ${
        err.message
      } ==========`
    );
    console.error(err);
  }
};

export default generateRewards;
