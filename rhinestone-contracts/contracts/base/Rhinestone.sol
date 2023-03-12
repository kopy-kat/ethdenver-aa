// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import {LibRhinestone} from "../libraries/LibRhinestone.sol";
import {IDiamondCut} from "../interfaces/IDiamondCut.sol";
import {IEntryPoint} from "../interfaces/IEntryPoint.sol";
import {BaseAccount} from "./BaseAccount.sol";
import {UserOperation} from "../interfaces/UserOperation.sol";

// When no function exists for function called
error FunctionNotFound(bytes4 _functionSelector);

/**
 * @title rhinestone - a rhinestone account
 * @author Konrad Kopp - @konradkopp
 * @dev version 0.0.1 - do not use in production
 */
contract Rhinestone is BaseAccount {
    /// @inheritdoc BaseAccount
    function nonce() public view virtual override returns (uint256) {
        LibRhinestone.RhinestoneStorage storage rs = LibRhinestone
            .rhinestoneStorage();
        return rs.nonce;
    }

    /// @inheritdoc BaseAccount
    function entryPoint() public view virtual override returns (IEntryPoint) {
        LibRhinestone.RhinestoneStorage storage rs = LibRhinestone
            .rhinestoneStorage();
        return rs.entryPoint;
    }

    function _setEntryPoint(IEntryPoint _entryPoint) internal {
        LibRhinestone.RhinestoneStorage storage rs = LibRhinestone
            .rhinestoneStorage();
        rs.entryPoint = _entryPoint;
    }

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    function _onlyOwner() internal view {
        //directly from the account itself
        require(msg.sender == address(this), "only owner");
    }

    constructor(address _diamondCutFacet, IEntryPoint entryPoint) payable {
        // set the entry point
        _setEntryPoint(entryPoint);

        // Add the diamondCut external function from the diamondCutFacet
        IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](2);
        bytes4[] memory diamondCutFunctionSelectors = new bytes4[](1);
        diamondCutFunctionSelectors[0] = IDiamondCut.diamondCut.selector;
        cut[0] = IDiamondCut.FacetCut({
            facetAddress: _diamondCutFacet,
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: diamondCutFunctionSelectors
        });

        LibRhinestone.diamondCut(cut, address(0), "");
    }

    /**
     * execute a transaction (called by entryPoint)
     */
    function execute(
        address dest,
        uint256 value,
        bytes calldata func
    ) external {
        LibRhinestone.enforceIsEntryPoint();
        _execute(dest, value, func);
    }

    /**
     * execute a sequence of transactions
     */
    function executeBatch(
        address[] calldata dest,
        bytes[] calldata func
    ) external {
        LibRhinestone.enforceIsEntryPoint();
        require(dest.length == func.length, "wrong array lengths");
        for (uint256 i = 0; i < dest.length; i++) {
            _execute(dest[i], 0, func[i]);
        }
    }

    function _execute(
        address dest,
        uint256 value,
        bytes calldata func
    ) internal {
        LibRhinestone.enforceIsEntryPoint();
        require(_preExecutePlugins(), "preExecutePlugins failed");

        // if the destination address is this contract (the diamond),
        // then we use the diamond function selector
        if (address(this) == dest) {
            LibRhinestone.RhinestoneStorage storage rs;
            bytes32 position = LibRhinestone.RHINESTONE_STORAGE_POSITION;
            // get diamond storage
            assembly {
                rs.slot := position
            }
            // get facet from function selector
            bytes4 functionSig = bytes4(func[0:4]);

            address facet = rs
                .selectorToFacetAndPosition[functionSig]
                .facetAddress;
            require(facet != address(0), "Diamond: Function does not exist");
            (bool success, bytes memory data) = dest.delegatecall(func);
            require(success, "Diamond: Function call failed");
            return;
        } else {
            _call(dest, value, func);
        }
        _postExecutePlugins();
    }

    function _preExecutePlugins() internal returns (bool) {
        return true;
    }

    function _postExecutePlugins() internal {}

    /// implement template method of BaseAccount
    function _validateAndUpdateNonce(
        UserOperation calldata userOp
    ) internal override {
        LibRhinestone.RhinestoneStorage storage rs = LibRhinestone
            .rhinestoneStorage();
        require(rs.nonce++ == userOp.nonce, "account: invalid nonce");
    }

    /// implement template method of BaseAccount
    function _validateSignature(
        UserOperation calldata userOp,
        bytes32 userOpHash
    ) internal virtual override returns (uint256 validationData) {
        bool validationResult = _validatePlugins();
        if (!validationResult) {
            return 1;
        }
        return 0;
    }

    function _validatePlugins() internal view returns (bool) {
        return true;
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value: value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    receive() external payable {
        require(_preReceivePlugins(), "preReceivePlugins failed");
        _postReceivePlugins();
    }

    function _preReceivePlugins() internal returns (bool) {
        return true;
    }

    function _postReceivePlugins() internal {}

    function _addPlugin() internal {}

    function _removePlugin() internal {}

    receive() external payable {
        LibRhinestone.RhinestoneStorage storage rs;
        bytes32 position = LibRhinestone.RHINESTONE_STORAGE_POSITION;
        // get diamond storage
        assembly {
            rs.slot := position
        }
        // get facet from function selector
        bytes4 functionSelector = LibRhinestone.getSelector("postRecieve()");
        address facet = rs
            .selectorToFacetAndPosition[functionSelector]
            .facetAddress;
        require(facet != address(0), "Diamond: Function does not exist");
        // Execute external function from facet using delegatecall and return any value.
        (bool success, bytes memory result) = facet.delegatecall(
            abi.encodeWithSignature("postRecieve()")
        );
    }

    // Find facet for function that is called and execute the
    // function if a facet is found and return any value.
    fallback() external payable {
        // make sure is being called by entry point
        LibRhinestone.enforceIsEntryPoint();
        LibRhinestone.RhinestoneStorage storage rs;
        bytes32 position = LibRhinestone.RHINESTONE_STORAGE_POSITION;
        // get diamond storage
        assembly {
            rs.slot := position
        }
        // get facet from function selector
        address facet = rs.selectorToFacetAndPosition[msg.sig].facetAddress;
        require(facet != address(0), "Diamond: Function does not exist");
        // Execute external function from facet using delegatecall and return any value.
        assembly {
            // copy function selector and any arguments
            calldatacopy(0, 0, calldatasize())
            // execute function call using the facet
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
            // get any return value
            returndatacopy(0, 0, returndatasize())
            // return any return value or error back to the caller
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
}
