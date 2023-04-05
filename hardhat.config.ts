import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import { getPrivateKey } from "blockchain-key-manager";
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
        blockNumber: 128, // klaytn 은 128블록마다 최신 4개의 블록에 대해서 state 정보를 저장 -> 임의의 노드에서 정보를 저장하려면 노드를 archive node로 동작시켜야 함
        // https://forum.klaytn.foundation/t/balance/235
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
