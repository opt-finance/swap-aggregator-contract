require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.23",
        settings: {
          optimizer: {
            enabled: true,
            runs: 2 ** 32 - 1
          }
        }
      },
    ],
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      forking: {
        enabled: true,
        url: "https://api.wemix.com",
        maxFeePerGas: 100 * 10 ** 9 + 1,
        maxPriorityFeePerGas: 100 * 10 ** 9,
      },
    },
  },
};
