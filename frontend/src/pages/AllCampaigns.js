// frontend/src/pages/AllCampaigns.js
import React, { useEffect, useState } from "react";
import {
  Box, Typography, CircularProgress, Alert, Button
} from "@mui/material";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import { useNavigate } from "react-router-dom";

import factoryABI from "../contracts/DonationCampaignFactory.json";
import campaignABI from "../contracts/DonationCampaign.json";
import factoryAddressJSON from "../contracts/factory-address.json";

import CampaignCard from "../components/CampaignCard";
import CampaignModals from "../components/CampaignModals";

const factoryAddress = factoryAddressJSON.DonationCampaignFactory;

const AllCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [donations, setDonations] = useState([]);
  const [donationForm, setDonationForm] = useState({ amount: "", name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openDonation, setOpenDonation] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError("");

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new Contract(factoryAddress, factoryABI.abi, signer);
      const count = await factory.getCampaignCount();

      const result = [];
      for (let i = 0; i < count; i++) {
        const address = await factory.getCampaignAddress(i);
        const campaign = new Contract(address, campaignABI.abi, signer);
        const details = await campaign.getDetails();

        result.push({
          address,
          contract: campaign,
          title: details[0],
          description: details[1],
          category: details[2],
          creator: details[3],
          goal: parseFloat(formatEther(details[4].toString())),
          raised: parseFloat(formatEther(details[5].toString())),
          finalized: details[6]
        });
      }

      setCampaigns(result);
    } catch (err) {
      setError("Eroare la încărcarea campaniilor.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDonation = (campaign) => {
    setSelected(campaign);
    setDonationForm({ amount: "", name: "", email: "" });
    setOpenDonation(true);
  };

  const handleOpenDetails = async (campaign) => {
    try {
      const events = await campaign.contract.queryFilter(
        campaign.contract.filters.DonationReceived(),
        0,
        "latest"
      );

      const parsed = events.map((e) => ({
        donor: e.args.donor,
        amount: parseFloat(formatEther(e.args.amount.toString())),
        name: e.args.donorName,
        email: e.args.donorEmail
      }));

      setDonations(parsed);
      setSelected(campaign);
      setOpenDetails(true);
    } catch (err) {
      console.error("Eroare la încărcare donații:", err);
    }
  };

  const handleSubmitDonation = async () => {
    try {
      setDonating(true);
      setError("");
      setSuccess("");

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(selected.address, campaignABI.abi, signer);
      const value = parseEther(donationForm.amount.toString());

      const tx = await contract.donate(
        donationForm.name || "Anonim",
        donationForm.email || "",
        { value }
      );
      await tx.wait();

      setSuccess("✅ Donația a fost trimisă!");
      setOpenDonation(false);
      await fetchCampaigns();
    } catch (err) {
      setError("Eroare la procesarea donației.");
    } finally {
      setDonating(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh", py: 6, px: { xs: 2, md: 4 },
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }}>
      <Typography variant="h3" fontWeight="bold" color="white" textAlign="center" mb={4}>
        🌟 Campaniile active pe blockchain
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      {loading ? (
        <Box textAlign="center">
          <CircularProgress sx={{ color: "white" }} />
        </Box>
      ) : campaigns.length === 0 ? (
        <Typography textAlign="center" color="white">
          📭 Nu există campanii disponibile momentan.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
          {campaigns.map((c, i) => (
            <CampaignCard
              key={i}
              campaign={c}
              onDonate={handleOpenDonation}
              onDetails={handleOpenDetails}
            />
          ))}
        </Box>
      )}

      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Button
          variant="outlined"
          sx={{ color: "white", borderColor: "white", "&:hover": { borderColor: "#FFD700", color: "#FFD700" } }}
          onClick={() => navigate("/")}
        >
          🏠 Înapoi la Home
        </Button>
      </Box>

      {/* Modale reutilizabile */}
      <CampaignModals
        selected={selected}
        donations={donations}
        donationForm={donationForm}
        onDonationChange={(field, value) => setDonationForm((prev) => ({ ...prev, [field]: value }))}
        onSubmitDonation={handleSubmitDonation}
        donationDialogOpen={openDonation}
        donorsModalOpen={openDetails}
        onCloseDonationDialog={() => setOpenDonation(false)}
        onCloseDonorsModal={() => setOpenDetails(false)}
        donating={donating}
      />
    </Box>
  );
};

export default AllCampaigns;
