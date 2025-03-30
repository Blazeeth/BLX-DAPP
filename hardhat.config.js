require("dotenv").config(); // Load .env file

// Debugging log
console.log("Dotenv loaded:", process.env.SEPOLIA_RPC_URL !== undefined); // Check if .env is loaded

require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
