/* global ethers */
/* eslint prefer-const: "off" */

const { getSelectors, FacetCutAction } = require('./libraries/diamond.js')


async function deployDiamond () {
  const accounts = await ethers.getSigners()
  const contractOwner = accounts[0]
  const retirementAddress = accounts[0].address
  const retirementPercent = 5

  // Fixed entrypoint address, same for all networks
  // but for testing purposes we use our own address
  const entryPointAddress = contractOwner.address

  // deploy DiamondLibrary
  const LibDiamond = await ethers.getContractFactory('LibDiamond')
  const libDiamond = await LibDiamond.deploy()
  await libDiamond.deployed()
  console.log('LibDiamond deployed:', libDiamond.address)

  // deploy DiamondCutFacet
  const DiamondCutFacet = await ethers.getContractFactory('DiamondCutFacet')
  const diamondCutFacet = await DiamondCutFacet.deploy()
  await diamondCutFacet.deployed()
  console.log('DiamondCutFacet deployed:', diamondCutFacet.address)

  // deploy AccountFacet
  const AccountFacet = await ethers.getContractFactory('AccountFacet', {
    libraries: {
      LibDiamond: libDiamond.address
      } 
    })
  const accountFacet = await AccountFacet.deploy()
  await accountFacet.deployed()
  console.log('AccountFacet deployed:', accountFacet.address)

  // deploy Diamond and link DiamondLibrary
  const Diamond = await ethers.getContractFactory('Diamond', {
    libraries: {
      LibDiamond: libDiamond.address
    }
  })
  const diamond = await Diamond.deploy(diamondCutFacet.address, accountFacet.address, entryPointAddress)
  await diamond.deployed()
  console.log('DiamondAccount deployed:', diamond.address)

  // deploy facets
  console.log('')
  console.log('Deploying facets')
  const FacetNames = [
    'DiamondLoupeFacet',
    'RetirementSavingsFacet',

  ]

  const cut = []
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName)
    const facet = await Facet.deploy()
    await facet.deployed()
    console.log(`${FacetName} deployed: ${facet.address}`)
    cut.push({
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet)
    })
  }

  // upgrade diamond with facets
  console.log('')
  console.log('Diamond Cut:', cut)
  const diamondCut = await ethers.getContractAt('IDiamondCut', diamond.address)
  let tx
  let receipt

  // We're not using an init function
  tx = await diamondCut.diamondCut(cut, ethers.constants.AddressZero, '0x')
  console.log('Diamond cut tx: ', tx.hash)
  receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`)
  }
  console.log('Completed diamond cut')

   // change the retirement savings address
  const retirementSavingsFacet = await ethers.getContractAt('RetirementSavingsFacet', diamond.address)
  tx = await retirementSavingsFacet.setRetirementValues(retirementPercent, retirementAddress)
  console.log("Completed setting retirement address and percent: ", tx.hash)
  recipet = await tx.wait()
  if (!receipt.status) {
    throw Error(`Retirement settings update failed: ${tx.hash}`)
  }
  
  return diamond.address

 
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deployDiamond()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

exports.deployDiamond = deployDiamond