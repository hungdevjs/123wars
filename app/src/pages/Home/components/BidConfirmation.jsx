import { useState, useEffect } from "react";

import { IconClose, IconCoin } from "../../../components/Icons";
import TransactionStatus from "../../../components/TransactionStatus";
import useDollarAuction from "../../../hooks/useDollarAuction";
import { validateTransaction } from "../../../services/user.service";

const BidConfirmation = ({ open, amount, close }) => {
  const [status, setStatus] = useState({
    status: "idle",
    value: "",
  });
  const { bid } = useDollarAuction();

  const confirm = async () => {
    setStatus({ status: "loading", value: "" });

    try {
      const transactionHash = await bid({ amount: Number(amount) });
      // await validateTransaction({ transactionHash });
      setStatus({
        status: "success",
        value: "Bid successful",
        transactionHash,
      });
    } catch (err) {
      console.error(err);
      setStatus({ status: "error", value: err.message });
    }
  };

  useEffect(() => {
    if (!open) {
      setStatus({ status: "idle", value: "" });
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 w-svw h-svh bg-black bg-opacity-70 flex items-center justify-center">
      <div className="relative bg-white rounded-xl p-4 min-w-[320px] max-w-[80%] flex flex-col items-center gap-2">
        {status.status !== "loading" && (
          <div
            className="absolute top-[16px] right-[16px] cursor-pointer"
            onClick={close}
          >
            <IconClose className="w-5 h-5" />
          </div>
        )}
        <div className="flex items-center justify-center">
          <p className="text-xs font-medium">CONFIRMATION</p>
        </div>
        <div className="flex items-center justify-center gap-1">
          <p className="text-lg font-semibold">
            Bid with {amount.toLocaleString()}
          </p>
          <IconCoin className="w-5 h-5" />
        </div>
        <TransactionStatus status={status} />
        <div className="w-full">
          <button
            type="button"
            className="w-full justify-center rounded-xl bg-black px-3 py-2 font-semibold text-white transition duration-300 active:scale-95 disabled:opacity-50"
            disabled={["loading", "success"].includes(status.status)}
            onClick={confirm}
          >
            {status.status === "loading" ? "SUBMITTING" : `BID`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BidConfirmation;
