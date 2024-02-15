import { ethers } from "hardhat";

async function main() {
  const SaveEther = await ethers.deployContract("SaveEther");

  await SaveEther.waitForDeployment();

  console.log(` Save Ether  deployed to ${SaveEther.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
