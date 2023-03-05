//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../BasePool.sol";
import "../BaseCreditPoolStorage.sol";
import "../Errors.sol";

contract MockBaseCreditPoolV2 is BasePool, BaseCreditPoolStorage {
    function changeCreditLine(address borrower, uint256 newLine) external {
        _protocolAndPoolOn();
        onlyEAServiceAccount();
        // Borrowing amount needs to be lower than max for the pool.
        if (newLine > _poolConfig.maxCreditLine()) revert Errors.creditLineGreatThanUpperLimit();
        _creditRecordStaticMapping[borrower].creditLimit = uint96(newLine * 2);
    }

    function getCreditLine(address account) external view returns (uint256) {
        return _creditRecordStaticMapping[account].creditLimit;
    }

    function creditRecordMapping(address account) external view returns (BS.CreditRecord memory) {
        return _creditRecordMapping[account];
    }

    function onlyEAServiceAccount() internal view {
        if (msg.sender != HumaConfig(_humaConfig).eaServiceAccount())
            revert Errors.evaluationAgentServiceAccountRequired();
    }
}
