pragma solidity ^0.8.0;

contract Donation {
    address public owner;
    uint256 public receivedETH;
    uint256 public spentETH;
    uint256 public lastCalculation;
    uint256 public donationPercentage;
    address payable public donationRecipient;
    
    constructor(uint256 _donationPercentage, address payable _donationRecipient) {
        owner = msg.sender;
        lastCalculation = block.timestamp;
        donationPercentage = _donationPercentage;
        donationRecipient = _donationRecipient;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
    
    function setDonationPercentage(uint256 _percentage) public onlyOwner {
        require(_percentage <= 100, "Percentage must be less than or equal to 100");
        donationPercentage = _percentage;
    }
    
    function setDonationRecipient(address payable _recipient) public onlyOwner {
        donationRecipient = _recipient;
    }
    
    function receive() external payable {
        receivedETH += msg.value;
    }
    
    function spend(uint256 _amount) external {
        require(_amount <= address(this).balance, "Not enough funds available");
        spentETH += _amount;
        payable(msg.sender).transfer(_amount);
    }
    
    function calculateProfit() internal returns (int256) {
        uint256 currentTimestamp = block.timestamp;
        uint256 timeElapsed = currentTimestamp - lastCalculation;
        if (timeElapsed < 86400) {
            // 24 hours haven't passed yet
            // We can change this to be any number
            // Should the number be user decided? or Hardcoded?
            return 0;
        }
        lastCalculation = currentTimestamp;
        int256 profit = int256(receivedETH) - int256(spentETH);
        if (profit <= 0) {
            // No profit to donate
            return 0;
        }
        uint256 donationAmount = uint256(profit * int256(donationPercentage) / 100);
        donationRecipient.transfer(donationAmount);
        return int256(donationAmount);
    }
    
    function withdraw(address payable _recipient) public onlyOwner {
        int256 donationAmount = calculateProfit();
        _recipient.transfer(address(this).balance);
        if (donationAmount > 0) {
            receivedETH -= uint256(donationAmount);
        }
    }
}
