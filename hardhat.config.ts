import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "dotenv/config";
import { getPrivateKey } from "blockchain-key-manager";
import { HardhatUserConfig } from "hardhat/types";

const EVM_VERSION = "london";
const GAS_LIMIT = 3000000;
const GAS_PRICE = 250000000000;

const deployerKey = getPrivateKey("fsklay-deployer")!!;

const config: HardhatUserConfig = {
  networks: {
    // hardhat network 설정: klaytn baobab testnet을 forking
    // hardhat test 시 forking한 baobab network를 기반으로 테스트 실행
    hardhat: {
      chainId: 33137,
      gas: GAS_LIMIT,
      gasPrice: GAS_PRICE,
      hardfork: EVM_VERSION,
      forking: {
        url: process.env.PUBLIC_RPC_URL!!,
        // klaytn 은 128블록마다 최신 4개의 블록에 대해서 state 정보를 저장 -> 임의의 노드에서 저장된 정보를 조회하려면 노드를 archive node로 동작시켜야 함
        // https://forum.klaytn.foundation/t/balance/235
        blockNumber: 128,
      },
    },

    // baobab testnet 설정
    baobab: {
      url: process.env.BAOBAB_RPC_URL!!,
      gas: GAS_LIMIT,
      gasPrice: GAS_PRICE,
      hardfork: EVM_VERSION,
      accounts: [deployerKey],
    },
  },
  solidity: "0.8.18",
};

export default config;
