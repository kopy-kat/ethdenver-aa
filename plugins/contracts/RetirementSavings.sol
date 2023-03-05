/// @title RetirementSavings
/// @notice This contract allows users to save a percentage of their funds towards retirement savings
/// @dev This contract uses the Diamond standard library to enable modular and upgradeable contracts.
pragma solidity ^0.8.0;
import { LibDiamond } from "./libraries/LibDiamond.sol";


contract RetirementSavings {

    struct DiamondStorage {
        /// @notice Struct to store the percentage, savedAmount, and retirementAccount of funds
        uint256 percentage;
        uint256 savedAmount;
        address retirementAccount;
        

    }

    /// @dev Function to retrieve the DiamondStorage struct from storage
    function getStorage() DiamondStorage internal pure returns (DiamondStorage storage ds) {
        bytes32 position = keccak256("diamond.standard.retirementSavings");
        assembly {
            ds.slot := position
        }
    }

    /// @notice Set the percentage of funds that should be saved towards retirement and the retirement account to save to
    /// @param _percentage The percentage of funds to save
    /// @param retirementAddress The address to save the funds to
    function setRetirementValues(uint256 _percentage, address retirementAddress) public {
        LibDiamond.enforceIsEntryPoint();
        DiamondStorage storage ds = getStorage();
        ds.percentage = _percentage;
        ds.retirementAddress = retirementAddress;
    }
    
    /// @notice Save funds towards retirement
    function save() external payable {
        // don't think this is needed anyway 
        LibDiamond.enforceIsEntryPoint();
        DiamondStorage storage ds = getStorage();
        require(msg.value > 0, "Amount must be greater than 0");
        require(ds.retirementAddress != 0, "Retirement address must be set.");
        uint256 saveAmount = msg.value * percentage / 100;
        ds.retirementAddress.transfer(saveAmount);
        ds.savedAmount += saveAmount;
    }
    
    
}
