import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import ConnectWalletButton from "../../components/ConnectWalletButton";
import {
  IconCoin,
  IconGoldMedal,
  IconHistory,
  IconInfo,
  IconSilverMedal,
  IconSwap,
  IconUser,
} from "../../components/Icons";
import BidConfirmation from "./components/BidConfirmation";
import useSystemStore from "../../stores/system.store";
import useUserStore from "../../stores/user.store";
import {
  formatAddress,
  formatDate,
  formatTimeDigit,
} from "../../utils/strings";

const Home = () => {
  const navigate = useNavigate();
  const system = useSystemStore((state) => state.system);
  const activeRound = useSystemStore((state) => state.activeRound);
  const user = useUserStore((state) => state.user);
  const [time, setTime] = useState("-- : -- : --");
  const [amount, setAmount] = useState(0);
  const [openConfirmation, setOpenConfirmation] = useState(false);

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

  const { bidStep } = system;
  const { id, prize, first, second, numberOfParticipants, status } =
    activeRound;

  const min = activeRound.first
    ? activeRound.first.amount + bidStep
    : system.bidStep;
  const correctAmount = () => {
    if (min > amount) {
      setAmount(min);
    }
  };

  const formattedAmount = Number(amount).toLocaleString();

  useEffect(() => {
    removeInterval();

    if (activeRound) {
      interval.current = setInterval(countdown, 1000);
    }

    return () => removeInterval();
  }, [activeRound]);

  useEffect(() => {
    correctAmount();
  }, [min]);

  return (
    <div className="h-svh overflow-y-auto flex flex-col bg-black">
      <div className="flex-1 p-4 rounded-b-[40px] bg-white flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="font-medium">Round #{id}</p>
          <ConnectWalletButton />
        </div>
        <div className="rounded-lg h-20 border border-gray-300 overflow-hidden">
          {!!first && (
            <div className="h-10 bg-green-400 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconGoldMedal className="w-5 h-5" />
                <p className="text-sm font-medium">
                  {first.username || formatAddress(first.address, 5)}{" "}
                  <span className="font-semibold text-orange-900">
                    at {formatDate(first.createdAt.toDate(), "HH:mm")}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <IconCoin className="w-5 h-5" />
                <p className="font-bold">{first.amount.toLocaleString()}</p>
              </div>
            </div>
          )}
          {!!second && (
            <div className="h-10 bg-green-100 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconSilverMedal className="w-5 h-5" />
                <p className="text-sm font-medium">
                  {second.username || formatAddress(second.address, 5)}{" "}
                  <span className="font-semibold text-orange-900">
                    at {formatDate(second.createdAt.toDate(), "HH:mm")}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <IconCoin className="w-5 h-5" />
                <p className="font-bold">{second.amount.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <button
                className="rounded-xl p-2 bg-black transition duration-300 active:scale-95"
                onClick={() => navigate("/swap")}
              >
                <IconSwap className="w-8 h-8" />
              </button>
              <button
                className="rounded-xl p-2 bg-black transition duration-300 active:scale-95"
                onClick={() => navigate("/history")}
              >
                <IconHistory className="w-8 h-8" />
              </button>
            </div>
            <IconCoin className="w-1/2 aspect-square" />
            <div className="flex flex-col gap-2">
              <button
                className="rounded-xl p-2 bg-black transition duration-300 active:scale-95"
                onClick={() => navigate("/account")}
              >
                <IconUser className="w-8 h-8" />
              </button>
              <button
                className="rounded-xl p-2 bg-black transition duration-300 active:scale-95"
                onClick={() => navigate("/info")}
              >
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
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center bg-black border border-white text-lg text-white transition duration-300 active:scale-95 disabled:opacity-50"
                disabled={!user}
                onClick={() =>
                  setAmount((prev) => Math.max(prev - bidStep, min))
                }
              >
                -
              </button>
              <div className="flex items-center gap-1">
                <IconCoin className="w-5 h-5" />
                <input
                  className="bg-transparent outline-none text-center text-white text-xl font-semibold"
                  value={formattedAmount}
                  size={7}
                  onChange={(e) => {
                    const value = e.target.value.replace(/,/g, "");
                    if (!/^\d*\.?\d*$/.test(value)) return;
                    setAmount(value);
                  }}
                  onBlur={correctAmount}
                />
              </div>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center bg-black border border-white text-lg text-white transition duration-300 active:scale-95 disabled:opacity-50"
                disabled={!user}
                onClick={() => setAmount((prev) => prev + bidStep)}
              >
                +
              </button>
            </div>
            <button
              className="rounded-3xl bg-white w-[165px] h-[50px] font-medium transition duration-300 active:scale-95 disabled:opacity-50"
              disabled={!user}
              onClick={() => setOpenConfirmation(true)}
            >
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
      <BidConfirmation
        open={openConfirmation}
        amount={amount}
        close={() => setOpenConfirmation(false)}
      />
    </div>
  );
};

export default Home;
