import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";

import { useLocation } from "react-router-dom";
import { Box, Button, Typography, Card, CardContent } from "@mui/material";

import DonationCampaignABI from "./contracts/DonationCampaign.json";
import contractAddressJson from "./contracts/contract-address.json";

const contractAddress = contractAddressJson.DonationCampaign;

function App() {
  const location = useLocation();
  const userType = location.state?.userType || "anonim";

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [raised, setRaised] = useState("");
  const [networkInfo, setNetworkInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setError(null);
        setLoading(true);

        if (!window.ethereum) throw new Error("⚠️ MetaMask nu este instalat!");

        const provider = new BrowserProvider(window.ethereum);
        setProvider(provider);

        const signer = await provider.getSigner();
        setSigner(signer);

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        const network = await provider.getNetwork();
        setNetworkInfo(network);

        if (network.chainId !== 31337n) {
          throw new Error(
            "⚠️ Conectează-te la localhost:8545 (Chain ID 31337)."
          );
        }

        const code = await provider.getCode(contractAddress);
        if (code === "0x")
          throw new Error("❌ Contractul nu există la adresa dată.");

        const contract = new Contract(
          contractAddress,
          DonationCampaignABI.abi,
          signer
        );
        setContract(contract);

        const details = await contract.getDetails();
        setTitle(details[0] || "Titlu nedefinit");
        setDescription(details[1] || "Descriere nedefinită");
        setGoal(formatEther(details[3] || 0));
        setRaised(formatEther(details[4] || 0));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h4">🔄 Se încarcă...</Typography>
        <Typography>Conectare la MetaMask și încărcare contract...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h4" color="error">
          ❌ Eroare
        </Typography>
        <Typography color="error">{error}</Typography>
        <Button
          onClick={() => window.location.reload()}
          variant="contained"
          sx={{ mt: 2 }}
        >
          Reîncarcă Pagina
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        🎯 Campanie: {title}
      </Typography>
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">💰 Suma strânsă: {raised} ETH</Typography>
          <Typography variant="h6">🎯 Țintă: {goal} ETH</Typography>
          <Typography variant="h6">
            📊 Progres:{" "}
            {goal && raised
              ? `${((parseFloat(raised) / parseFloat(goal)) * 100).toFixed(1)}%`
              : "N/A"}
          </Typography>
          <Button
            onClick={() => setExpanded(!expanded)}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            {expanded ? "Ascunde Detalii" : "Arată Detalii"}
          </Button>
          {expanded && (
            <Box mt={2}>
              <Typography variant="body1">Descriere: {description}</Typography>
              <Typography variant="body2">Cont conectat: {account}</Typography>
              <Typography variant="body2">
                Tip utilizator: {userType}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={async () => {
          const amount = prompt("Introduceți suma de donat în ETH:");
          if (amount && parseFloat(amount) > 0) {
            const tx = await contract.donate({ value: parseEther(amount) });
            await tx.wait();
            const details = await contract.getDetails();
            setRaised(formatEther(details[4]));
            alert("✅ Donație efectuată!");
          }
        }}
        variant="contained"
        color="primary"
      >
        💝 Donează
      </Button>
    </Box>
  );
}

export default App;
