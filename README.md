# Sample Hardhat Project for Klaytn(KIP7, Upgradeable contract, Kaikas wallet)

This project demonstrates a basic Hardhat use case **for Klaytn network**. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Plus, there is a simple frontend project which shows how to use Kaikas wallet API and connect Kaikas wallet. The project was created by `next.js`

## Deploy contract

Try running some of the following tasks:

```bash
npx hardhat help # for hardhat options
npx hardhat test # test contracts
REPORT_GAS=true npx hardhat test # test contracts and monitor gas fee
npx hardhat node # operate hardhat network(local blockchain net)
npx hardhat run scripts/deploy.ts --network localhost # deploy FsKlay token(upgradeable contract)
```

## Upgrade contract

check out `scripts/upgrade.ts`.

```typescript
import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const FsKlayFactoryV2 = await ethers.getContractFactory("FsKlayV2");
  console.log("Upgrading FsKlayV2...");
  await upgrades.upgradeProxy(
    "Address_of_previous_deployed_contract", // ex) 0xABcA2D7d71A7C8143b6b113B608997416c398123
    FsKlayFactoryV2
  );
  console.log("FsKlay upgraded");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

and run `scripts/upgrade.ts`

```bash
npx hardhat run scripts/upgrade.ts --network [localhost | baobab]
```

## Check how to connect Kaikas wallet in Chrome

It assumes that user has aleady installed the kaikas extension

```bash
cd frontend
yarn dev
```

To see more info about kaikas API, check [the docs](https://docs.kaikas.io/02_api_reference/01_klaytn_provider).

Here is more detailed [tutorial](https://github.com/klaytn/kaikas-tutorial)

> _Note_ : **This tutorial has been archived.** Instead, [this repository](https://github.com/klaytn/klaytn-online-toolkit) shows how to connect a kaikas provider with `@klaytn/kaikas-web3-provider`
