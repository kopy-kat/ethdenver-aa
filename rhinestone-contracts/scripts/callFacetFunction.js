// get hardhat ethers
// require("@nomiclabs/hardhat-ethers");

const { getSelectors, FacetCutAction } = require('./libraries/diamond.js')

const diamondAddress = '0xDA0bab807633f07f013f94DD0E6A4F96F8742B53'
const retirementAddress = '0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3'
const retirmentPercent = 5

async function updateRetirementSettings(retirementAddress, retirementPercent, diamondAddress) {
    const retirementFacet = await ethers.getContractAt('RetirementSavings', diamondAddress)
    const tx = await retirementFacet.populateTransaction.setRetirementValues(retirementPercent, retirementAddress)
    return tx.data
}



(async () => {
    console.log(await updateRetirementSettings('0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', 50, '0xcD6a42782d230D7c13A74ddec5dD140e55499Df9'))
  })()
