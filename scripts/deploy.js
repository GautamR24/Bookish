// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
//contract address = 0xe1D37698dCc19b9dc495bb4747BA3a15b89e7DCA
//owner= 0x4CD0d36592c28cB218D3C59ba92328aff59908De
const hre = require('hardhat')
require('@nomiclabs/hardhat-ethers')

async function main () {
  const [owner] = await hre.ethers.getSigners();
  const bookContract = await hre.ethers.getContractFactory('bookStore');
  const bookContract_deloyed = await bookContract.deploy();
  await bookContract_deloyed.deployed();
  console.log('nft deployed at', bookContract_deloyed.address);
  console.log('owner', owner.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
