// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
//contract address = 0x3e14448Bf6702C05f09062a5AEb9193c40C814aD,0xE509428aA3da9DB3B53D86353A92993E0784CD1c,
// 0x6C706de318d0270955eDB166388fc8d4d5A6af56
// 0x3b5f49C3370E38Ce54568EFa47337B876014958e
// 0x0Bb51954001f042c1FEe22266d632a333e5aD0Ac
//0xB2B9B2918Be753d894D41821c230dc7f74cd4Ac2(current)
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
