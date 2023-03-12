// get hardhat ethers
// require("@nomiclabs/hardhat-ethers");

const { getSelectors, FacetCutAction } = require('./libraries/diamond.js')


async function createFacetAddCallData(facetAddress, facetName, diamondAddress) {
    // const accounts = await ethers.getSigners()
    // const contractOwner = accounts[0]
    // create ethers Contract object for facet
    const facet = await ethers.getContractAt(facetName, facetAddress)
    // get selectors for facet
    // deploy DiamondLoupeFacet
    const cut = []
    cut.push({
        facetAddress: facet.address,
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(facet)
      })
    console.log(getSelectors(facet))
    // get the raw call date for call to diamondCut
    const diamondCut = await ethers.getContractAt('DiamondCutFacet', diamondAddress)
    const tx = await diamondCut.populateTransaction.diamondCut(cut, ethers.constants.AddressZero, '0x')
    return tx.data


}

(async () => {
    console.log(await createFacetAddCallData('0xf8e81D47203A594245E36C48e151709F0C19fBe8', 'RetirementSavings','0xcD6a42782d230D7c13A74ddec5dD140e55499Df9' ))
  })()
