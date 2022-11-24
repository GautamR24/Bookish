require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.15",
  networks: {
    goerli: {
      url: process.env.REACT_APP_ALCHEMY_RPC,
      accounts: [process.env.REACT_APP_PRIVATE_KEY],
    }

  },
  etherscan: {
    apiKey: process.env.REACT_API_ETHER

  },
};
