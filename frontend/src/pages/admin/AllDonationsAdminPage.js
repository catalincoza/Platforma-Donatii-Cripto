import React, { useEffect, useState } from "react";
import {
  Box, Typography, CircularProgress, Alert, Accordion, AccordionSummary,
  AccordionDetails, List, ListItem, ListItemText, Divider, TextField, Button
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BrowserProvider, Contract, formatEther } from "ethers";
import factoryABI from "../../contracts/DonationCampaignFactory.json";
import campaignABI from "../../contracts/DonationCampaign.json";
import factoryAddressJSON from "../../contracts/factory-address.json";
import { useNavigate } from "react-router-dom";

const factoryAddress = factoryAddressJSON.DonationCampaignFactory;

const AllDonationsAdminPage = () => {
  const [donationsByUser, setDonationsByUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllDonations();
  }, []);

  const fetchAllDonations = async () => {
    try {
      setLoading(true);
      setError("");

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new Contract(factoryAddress, factoryABI.abi, signer);
      const count = await factory.getCampaignCount();

      const all = {};

      for (let i = 0; i < count; i++) {
        const address = await factory.getCampaignAddress(i);
        const campaign = new Contract(address, campaignABI.abi, signer);
        const details = await campaign.getDetails();
        const title = details[0];

        const events = await campaign.queryFilter(campaign.filters.DonationReceived(), 0, "latest");

        for (let e of events) {
          const donor = e.args.donor.toLowerCase();
          if (!all[donor]) all[donor] = [];

          all[donor].push({
            campaign: title,
            amount: parseFloat(formatEther(e.args.amount)),
            name: e.args.donorName,
            email: e.args.donorEmail,
            timestamp: new Date(Number(e.args.timestamp) * 1000).toLocaleString(),
          });
        }
      }

      setDonationsByUser(all);
    } catch (err) {
      console.error("Eroare la încărcarea donațiilor:", err);
      setError("Eroare la încărcarea datelor.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDonors = Object.entries(donationsByUser).filter(([address, donations]) => {
    const query = search.toLowerCase();
    return (
      address.includes(query) ||
      donations.some(d =>
        d.name?.toLowerCase().includes(query) ||
        d.email?.toLowerCase().includes(query) ||
        d.campaign?.toLowerCase().includes(query)
      )
    );
  });

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", p: 4 }}>
      <Typography variant="h4" color="white" fontWeight="bold" textAlign="center" mb={4}>
        📊 Donații - Vizualizare Globală (Admin)
      </Typography>

      <TextField
        label="Caută după adresă, nume, email sau campanie"
        variant="outlined"
        fullWidth
        sx={{ mb: 4, backgroundColor: "white", borderRadius: 1 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <Box textAlign="center"><CircularProgress sx={{ color: "white" }} /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filteredDonors.length === 0 ? (
        <Typography color="white" textAlign="center">📭 Nicio donație găsită.</Typography>
      ) : (
        filteredDonors.map(([donor, donations], idx) => (
          <Accordion key={idx} sx={{ mb: 2, backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
              <Typography fontWeight="bold">{donor}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {donations.map((d, i) => (
                  <React.Fragment key={i}>
                    <ListItem>
                      <ListItemText
                        primary={`💰 ${d.amount} ETH - ${d.campaign}`}
                        secondary={`👤 ${d.name} | 📧 ${d.email} | 🕒 ${d.timestamp}`}
                      />
                    </ListItem>
                    {i < donations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))
      )}

      <Box textAlign="center" mt={5}>
        <Button
          variant="outlined"
          sx={{ color: "white", borderColor: "white", "&:hover": { color: "#FFD700", borderColor: "#FFD700" } }}
          onClick={() => navigate("/admin-dashboard")}
        >
          🔙 Înapoi la Panou Admin
        </Button>
      </Box>
    </Box>
  );
};

export default AllDonationsAdminPage;
