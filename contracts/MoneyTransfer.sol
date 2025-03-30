// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MoneyTransfer {
    // Struct to store transaction details
    struct Transaction {
        address sender;
        address receiver;
        uint256 amount;
        uint256 timestamp;
    }

    // Array to store all transactions
    Transaction[] public transactions;

    // Event to emit when money is transferred
    event Transfer(address indexed from, address indexed to, uint256 amount);

    // Function to transfer money
    function transfer(address payable _to) public payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(_to != address(0), "Invalid receiver address");

        _to.transfer(msg.value);

        // Record the transaction
        transactions.push(Transaction({
            sender: msg.sender,
            receiver: _to,
            amount: msg.value,
            timestamp: block.timestamp
        }));

        emit Transfer(msg.sender, _to, msg.value);
    }

    // Function to check balance
    function getBalance() public view returns (uint256) {
        return msg.sender.balance;
    }

    // Function to get all transactions
    function getTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }
}