pragma solidity ^0.8.0;
import { UserOperation } from "../interfaces/UserOperation.sol";
import { LibDiamond } from "../libraries/LibDiamond.sol";
import { BaseCreditPool } from "../huma";


contract Session {

    struct DiamondStorage {
        address creditLinePoolAddress;
    }

    function getStorage() internal pure returns (DiamondStorage storage ds) {
        bytes32 position = keccak256("diamond.standard.session");
        assembly {
            ds.slot := position
        }
    }

    function setCreditLinePoolAddress(address _creditLinePoolAddress) {
        LibDiamond.enforceIsEntryPoint();
        DiamondStorage storage ds = getStorage();
        ds.creditLinePoolAddress = _creditLinePoolAddress;
    }

    function requestCredit(uint256 creditLimit, uint256 intervalInSeconds, uint256 numOfPayments) public {
        LibDiamond.enforceIsEntryPoint();
        DiamondStorage storage ds = getStorage();

        BaseCreditPool(ds.creditLinePoolAddress).requestCredit(creditLimit, intervalInSeconds, numOfPayments);
    }

    function makePayment(uint256 amount) public returns (uint256, bool) {
        return BaseCreditPool(ds.creditLinePoolAddress).makePayment(address(this), amount);
    }

    function drawdown(uint256 borrowAmount) public {
        BaseCreditPool(ds.creditLinePoolAddress).requestCredit(address(this), borrowAmount);
    }

}
