// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import {LibDiamond} from "../libraries/LibDiamond.sol";

contract DeadmanSwitch {
    struct DiamondStorage {
        uint256 lastCheckedIn;
        uint256 timeout;
        address payable recipient;
    }

    function getStorage() internal pure returns (DiamondStorage storage ds) {
        bytes32 position = keccak256("diamond.standard.deadmanswitch");
        assembly {
            ds.slot := position
        }
    }

    function setDeadmanSwitch(
        uint256 _timeout,
        address payable _recipient
    ) public {
        LibDiamond.enforceIsEntryPoint();
        DiamondStorage storage ds = getStorage();
        ds.timeout = _timeout;
        ds.recipient = _recipient;
    }

    function checkIn() public {
        LibDiamond.enforceIsEntryPoint();
        DiamondStorage storage ds = getStorage();
        ds.lastCheckedIn = block.timestamp;
    }

    function isTriggered() public view returns (bool) {
        DiamondStorage storage ds = getStorage();
        return block.timestamp > ds.lastCheckedIn + ds.timeout;
    }

    function trigger() public {
        require(isTriggered(), "Switch has not been triggered");
        DiamondStorage storage ds = getStorage();
        // Transfer all the ETH at this address.
        // Future work will do this for all ERC-20 tokens.
        ds.recipient.transfer(address(this).balance);
    }
}
