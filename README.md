# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```bash
npx hardhat help # for hardhat options
npx hardhat test # test contracts
REPORT_GAS=true npx hardhat test # test contracts and monitor gas fee
npx hardhat node # operate hardhat network(local blockchain net)
npx hardhat run scripts/deploy.ts --network localhost # deploy FsKlay token(upgradeable contract)
```

## To upgrade contract

In `scripts/upgrade.ts`, copy and paste this script.

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
