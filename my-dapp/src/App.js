import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import MoneyTransferABI from "./MoneyTransferABI.json";
import "./index.css";

const CONTRACT_ADDRESS = "0x350ddFb12A1560ceA27E39aA7dc153138197bA18";

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (contract) {
      const txs = await contract.getTransactions();
      setTransactions(txs);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted! (This is a demo)");
    setContactForm({ name: "", email: "", message: "" });
  };

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (contract) fetchTransactions();
  }, [contract]);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">MyCrypto</div>
        <ul className="nav-links">
          <li onClick={() => scrollToSection("home")}>Home</li>
          <li onClick={() => scrollToSection("transactions")}>Transactions</li>
          <li onClick={() => scrollToSection("contact")}>Contact</li>
        </ul>
        <button onClick={connectWallet} className="wallet-btn">
          {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
        </button>
      </nav>

      {/* Main Content */}
      <main>
        {/* Home Section */}
        <section id="home">
          <h1>Simple Money Transfer</h1>
          <div className="balance">
            <p>
              Balance: <span>{balance} ETH</span>
            </p>
          </div>
          <div className="transfer-form">
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
            <button onClick={sendMoney} disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </section>

        {/* Transactions Section */}
        <section id="transactions">
          <h2>Transaction History</h2>
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <ul className="transaction-list">
              {transactions.map((tx, index) => (
                <li key={index}>
                  <span>{`${tx.sender.slice(0, 6)}...${tx.sender.slice(-4)}`}</span>
                  <span>sent</span>
                  <span>{ethers.formatEther(tx.amount)} ETH</span>
                  <span>to</span>
                  <span>{`${tx.receiver.slice(0, 6)}...${tx.receiver.slice(-4)}`}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Contact Section */}
        <section id="contact">
          <h2>Contact Us</h2>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={contactForm.name}
              onChange={handleContactChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={contactForm.email}
              onChange={handleContactChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={contactForm.message}
              onChange={handleContactChange}
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="social-icons">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">📘</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📸</a>
        </div>
        <p>© 2025 MyCrypto. All rights reserved.</p>
        <ul className="footer-links">
          <li onClick={() => scrollToSection("home")}>Home</li>
          <li onClick={() => scrollToSection("transactions")}>Transactions</li>
          <li onClick={() => scrollToSection("contact")}>Contact</li>
        </ul>
      </footer>
    </div>
  );
}

export default App;