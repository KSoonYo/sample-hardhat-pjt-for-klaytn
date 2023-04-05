import { ethers, upgrades } from "hardhat";
// import path from "path";
// import fs from "fs";
// import { FsKlay } from "../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const FsKlayFactory = await ethers.getContractFactory("FsKlay");
  console.log("Deploying FsKlay...");
  const FsKlayMaster = await upgrades.deployProxy(FsKlayFactory, [], {
    initializer: "initialize",
  });
  await FsKlayMaster.deployed();
  console.log("FsKlayMaster deployed to: ", FsKlayMaster.address);
}

// function saveFrontendFiles(token: FsKlay) {
//   const contractsDir = path.join(__dirname, "..", "frontend", "contracts");

//   if (!fs.existsSync(contractsDir)) {
//     fs.mkdirSync(contractsDir);
//   }

//   fs.writeFileSync(
//     path.join(contractsDir, "contract-address.json"),
//     JSON.stringify({ FsKlay: token.address }, undefined, 2)
//   );

//   const TokenArtifact = artifacts.readArtifactSync("FsKlay");
//   fs.writeFileSync(
//     path.join(contractsDir, "FsKlay.json"),
//     JSON.stringify(TokenArtifact, null, 2)
//   );
// }

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
