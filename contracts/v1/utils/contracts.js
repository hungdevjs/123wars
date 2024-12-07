const { run } = require("hardhat");

const verifyContract = async ({ address, constructorArguments }) => {
  await run("verify:verify", {
    address,
    constructorArguments,
  });
};

module.exports = { verifyContract };
