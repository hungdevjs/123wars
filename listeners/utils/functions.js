import { date } from './strings.js';

export const retry = async ({ name, action, maxRetry = 10 }) => {
  let retry = 0;
  let success = false;
  while (retry < maxRetry && !success) {
    console.log(`========== ${name}, ${date()}, retry: ${retry} ==========`);
    try {
      retry++;
      await action();
      success = true;
      console.log(`========== SUCCESS ${name}, ${date()} ==========`);
    } catch (err) {
      console.log(`========== FAILED ${name}, ${date()}, error: ${err.message} ==========`);
      console.error(err);
    }
  }

  return { success };
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
