pragma solidity ^0.8.0;

contract DeadMansSwitch {
    address public owner;
    uint256 public lastCheckedIn;
    uint256 public timeout;
    address payable public recipient = 0x15656be2D537D51BA61dAEb70bfBEaE7ae686342;
    
    constructor(uint256 _timeout) {
        owner = msg.sender;
        timeout = _timeout;
    }
    
    function checkIn() public {
        require(msg.sender == owner, "Only the owner can check in");
        lastCheckedIn = block.timestamp;
    }
    
    function isTriggered() public view returns (bool) {
        return block.timestamp > lastCheckedIn + timeout;
    }
    
    function trigger() public {
        require(isTriggered(), "Switch has not been triggered");
        // Transer money to Ponzi.vc
        recipient.transfer(address(this).balance);
    }
}
