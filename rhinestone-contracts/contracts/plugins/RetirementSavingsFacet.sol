// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import {LibDiamond} from "../libraries/LibDiamond.sol";

contract RetirementSavingsFacet {
    struct DiamondStorage {
        uint256 percentage;
        uint256 savedAmount;
        address payable retirementAddress;
    }

    function getStorage() internal pure returns (DiamondStorage storage ds) {
        bytes32 position = keccak256("diamond.standard.retirementSavings");
        assembly {
            ds.slot := position
        }
    }

    function setRetirementValues(
        uint256 _percentage,
        address payable retirementAddress
    ) public {
        LibDiamond.enforceIsEntryPoint();
        DiamondStorage storage ds = getStorage();
        ds.percentage = _percentage;
        ds.retirementAddress = retirementAddress;
    }

    function saveForRetirement() external payable {
        // don't think this is needed anyway
        DiamondStorage storage ds = getStorage();
        require(msg.value > 0, "Amount must be greater than 0");
        require(
            ds.retirementAddress != address(0),
            "Retirement address must be set."
        );
        uint256 saveAmount = (msg.value * ds.percentage) / 100;
        ds.retirementAddress.transfer(saveAmount);
        ds.savedAmount += saveAmount;
    }
}
