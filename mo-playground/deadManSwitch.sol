pragma solidity ^0.8.0;

contract DeadmanSwitch {
    address public owner;
    uint256 public lastCheckedIn;
    uint256 public timeout;
    address payable public recipient;
    
    constructor(uint256 _timeout, address payable _recipient) {
        owner = msg.sender;
        timeout = _timeout;
        recipient = _recipient;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
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
        recipient.transfer(address(this).balance);
    }
    
    function setRecipient(address payable _recipient) public onlyOwner {
        recipient = _recipient;
    }
}
