import "@nomicfoundation/hardhat-toolbox";
import { getAddress, getPrivateKey } from "blockchain-key-manager";
import { HardhatUserConfig } from "hardhat/types";

const EVM_VERSION = "london";
const GAS_LIMIT = 3000000;
const GAS_PRICE = 250000000000;

const deployerKey = getPrivateKey("fsklay-deployer")!!;

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 33137,
      gas: GAS_LIMIT,
      gasPrice: GAS_PRICE,
      hardfork: EVM_VERSION,
      forking: {
        url: "https://api.baobab.klaytn.net:8651/",
      },
    },
    baobab: {
      url: "https://baobab.ken.stick.us",
      gas: GAS_LIMIT,
      gasPrice: GAS_PRICE,
      hardfork: EVM_VERSION,
      accounts: [deployerKey],
    },
  },
  solidity: "0.8.18",
};

export default config;
