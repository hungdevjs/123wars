import { formatEther } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";

import admin, { firestore } from "../configs/firebase.config.js";
import { getAdminWallet, getGameContract } from "./contract.service.js";

const getUser = async (address) => {
  const user = await firestore
    .collection("users")
    .where("address", "==", address)
    .get();
  if (user.empty) return null;

  return { id: user.docs[0].id, ...user.docs[0].data() };
};

export const updateRound = async () => {
  const adminWallet = getAdminWallet();
  const gameContract = getGameContract(adminWallet);

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

  roundRef.set(updatedData);
};
