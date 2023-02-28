pragma solidity ^0.8.0;

contract RetirementSavings {
    address public owner;
    uint256 public percentage;
    uint256 public savedAmount;
    
    constructor(uint256 _percentage) {
        owner = msg.sender;
        percentage = _percentage;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
    
    function setPercentage(uint256 _percentage) public onlyOwner {
        require(_percentage <= 100, "Percentage must be less than or equal to 100");
        percentage = _percentage;
    }
    
    function save() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        uint256 saveAmount = msg.value * percentage / 100;
        savedAmount += saveAmount;
    }
    
    function withdraw(address payable _recipient) public onlyOwner {
        _recipient.transfer(savedAmount);
        savedAmount = 0;
    }
}
