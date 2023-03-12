// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */
/* solhint-disable reason-string */

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {LibDiamond} from "../libraries/LibDiamond.sol";
import {IDiamondCut} from "../interfaces/IDiamondCut.sol";
import {IDiamondLoupe} from "../interfaces/IDiamondLoupe.sol";
import {IERC173} from "../interfaces/IERC173.sol";
import {IERC165} from "../interfaces/IERC165.sol";
import {BaseAccount} from "../base/BaseAccount.sol";
import {IEntryPoint} from "../interfaces/IEntryPoint.sol";
import {UserOperation} from "../interfaces/UserOperation.sol";
// When no function exists for function called
error FunctionNotFound(bytes4 _functionSelector);

/**
 *  This is a facet for a abstract contract account.
 *  has execute, eth handling methods
 *  has a single signer that can send requests through the entryPoint.
 *  is a Diamond account, so it can be upgraded.
 */
contract AccountFacet is BaseAccount {
    using ECDSA for bytes32;

    event SimpleAccountInitialized(
        IEntryPoint indexed entryPoint,
        address indexed owner
    );

    /// @inheritdoc BaseAccount
    function nonce() public view virtual override returns (uint256) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        return ds.nonce;
    }

    /**
     * execute a transaction (called by entryPoint)
     */
    function execute(
        address dest,
        uint256 value,
        bytes calldata func
    ) external {
        LibDiamond.enforceIsEntryPoint();

        // if the destination address is this contract (the diamond),
        // then we use the diamond function selector
        if (address(this) == dest) {
            LibDiamond.DiamondStorage storage ds;
            bytes32 position = LibDiamond.DIAMOND_STORAGE_POSITION;
            // get diamond storage
            assembly {
                ds.slot := position
            }
            // get facet from function selector
            bytes4 functionSig = bytes4(func[0:4]);

            address facet = ds
                .selectorToFacetAndPosition[functionSig]
                .facetAddress;
            require(facet != address(0), "Diamond: Function does not exist");
            (bool success, bytes memory data) = dest.delegatecall(func);
            require(success, "Diamond: Function call failed");
            return;
        } else {
            // Pre-execute functions

            _call(dest, value, func);

            // Post-execute functions
        }
    }

    /**
     * execute a sequence of transactions
     */
    function executeBatch(
        address[] calldata dest,
        bytes[] calldata func
    ) external {
        LibDiamond.enforceIsEntryPoint();
        require(dest.length == func.length, "wrong array lengths");
        for (uint256 i = 0; i < dest.length; i++) {
            _call(dest[i], 0, func[i]);
        }
    }

    /// implement template method of BaseAccount
    function _validateAndUpdateNonce(
        UserOperation calldata userOp
    ) internal override {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        require(ds.nonce++ == userOp.nonce, "account: invalid nonce");
    }

    /// implement template method of BaseAccount
    function _validateSignature(
        UserOperation calldata userOp,
        bytes32 userOpHash
    ) internal virtual override returns (uint256 validationData) {
        LibDiamond.DiamondStorage storage ds;
        bytes32 position = LibDiamond.DIAMOND_STORAGE_POSITION;
        // get diamond storage
        assembly {
            ds.slot := position
        }

        // check validation with Session facet
        bytes4 functionSelector = LibDiamond.getSelector(
            "sessionValidate((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes))"
        );
        address facet = ds
            .selectorToFacetAndPosition[functionSelector]
            .facetAddress;
        require(facet != address(0), "Diamond: Function does not exist");
        // Execute external function from facet using delegatecall and return any value.
        (bool success, bytes memory data) = facet.delegatecall(
            abi.encodeWithSignature("saveForRetirement()", userOp)
        );
        // decode output to bool
        bool isValid = abi.decode(data, (bool));
        // validationData is 0 if valid, 1 if invalid
        validationData = isValid ? 0 : 1;
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value: value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    function postRecieve() external payable {
        // recieve functions
        // call the saveForRetirment facet
        LibDiamond.DiamondStorage storage ds;
        bytes32 position = LibDiamond.DIAMOND_STORAGE_POSITION;
        // get diamond storage
        assembly {
            ds.slot := position
        }
        // get facet from function selector
        bytes4 functionSelector = LibDiamond.getSelector("saveForRetirement()");
        address facet = ds
            .selectorToFacetAndPosition[functionSelector]
            .facetAddress;
        require(facet != address(0), "Diamond: Function does not exist");
        // Execute external function from facet using delegatecall and return any value.
        (bool success, bytes memory result) = facet.delegatecall(
            abi.encodeWithSignature("saveForRetirement()")
        );
    }
}
