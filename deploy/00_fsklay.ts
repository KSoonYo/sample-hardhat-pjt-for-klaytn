import { ethers, network } from "hardhat";
import { formatEther } from "ethers/lib/utils";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const FsKlay = await ethers.getContractFactory("FsKlay");
  const deployed = await FsKlay.deploy();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
