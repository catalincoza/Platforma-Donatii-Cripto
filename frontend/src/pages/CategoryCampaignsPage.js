import React, { useEffect, useState } from "react";
import {
  Box, Typography, CircularProgress, Alert, Button
} from "@mui/material";
import { BrowserProvider, Contract, formatEther } from "ethers";
import CampaignCard from "../components/CampaignCard";
import CampaignABI from "../contracts/DonationCampaign.json";
import FactoryABI from "../contracts/DonationCampaignFactory.json";
import factoryAddressJson from "../contracts/factory-address.json";
import { useNavigate, useParams } from "react-router-dom";

const factoryAddress = factoryAddressJson.DonationCampaignFactory;

const CategoryCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { category } = useParams(); // ex: "educatie"
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, [category]);

  async function fetchCampaigns() {
    try {
      setLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new Contract(factoryAddress, FactoryABI.abi, signer);

      const count = await factory.getCampaignCount();
      const filtered = [];

      for (let i = 0; i < count; i++) {
        const address = await factory.getCampaignAddress(i);
        const campaign = new Contract(address, CampaignABI.abi, signer);
        const details = await campaign.getDetails();

        if (details[2].toLowerCase() === category.toLowerCase()) {
          filtered.push({
            address,
            title: details[0],
            description: details[1],
            category: details[2],
            creator: details[3],
            goal: parseFloat(formatEther(details[4])),
            raised: parseFloat(formatEther(details[5])),
            finalized: details[6],
          });
        }
      }

      setCampaigns(filtered);
    } catch (err) {
      setError("Eroare la încărcarea campaniilor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", p: 4, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <Typography variant="h4" textAlign="center" mb={4} color="white" fontWeight="bold">
        Campanii din categoria: {category}
      </Typography>

      {loading && (
        <Box textAlign="center"><CircularProgress sx={{ color: "white" }} /></Box>
      )}

      {error && (
        <Alert severity="error">{error}</Alert>
      )}

      {!loading && campaigns.length === 0 && (
        <Typography textAlign="center" color="white">
          Nu există campanii în această categorie momentan.
        </Typography>
      )}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", mt: 4 }}>
        {campaigns.map((c, idx) => (
          <CampaignCard key={idx} campaign={c} />
        ))}
      </Box>

      <Box textAlign="center" mt={6}>
        <Button variant="outlined" sx={{ color: "white", borderColor: "white" }} onClick={() => navigate("/")}>
          Înapoi la pagina principală
        </Button>
      </Box>
    </Box>
  );
};

export default CategoryCampaignsPage;
