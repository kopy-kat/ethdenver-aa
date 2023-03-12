require("@nomicfoundation/hardhat-toolbox");
// Use dotenv to load .env file
require("dotenv").config();

require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");


const tenderleySepoliaURL = process.env.TENDERLY_SEPOLIA_URL;
const privateKey = process.env.PRIVATE_KEY;

var tdly = require("@tenderly/hardhat-tenderly");
tdly.setup({ automaticVerifications: true });



/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  zksolc: {
    version: "1.3.1",
    compilerSource: "binary",
    settings: {},
  },
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: 'https://sepolia.infura.io/v3/60d15abdd3d1425183c4104791d5e455',
      // this will allow us to use our private key for signing TX later
      accounts: [privateKey],
      chainId: 11155111,
      zksync: false
    },
    goerli: {
      url: "https://goerli.gateway.tenderly.co/561wF5ge7J9vKtwL9cBf6N",
      accounts: [privateKey],
      chainId: 5,
      zksync: false
    },

    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/60d15abdd3d1425183c4104791d5e455",
      accounts: [privateKey],
      chainId: 80001,
      zksync: false
    },
    base_goerli: {
      url: "https://goerli.base.org",
      accounts: [privateKey],
      chainId: 84531,
      zksync: false
    },
    zkSyncTestnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "goerli", 
      zksync: true,
      accounts: [privateKey],
    },
    scroll_alpha: {
      url: "https://alpha-rpc.scroll.io/l2" || "",
      accounts: [privateKey],
      chainId: 534353,
      zksync: false
    },
  },


  tenderly: {
    // replace with project slug in Tenderly
    project: "project",

    // replace with your Tenderly username
    username: "AbstractorOllie",

    // perform contract verification in private mode
    privateVerification: true,
  }
};



