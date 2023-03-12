// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import {UserOperation} from "../interfaces/UserOperation.sol";
import {LibDiamond} from "../libraries/LibDiamond.sol";

contract Session {
    struct DiamondStorage {
        uint256 expiryTimestamp;
        bytes4 allowedFunctionSignature;
        uint256 maxCallGasLimit;
        uint256 maxMaxFeePerGas;
        uint256 maxMaxPriorityFeePerGas;
    }

    function getStorage() internal pure returns (DiamondStorage storage ds) {
        bytes32 position = keccak256("diamond.standard.session");
        assembly {
            ds.slot := position
        }
    }

    function startSession(
        uint256 _expiryTimestamp,
        bytes4 _allowedFunctionSignature,
        uint256 _maxCallGasLimit,
        uint256 _maxMaxFeePerGas,
        uint256 _maxMaxPriorityFeePerGas
    ) public {
        LibDiamond.enforceIsEntryPoint();
        DiamondStorage storage ds = getStorage();
        ds.expiryTimestamp = _expiryTimestamp;
        ds.allowedFunctionSignature = _allowedFunctionSignature;
        ds.maxCallGasLimit = _maxCallGasLimit;
        ds.maxMaxFeePerGas = _maxMaxFeePerGas;
        ds.maxMaxPriorityFeePerGas = _maxMaxPriorityFeePerGas;
    }

    function sessionValidate(
        UserOperation calldata userOperation
    ) public view returns (bool) {
        DiamondStorage storage ds = getStorage();
        if (ds.expiryTimestamp < block.timestamp) {
            // no active sessions. accept
            return true;
        }

        return
            bytes4(userOperation.callData[0:4]) ==
            ds.allowedFunctionSignature &&
            userOperation.callGasLimit <= ds.maxCallGasLimit &&
            userOperation.maxFeePerGas <= ds.maxMaxFeePerGas &&
            userOperation.maxPriorityFeePerGas <= ds.maxMaxPriorityFeePerGas;
    }
}
