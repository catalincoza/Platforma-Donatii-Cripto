import React, { useEffect, useState } from "react";
import {
  Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText, Divider, Button
} from "@mui/material";
import { BrowserProvider, Contract, formatEther } from "ethers";
import { useNavigate } from "react-router-dom";

import factoryABI from "../contracts/DonationCampaignFactory.json";
import campaignABI from "../contracts/DonationCampaign.json";
import factoryAddressJSON from "../contracts/factory-address.json";

const factoryAddress = factoryAddressJSON.DonationCampaignFactory;

const UserDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);

      const factory = new Contract(factoryAddress, factoryABI.abi, signer);
      const count = await factory.getCampaignCount();

      const allDonations = [];

      for (let i = 0; i < count; i++) {
        const campaignAddr = await factory.getCampaignAddress(i);
        const campaign = new Contract(campaignAddr, campaignABI.abi, signer);
        const details = await campaign.getDetails();

        const events = await campaign.queryFilter(campaign.filters.DonationReceived(), 0, "latest");

        const userEvents = events.filter(ev => ev.args.donor.toLowerCase() === address.toLowerCase());

        userEvents.forEach(ev => {
          allDonations.push({
            campaignTitle: details[0],
            campaignAddress: campaignAddr,
            amount: parseFloat(formatEther(ev.args.amount.toString())),
            name: ev.args.donorName,
            email: ev.args.donorEmail,
            timestamp: new Date(Number(ev.args.timestamp) * 1000).toLocaleString(),
          });
        });
      }

      setDonations(allDonations);
    } catch (err) {
      console.error("Eroare la citirea donațiilor:", err);
      setError("Eroare la încărcarea donațiilor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", p: 4 }}>
      <Typography variant="h4" color="white" fontWeight="bold" textAlign="center" mb={4}>
        Istoric Donații ({userAddress.slice(0, 6)}...{userAddress.slice(-4)})
      </Typography>

      {loading ? (
        <Box textAlign="center"><CircularProgress sx={{ color: "white" }} /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : donations.length === 0 ? (
        <Typography color="white" textAlign="center">📭 Nu ai făcut nicio donație încă.</Typography>
      ) : (
        <List>
          {donations.map((d, i) => (
            <React.Fragment key={i}>
              <ListItem>
                <ListItemText
                  primary={`${d.amount} ETH către ${d.campaignTitle}`}
                  secondary={`🕒 ${d.timestamp} | 👤 ${d.name} | 📧 ${d.email}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}

      <Box textAlign="center" mt={4}>
        <Button
          variant="outlined"
          sx={{ color: "white", borderColor: "white", "&:hover": { color: "#FFD700", borderColor: "#FFD700" } }}
          onClick={() => navigate("/")}
        >
          Înapoi la Home
        </Button>
      </Box>
    </Box>
  );
};

export default UserDonationsPage;
