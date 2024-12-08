import cron from "node-cron";

import { crawRoundData } from "./services/round.service.js";
import environments from "./utils/environments.js";

const { CRON_CRAW_ROUND_DATA } = environments;

const main = () => {
  if (CRON_CRAW_ROUND_DATA) {
    console.log("1. init job crawRoundData");
    crawRoundData().catch((err) => console.error(err));
    cron.schedule(CRON_CRAW_ROUND_DATA, crawRoundData);
  }
};

main();
