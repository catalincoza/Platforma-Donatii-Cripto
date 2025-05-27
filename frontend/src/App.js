import React, { useEffect, useState } from 'react';
import {
  BrowserProvider,
  Contract,
  parseEther,
  formatEther
} from 'ethers';

import DonationCampaignABI from './contracts/DonationCampaign.json';
import contractAddressJson from './contracts/contract-address.json';

const contractAddress = contractAddressJson.DonationCampaign;

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [raised, setRaised] = useState('');
  const [networkInfo, setNetworkInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        setError(null);
        setLoading(true);

        if (!window.ethereum) {
          throw new Error('⚠️ MetaMask nu este instalat!');
        }

        console.log("🔗 Conectăm MetaMask...");
        const provider = new BrowserProvider(window.ethereum);
        setProvider(provider);

        const signer = await provider.getSigner();
        setSigner(signer);

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        console.log("👤 Cont conectat:", accounts[0]);

        // 🌐 Verificăm rețeaua curentă
        const network = await provider.getNetwork();
        console.log("🌐 Rețea detectată:", network);
        setNetworkInfo(network);

        if (network.chainId !== 31337n) {
          throw new Error("⚠️ Ești conectat la rețeaua greșită. Te rugăm să te conectezi la localhost:8545 (Chain ID 31337).");
        }

        console.log("📦 Adresa contractului:", contractAddress);
        
        // Verificăm dacă există cod la adresa contractului
        const code = await provider.getCode(contractAddress);
        console.log("🔍 Cod contract:", code);
        
        if (code === '0x') {
          throw new Error("❌ Nu există contract la adresa specificată. Verificați dacă contractul a fost deploiat corect.");
        }

        // 🧠 Creăm contractul
        const contract = new Contract(contractAddress, DonationCampaignABI.abi, signer);
        console.log("📦 Contract creat:", contract);
        setContract(contract);

        // Verificăm dacă funcția getDetails există în ABI
        const hasGetDetails = DonationCampaignABI.abi.some(item => 
          item.type === 'function' && item.name === 'getDetails'
        );
        
        if (!hasGetDetails) {
          throw new Error("❌ Funcția 'getDetails' nu există în ABI-ul contractului.");
        }

        console.log("🔄 Încercăm să preluăm datele din contract...");
        
        // 🧾 Preluăm datele din contract cu error handling
        try {
          const details = await contract.getDetails();
          console.log("📊 Detalii contract:", details);
          
          if (details && details.length >= 5) {
            setTitle(details[0] || "Titlu nedefinit");
            setDescription(details[1] || "Descriere nedefinită");
            setGoal(formatEther(details[3] || 0));
            setRaised(formatEther(details[4] || 0));
          } else {
            throw new Error("❌ Datele returnate de contract sunt incomplete sau goale.");
          }
        } catch (contractError) {
          console.error("❌ Eroare la citirea datelor din contract:", contractError);
          
          // Încercăm să citim datele individual
          try {
            console.log("🔄 Încercăm să citim datele individual...");
            const contractTitle = await contract.title();
            const contractDescription = await contract.description();
            const contractGoal = await contract.goal();
            const contractRaised = await contract.raised();
            
            setTitle(contractTitle || "Titlu nedefinit");
            setDescription(contractDescription || "Descriere nedefinită");
            setGoal(formatEther(contractGoal || 0));
            setRaised(formatEther(contractRaised || 0));
          } catch (individualError) {
            throw new Error(`❌ Nu se pot citi datele din contract. Verificați dacă contractul a fost inițializat corect. Eroare: ${individualError.message}`);
          }
        }

      } catch (err) {
        console.error("❌ Eroare în inițializare:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const donate = async () => {
    if (!contract) {
      alert('❌ Contractul nu este încărcat!');
      return;
    }

    try {
      const amount = prompt('Introduceți suma de donat în ETH:');
      if (amount && parseFloat(amount) > 0) {
        console.log("💰 Procesează donația...", amount, "ETH");
        
        const tx = await contract.donate({ value: parseEther(amount) });
        console.log("⏳ Tranzacție trimisă:", tx.hash);
        
        await tx.wait();
        console.log("✅ Tranzacție confirmată!");

        // 🔄 Actualizăm suma strânsă
        try {
          const updated = await contract.getDetails();
          if (updated && updated.length >= 5) {
            setRaised(formatEther(updated[4]));
          } else {
            // Fallback la citirea individuală
            const contractRaised = await contract.raised();
            setRaised(formatEther(contractRaised));
          }
        } catch (updateError) {
          console.warn("⚠️ Nu s-au putut actualiza datele:", updateError);
        }

        alert('✅ Donație realizată cu succes!');
      }
    } catch (err) {
      console.error("❌ Eroare la donație:", err);
      alert(`❌ Eroare la donație: ${err.message}`);
    }
  };

  const checkContract = async () => {
    if (!provider) return;
    
    try {
      const code = await provider.getCode(contractAddress);
      const balance = await provider.getBalance(contractAddress);
      
      console.log("🔍 Informații contract:");
      console.log("- Adresă:", contractAddress);
      console.log("- Cod:", code);
      console.log("- Balanță:", formatEther(balance), "ETH");
      console.log("- ABI funcții:", DonationCampaignABI.abi.filter(item => item.type === 'function').map(f => f.name));
      
      alert(`Contract Info:\nAdresă: ${contractAddress}\nCod există: ${code !== '0x'}\nBalanță: ${formatEther(balance)} ETH`);
    } catch (err) {
      console.error("❌ Eroare la verificarea contractului:", err);
      alert(`❌ Eroare: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
        <h1>🔄 Se încarcă...</h1>
        <p>Conectare la MetaMask și încărcare contract...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
        <h1>❌ Eroare</h1>
        <p style={{ color: 'red', background: '#ffe6e6', padding: '1rem', borderRadius: '4px' }}>
          {error}
        </p>
        <button onClick={() => window.location.reload()} style={{ 
          padding: '0.5rem 1rem', 
          fontSize: '16px',
          marginRight: '1rem'
        }}>
          🔄 Reîncarcă Pagina
        </button>
        <button onClick={checkContract} style={{ 
          padding: '0.5rem 1rem', 
          fontSize: '16px' 
        }}>
          🔍 Verifică Contract
        </button>
        <div style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
          <h3>Soluții posibile:</h3>
          <ul>
            <li>Verificați dacă contractul a fost deploiat corect pe localhost:8545</li>
            <li>Verificați dacă adresa contractului din contract-address.json este corectă</li>
            <li>Verificați dacă Hardhat node rulează pe portul 8545</li>
            <li>Redeploi contractul dacă este necesar</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🎯 {title || "Campanie de Donații"}</h1>
      <p>{description || "Se încarcă descrierea..."}</p>
      
      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
        <p><strong>🎯 Țintă:</strong> {goal || "0"} ETH</p>
        <p><strong>💰 Strâns:</strong> {raised || "0"} ETH</p>
        <p><strong>📊 Progres:</strong> {goal && raised ? `${((parseFloat(raised) / parseFloat(goal)) * 100).toFixed(1)}%` : "N/A"}</p>
      </div>
      
      <div style={{ background: '#e6f3ff', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
        <p><strong>👤 Cont conectat:</strong> {account}</p>
        <p><strong>🌐 Chain ID:</strong> {networkInfo?.chainId?.toString()}</p>
        <p><strong>📱 Rețea:</strong> {networkInfo?.name || 'localhost'}</p>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <button 
          onClick={donate} 
          disabled={!contract}
          style={{ 
            padding: '0.75rem 1.5rem', 
            fontSize: '16px',
            backgroundColor: contract ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: contract ? 'pointer' : 'not-allowed',
            marginRight: '1rem'
          }}
        >
          💝 Donează
        </button>
        
        <button 
          onClick={checkContract}
          style={{ 
            padding: '0.75rem 1.5rem', 
            fontSize: '16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔍 Debug Contract
        </button>
      </div>
    </div>
  );
}

export default App;