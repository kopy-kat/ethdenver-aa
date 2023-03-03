// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/******************************************************************************\
* Author: Nick Mudge <nick@perfectabstractions.com> (https://twitter.com/mudgen)
* EIP-2535 Diamonds: https://eips.ethereum.org/EIPS/eip-2535
*
* Implementation of a diamond.
/******************************************************************************/

import { LibDiamond } from "./libraries/LibDiamond.sol";
import { IDiamondCut } from "./interfaces/IDiamondCut.sol";
import {IEntryPoint} from "./interfaces/IEntryPoint.sol";
import { IDiamondLoupe } from  "./interfaces/IDiamondLoupe.sol";
import { IERC173 } from "./interfaces/IERC173.sol";
import {AccountFacet} from "./AccountFacet.sol";
import { IERC165} from "./interfaces/IERC165.sol";
import {IAccount} from "./interfaces/IAccount.sol";

// When no function exists for function called
error FunctionNotFound(bytes4 _functionSelector);


contract Diamond {    

    

    constructor(address _diamondCutFacet, address _accountFacet, IEntryPoint entryPoint) payable {        
        
        // set the entry point 
        LibDiamond.setEntryPoint(entryPoint);

        // Add the diamondCut external function from the diamondCutFacet
        IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](2);
        bytes4[] memory diamondCutFunctionSelectors = new bytes4[](1);
        diamondCutFunctionSelectors[0] = IDiamondCut.diamondCut.selector;
        cut[0] = IDiamondCut.FacetCut({
            facetAddress: _diamondCutFacet, 
            action: IDiamondCut.FacetCutAction.Add, 
            functionSelectors: diamondCutFunctionSelectors
        });

        // Add the account facet functions
        // We want execute (Doesn't support batch execute), nonce, validateUserOp
        bytes4[] memory accountFunctionSelectors = new bytes4[](4);
        accountFunctionSelectors[0] = AccountFacet.execute.selector;
        accountFunctionSelectors[1] = IAccount.validateUserOp.selector;
        accountFunctionSelectors[2] = AccountFacet.nonce.selector;
        accountFunctionSelectors[3] = AccountFacet.postRecieve.selector;

        cut[1] = IDiamondCut.FacetCut({
            facetAddress: _accountFacet,
            action: IDiamondCut.FacetCutAction.Add,
            functionSelectors: accountFunctionSelectors
        });
 



        LibDiamond.diamondCut(cut, address(0), "");        
    }

    // Find facet for function that is called and execute the
    // function if a facet is found and return any value.
    fallback() external payable {
        // make sure is being called by entry point
        LibDiamond.enforceIsEntryPoint();
        LibDiamond.DiamondStorage storage ds;
        bytes32 position = LibDiamond.DIAMOND_STORAGE_POSITION;
        // get diamond storage
        assembly {
            ds.slot := position
        }
        // get facet from function selector
        address facet = ds.selectorToFacetAndPosition[msg.sig].facetAddress;
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

    receive() external payable {
        
        LibDiamond.DiamondStorage storage ds;
        bytes32 position = LibDiamond.DIAMOND_STORAGE_POSITION;
        // get diamond storage
        assembly {
            ds.slot := position
        }
        // get facet from function selector
        bytes4 functionSelector = LibDiamond.getSelector("postRecieve()");
        address facet = ds.selectorToFacetAndPosition[functionSelector].facetAddress;
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