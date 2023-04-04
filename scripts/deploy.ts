import { artifacts, ethers } from "hardhat";
import { formatEther } from "ethers/lib/utils";
import path from "path";
import fs from "fs";
import { FsKlay } from "../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const FsKlayToken = await ethers.getContractFactory("FsKlay");
  const FsKlay = await FsKlayToken.deploy();
  await FsKlay.deployed();

  console.log("FsKlay address:", FsKlay.address);
  saveFrontendFiles(FsKlay);
}

function saveFrontendFiles(token: FsKlay) {
  const contractsDir = path.join(__dirname, "..", "frontend", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ FsKlay: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("FsKlay");
  fs.writeFileSync(
    path.join(contractsDir, "FsKlay.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
