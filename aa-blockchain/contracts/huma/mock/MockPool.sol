// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "../HDT/interfaces/IHDT.sol";

contract MockPool {
    IHDT public HDT;
    uint256 public value;

    constructor(IHDT _HDT) {
        HDT = _HDT;
    }

    function setValue(uint256 _value) external {
        value = _value;
    }

    function totalPoolValue() external view returns (uint256) {
        return value;
    }

    function mintAmount(address account, uint256 amount) external returns (uint256 shares) {
        return HDT.mintAmount(account, amount);
    }

    function burnAmount(address account, uint256 amount) external returns (uint256 shares) {
        return HDT.burnAmount(account, amount);
    }
}
