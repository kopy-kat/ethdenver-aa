pragma solidity ^0.8.0;



// This is a dumy version of the credit system (or debit really)

contract CreditCard {
    address public owner;
    mapping(address => uint256) public balance;
    uint256 public creditLimit;
    
    constructor(uint256 _creditLimit) {
        owner = msg.sender;
        creditLimit = _creditLimit;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
    
    function charge(address payable _merchant, uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(_amount <= creditLimit - balance[msg.sender], "Insufficient credit available");
        balance[msg.sender] += _amount;
        _merchant.transfer(_amount);
    }
    
    function pay(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(_amount <= balance[msg.sender], "Insufficient funds to pay");
        balance[msg.sender] -= _amount;
    }
    
    function setCreditLimit(uint256 _creditLimit) public onlyOwner {
        creditLimit = _creditLimit;
    }
    
    function withdraw(address payable _recipient) public onlyOwner {
        _recipient.transfer(address(this).balance);
    }
}
