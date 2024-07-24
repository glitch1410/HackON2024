const hre = require("hardhat");
//0x5FbDB2315678afecb367f032d93F642f64180aa3
async function main() {
  const Donation = await hre.ethers.getContractFactory("Donation");
  const donation = await Donation.deploy();

  await donation.deployed();

  console.log(`Donation deployed to ${donation.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
