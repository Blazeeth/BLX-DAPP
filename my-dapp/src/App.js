import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import MoneyTransferABI from "./MoneyTransferABI.json";
import logo from "./logo.png"; // Add if you have a logo
import "./App.css";

const CONTRACT_ADDRESS = "0x350ddFb12A1560ceA27E39aA7dc153138197bA18";

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const userAccount = await signer.getAddress();
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        MoneyTransferABI,
        signer
      );

      setProvider(provider);
      setSigner(signer);
      setAccount(userAccount);
      setContract(contractInstance);
      updateBalance(provider, userAccount);
    } else {
      alert("Please install MetaMask!");
    }
  };

  const updateBalance = async (prov, acc) => {
    const balanceWei = await prov.getBalance(acc);
    setBalance(ethers.formatEther(balanceWei));
  };

  const sendMoney = async () => {
    if (!contract || !receiver || !amount) {
      alert("Please fill in all fields!");
      return;
    }
    try {
      const tx = await contract.transfer(receiver, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      alert("Transaction successful!");
      updateBalance(provider, account);
      fetchTransactions();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const fetchTransactions = async () => {
    if (contract) {
      const txs = await contract.getTransactions();
      setTransactions(txs);
    }
  };

  useEffect(() => {
    if (contract) fetchTransactions();
  }, [contract]);

  return (
    <div className="App">
      <nav className="navbar">
        <img src={logo} alt="MyCrypto Logo" className="brand-logo" />
        <ul>
          <li>Home</li>
          <li onClick={fetchTransactions}>Transactions</li>
          <li>Contact</li>
          <button onClick={connectWallet}>
            {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
          </button>
        </ul>
      </nav>

      <section>
        <h1>Simple Money Transfer</h1>
        <p>Balance: {balance} ETH</p>

        <div>
          <input
            type="text"
            placeholder="Receiver Address"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={sendMoney}>Send</button>
        </div>

        <h2>Transaction History</h2>
        <ul>
          {transactions.map((tx, index) => (
            <li key={index}>
              {tx.sender} sent {ethers.formatEther(tx.amount)} ETH to {tx.receiver}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;