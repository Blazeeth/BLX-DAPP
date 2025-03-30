const hre = require("hardhat");

async function main() {
  const MoneyTransfer = await hre.ethers.getContractFactory("MoneyTransfer");
  const moneyTransfer = await MoneyTransfer.deploy();
  await moneyTransfer.waitForDeployment();
  console.log("Contract deployed to:", moneyTransfer.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});