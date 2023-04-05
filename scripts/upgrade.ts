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
    "0xCEf62C426Bed49b2cFa1f681bDcC8d28eaeeA2Fe",
    FsKlayFactoryV2
  );
  console.log("FsKlay upgraded");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
