import { formatEther } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";

import admin, { firestore } from "../configs/firebase.config.js";
import { retry } from "../utils/functions.js";
import { getGameContract, getWorkerWallet } from "./contract.service.js";

export const getActiveRoundId = async () => {
  const system = await firestore.collection("system").doc("main").get();
  const { activeRoundId } = system.data();

  return activeRoundId;
};

export const getActiveRound = async () => {
  const activeRoundId = await getActiveRoundId();

  const round = await firestore.collection("rounds").doc(activeRoundId).get();

  return { id: activeRoundId, ...round.data() };
};

const getUser = async (address) => {
  const user = await firestore
    .collection("users")
    .where("address", "==", address)
    .get();
  if (user.empty) return null;

  return { id: user.docs[0].id, ...user.docs[0].data() };
};

export const updateRound = async () => {
  const workerWallet = getWorkerWallet();
  const gameContract = getGameContract(workerWallet);

  const data = await Promise.all([
    gameContract.roundId(),
    gameContract.roundPrize(),
    gameContract.roundEndTime(),
    gameContract.nextRoundPrize(),
    gameContract.roundWinnerBid(),
    gameContract.roundWinner(),
    gameContract.roundSecondBid(),
    gameContract.roundSecondPosition(),
    gameContract.isActive(),
    gameContract.numberOfBids(),
  ]);

  const roundId = `${data[0]}`;
  const roundPrize = Number(formatEther(data[1]));
  const roundEndTime = data[2] * 1000;
  const nextRoundPrize = Number(formatEther(data[3]));
  const roundWinnerBid = Number(formatEther(data[4]));
  const roundWinner = data[5];
  const roundSecondBid = Number(formatEther(data[6]));
  const roundSecondPosition = data[7];
  const isActive = data[8];
  const numberOfBids = Number(data[9].toString());

  console.log(`========== round data ==========`, {
    roundId,
    roundPrize,
    roundEndTime,
    nextRoundPrize,
    roundWinnerBid,
    roundWinner,
    roundSecondBid,
    roundSecondPosition,
    isActive,
    numberOfBids,
  });

  const first =
    roundWinner !== AddressZero
      ? await getUser(roundWinner.toLowerCase())
      : null;
  const second =
    roundSecondPosition !== AddressZero
      ? await getUser(roundSecondPosition.toLowerCase())
      : null;
  const roundRef = firestore.collection("rounds").doc(roundId);

  const now = Date.now();
  const updatedData = {
    prize: roundPrize,
    nextPrize: nextRoundPrize,
    endTime: admin.firestore.Timestamp.fromMillis(roundEndTime),
    numberOfBids,
    first:
      roundWinner !== AddressZero
        ? {
            address: roundWinner.toLowerCase(),
            amount: roundWinnerBid,
            createdAt: admin.firestore.Timestamp.fromMillis(now),
            username: first ? first.username : null,
          }
        : null,
    second:
      roundSecondPosition !== AddressZero
        ? {
            address: roundSecondPosition.toLowerCase(),
            amount: roundSecondBid,
            createdAt: admin.firestore.Timestamp.fromMillis(now),
            username: second ? second.username : null,
          }
        : null,
    status: isActive ? "open" : "closed",
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await roundRef.set(updatedData);

  return { roundId, isActive };
};

export const crawRoundData = async () => {
  const { roundId, isActive } = await updateRound();

  if (!isActive) {
    const workerWallet = getWorkerWallet();
    const gameContract = getGameContract(workerWallet);

    const { success } = await retry({
      name: "endRoundAndCreateNewRound",
      action: gameContract.endRoundAndCreateNewRound,
    });
    if (success) {
      const { roundId: newRoundId } = await updateRound();
      await firestore
        .collection("system")
        .doc("main")
        .update({ activeRoundId: newRoundId });
    }
  } else {
    await firestore
      .collection("system")
      .doc("main")
      .update({ activeRoundId: roundId });
  }
};
