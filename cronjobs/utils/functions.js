import { date } from './strings.js';

export const retry = async ({ name, action, maxRetry = 10 }) => {
  let retry = 0;
  let success = false;
  let data = null;
  while (retry < maxRetry && !success) {
    console.log(`========== ${name}, ${date()}, retry: ${retry} ==========`);
    try {
      retry++;
      data = await action();
      success = true;
      console.log(`========== SUCCESS ${name}, ${date()} ==========`);
    } catch (err) {
      console.log(`========== FAILED ${name}, ${date()}, error: ${err.message} ==========`);
      console.error(err);
    }
  }

  return { data, success };
};
