// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */
/* solhint-disable reason-string */

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import { LibDiamond } from "./libraries/LibDiamond.sol";
import { IDiamondCut } from "./interfaces/IDiamondCut.sol";
import { IDiamondLoupe } from  "./interfaces/IDiamondLoupe.sol";
import { IERC173 } from "./interfaces/IERC173.sol";
import { IERC165} from "./interfaces/IERC165.sol";
import {BaseAccount} from "./BaseAccount.sol";
import {IEntryPoint} from "./interfaces/IEntryPoint.sol";
import {UserOperation} from "./interfaces/UserOperation.sol";
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

    //filler member, to push the nonce and owner to the same slot
    // the "Initializeble" class takes 2 bytes in the first slot
    // bytes28 private _filler;

    // //explicit sizes of nonce, to fit a single storage cell with "owner"
    // uint96 private _nonce;
    // address public owner;

    // IEntryPoint private immutable _entryPoint;

    event SimpleAccountInitialized(IEntryPoint indexed entryPoint, address indexed owner);


    /// @inheritdoc BaseAccount
    function nonce() public view virtual override returns (uint256) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        return ds.nonce;
    }

    


    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    
    /**
     * execute a transaction (called by entryPoint)
     */
    function execute(address dest, uint256 value, bytes calldata func) external {
        LibDiamond.enforceIsEntryPoint();

        // if the destination address is this contract (the diamond),
        // then we use the diamond function selector
        if ( address(this) == dest ){
            LibDiamond.DiamondStorage storage ds;
            bytes32 position = LibDiamond.DIAMOND_STORAGE_POSITION;
            // get diamond storage
            assembly {
                ds.slot := position
            }
            // get facet from function selector
            bytes4 functionSig = bytes4(func[0:4]);
    
            address facet = ds.selectorToFacetAndPosition[functionSig].facetAddress;
            require(facet != address(0), "Diamond: Function does not exist");
            (bool success, bytes memory data) = dest.delegatecall(func);
            require (success, "Diamond: Function call failed");
            return;
            
        }
        else {
            // Pre-execute functions

            _call(dest, value, func);

            // Post-execute functions

        }
    }

    /**
     * execute a sequence of transactions
     */
    function executeBatch(address[] calldata dest, bytes[] calldata func) external {
        LibDiamond.enforceIsEntryPoint();
        require(dest.length == func.length, "wrong array lengths");
        for (uint256 i = 0; i < dest.length; i++) {
            _call(dest[i], 0, func[i]);
        }
    }

    /**
     * @dev The _entryPoint member is immutable, to reduce gas consumption.  To upgrade EntryPoint,
     * a new implementation of SimpleAccount must be deployed with the new EntryPoint address, then upgrading
      * the implementation by calling `upgradeTo()`
     */
    // function initialize(address anOwner) public virtual initializer {
    //     _initialize(anOwner);
    // }

    // function _initialize(address anOwner) internal virtual {
    //     owner = anOwner;
    //     emit SimpleAccountInitialized(_entryPoint, owner);
    // }



    /// implement template method of BaseAccount
    function _validateAndUpdateNonce(UserOperation calldata userOp) internal override {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        require(ds.nonce++ == userOp.nonce, "account: invalid nonce");
    }

    /// implement template method of BaseAccount
    function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
    internal override virtual returns (uint256 validationData) {

        // TODO change this to a verification facet - NEVER VERIFIED
        // address verificationFacet;
        // verifationFacet.delegatecall(abicoder.encodeWithSignature("verify(address,bytes32,bytes)", userOp.signer, userOpHash, userOp.signature));



        return 1;
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value : value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    function postRecieve() external payable returns(uint) {
        // recieve functions
        return(2);

    }
    
}

