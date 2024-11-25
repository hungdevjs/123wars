const { run } = require('hardhat');

const verifyContract = async ({ address, constructorArguments }) => {
  try {
    await run('verify:verify', {
      address,
      constructorArguments,
    });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = { verifyContract };
