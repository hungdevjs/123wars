import { useState, useEffect, useRef } from "react";

import ConnectWalletButton from "../../components/ConnectWalletButton";
import {
  IconCoin,
  IconHistory,
  IconInfo,
  IconSwap,
  IconUser,
} from "../../components/Icons";
import useSystemStore from "../../stores/system.store";
import useUserStore from "../../stores/user.store";
import {
  formatAddress,
  formatDate,
  formatTimeDigit,
} from "../../utils/strings";

const Home = () => {
  const sytem = useSystemStore((state) => state.system);
  const activeRound = useSystemStore((state) => state.activeRound);
  const user = useUserStore((state) => state.user);
  const [time, setTime] = useState("-- : -- : --");

  const interval = useRef();
  const removeInterval = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }
  };

  const countdown = () => {
    if (!activeRound) return;

    const { endTime } = activeRound;
    const now = Date.now();
    const endTimeUnix = endTime.toDate().getTime();

    const diff = endTimeUnix - now;
    if (diff <= 0) {
      setTime("00 : 00 : 00");
    } else {
      const diffInSeconds = diff / 1000;
      const hours = Math.floor(diffInSeconds / 3600);
      const mins = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = Math.round(diffInSeconds % 60);
      setTime(
        `${formatTimeDigit(hours)} : ${formatTimeDigit(
          mins
        )} : ${formatTimeDigit(seconds)}`
      );
    }
  };

  useEffect(() => {
    removeInterval();

    if (activeRound) {
      interval.current = setInterval(countdown, 1000);
    }

    return () => removeInterval();
  }, [activeRound]);

  if (!activeRound) return null;

  const { id, prize, winner, numberOfParticipants, status } = activeRound;

  return (
    <div className="h-svh overflow-y-auto flex flex-col bg-black">
      <div className="flex-1 p-4 rounded-b-[40px] bg-white flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="font-medium">Round #{id}</p>
          <ConnectWalletButton />
        </div>
        {!!winner && (
          <div>
            <div className="px-4 py-3 rounded-3xl bg-orange-500 flex items-center justify-between">
              <p className="text-sm font-medium">
                {winner.username || formatAddress(winner.address)}{" "}
                <span className="font-semibold text-orange-900">
                  at {formatDate(winner.createdAt.toDate(), "HH:mm")}
                </span>
              </p>
              <div className="flex items-center gap-1">
                <IconCoin className="w-5 h-5" />
                <p className="font-bold">{winner.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <button className="rounded-xl p-2 bg-black transition duration-300 active:scale-95">
                <IconSwap className="w-8 h-8" />
              </button>
              <button className="rounded-xl p-2 bg-black transition duration-300 active:scale-95">
                <IconHistory className="w-8 h-8" />
              </button>
            </div>
            <IconCoin className="w-1/2 aspect-square" />
            <div className="flex flex-col gap-2">
              <button className="rounded-xl p-2 bg-black transition duration-300 active:scale-95">
                <IconUser className="w-8 h-8" />
              </button>
              <button className="rounded-xl p-2 bg-black transition duration-300 active:scale-95">
                <IconInfo className="w-8 h-8" />
              </button>
            </div>
          </div>
          <p className="text-[50px] font-bold text-center">
            {prize.toLocaleString()} PPX
          </p>
        </div>
        <div>
          <p className="text-center hover:underline cursor-pointer">
            {numberOfParticipants} participants
          </p>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <p className="text-[50px] font-bold text-center text-white">{time}</p>
        {status === "open" ? (
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full flex items-center justify-center bg-black border border-white text-lg text-white transition duration-300 active:scale-95">
                -
              </button>
              <div className="flex items-center gap-1">
                <IconCoin className="w-5 h-5" />
                <p className="text-xl font-semibold text-white">1000</p>
              </div>
              <button className="w-8 h-8 rounded-full flex items-center justify-center bg-black border border-white text-lg text-white transition duration-300 active:scale-95">
                +
              </button>
            </div>
            <button className="rounded-3xl bg-white w-[165px] h-[50px] font-medium transition duration-300 active:scale-95">
              Offer price
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-medium text-white">Processing result</p>
            <div className="flex space-x-2 justify-center items-center">
              <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
