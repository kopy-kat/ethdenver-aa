require("@nomicfoundation/hardhat-toolbox");
// Use dotenv to load .env file
require("dotenv").config();

const tenderleySepoliaURL = process.env.TENDERLY_SEPOLIA_URL;
const privateKey = process.env.PRIVATE_KEY;



/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: tenderleySepoliaURL,
      // this will allow us to use our private key for signing TX later
      accounts: [privateKey],
      chainId: 11155111
     },
     mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/60d15abdd3d1425183c4104791d5e455",
      accounts: [privateKey],
      chainId: 80001
    },
    base_goerli: {
      url: "https://goerli.base.org",
      accounts: [privateKey],
      chainId: 84531
  },
  zksync_goreli: {
    url: "https://zksync2-testnet.zksync.dev",
    accounts: [privateKey],
    chaind: 280
  },
  scroll_alpha: {
    url: "https://alpha-rpc.scroll.io/l2" || "",
    accounts: [privateKey],
    chainId: 534353,
  },
  }
};


