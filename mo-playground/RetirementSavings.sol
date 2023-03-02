pragma solidity ^0.8.0;
import { LibDiamond } from "./libraries/LibDiamond.sol";


contract RetirementSavings {

    struct DiamondStorage {
        uint256 percentage;
        uint256 savedAmount;

    }

    function getStorage() DiamondStorage internal pure returns (DiamondStorage storage ds) {
        bytes32 position = keccak256("diamond.standard.retirementSavings");
        assembly {
            ds.slot := position
        }
    }

    function setPercentage(uint256 _percentage) public {
        LibDiamond.enforceIsContractOwner();
        DiamondStorage storage ds = getStorage();
        ds.percentage = _percentage;
    }
    

    
    function save() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        uint256 saveAmount = msg.value * percentage / 100;
        savedAmount += saveAmount;
    }
    
    function withdraw(address payable _recipient) public {
        LibDiamond.enforceIsContractOwner();
        _recipient.transfer(savedAmount);
        savedAmount = 0;
    }
}
