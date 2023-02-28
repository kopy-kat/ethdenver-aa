pragma solidity ^0.8.0;

contract Donations {
    uint256 public totalReceived;
    uint256 public totalSpent;
    uint256 public lastCheckTime;
    
    // Add modifier instead of a hard-coded address
    address payable public recipient = 0x15656be2D537D51BA61dAEb70bfBEaE7ae686342;
    
    function receive() external payable {
        totalReceived += msg.value;
    }
    
    function spend(uint256 amount) external {
        totalSpent += amount;
    }
    
    function donate() external {
        require(block.timestamp >= lastCheckTime + 24 hours, "24 hours have not elapsed yet");
        uint256 profit = totalReceived - totalSpent;
        require(profit > 0, "No profit to donate");
        uint256 donationAmount = profit / 100;
        recipient.transfer(donationAmount);
        lastCheckTime = block.timestamp;
    }
}

