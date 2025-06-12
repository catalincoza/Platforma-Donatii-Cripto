import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Button, LinearProgress, Avatar,
  Modal, Fade, List, ListItem, ListItemAvatar, ListItemText, Divider, 
  Backdrop, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, CircularProgress, InputAdornment
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/VolunteerActivism";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";

import CampaignABI from "../contracts/DonationCampaign.json";
import FactoryABI from "../contracts/DonationCampaignFactory.json";
import factoryAddressJson from "../contracts/factory-address.json";
import { useNavigate } from "react-router-dom";

const factoryAddress = factoryAddressJson.DonationCampaignFactory;

const AllCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [donations, setDonations] = useState([]);
  const [open, setOpen] = useState(false);
  const [donationDialog, setDonationDialog] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(false);
  const [success, setSuccess] = useState("");
  
  // Donation form state
  const [donationForm, setDonationForm] = useState({
    amount: "",
    name: "",
    email: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    try {
      setLoading(true);
      setError("");
      
      if (!window.ethereum) {
        throw new Error("MetaMask nu este instalat!");
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new Contract(factoryAddress, FactoryABI.abi, signer);

      const count = await factory.getCampaignCount();

      if (count.toString() === "0") {
        setCampaigns([]);
        setLoading(false);
        return;
      }

      const data = [];

      for (let i = 0; i < count; i++) {
        try {
          const address = await factory.getCampaignAddress(i);
          const campaign = new Contract(address, CampaignABI.abi, signer);
          const details = await campaign.getDetails();

          const campaignData = {
            address,
            contract: campaign,
            title: details[0],
            description: details[1],
            creator: details[2],
            goal: parseFloat(formatEther(details[3])),
            raised: parseFloat(formatEther(details[4])),
            createdAt: details[5],
            finalized: details[6],
          };

          data.push(campaignData);
          
        } catch (err) {
          console.error(`Error processing campaign ${i}:`, err);
        }
      }
      
      setCampaigns(data);
      
    } catch (e) {
      console.error("Error fetching campaigns:", e);
      setError(`Eroare la încărcarea campaniilor: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = async (campaign) => {
    try {
      setSelected(campaign);
      setOpen(true);
      
      // Fetch donation events
      const events = await campaign.contract.queryFilter(
        campaign.contract.filters.DonationReceived(),
        0,
        "latest"
      );
      
      const donationsArray = events.map(ev => ({
        donor: ev.args.donor,
        amount: parseFloat(formatEther(ev.args.amount)),
        name: ev.args.donorName || "Anonim",
        email: ev.args.donorEmail || "",
        timestamp: new Date().toLocaleDateString() // You might want to get this from blockchain
      }));
      
      setDonations(donationsArray);
      
    } catch (err) {
      console.error("Error fetching donations:", err);
      setDonations([]);
    }
  };

  const handleDonationSubmit = async () => {
    if (!donationForm.amount || parseFloat(donationForm.amount) <= 0) {
      setError("Suma donației trebuie să fie mai mare decât 0");
      return;
    }

    try {
      setDonating(true);
      setError("");
      setSuccess("");

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Create contract instance for the selected campaign
      const campaign = new Contract(selected.address, CampaignABI.abi, signer);
      
      const donationAmount = parseEther(donationForm.amount);
      
      // Call the donate function with optional name and email
      // Note: You'll need to modify your smart contract to accept these parameters
      const tx = await campaign.donate(
        donationForm.name || "Anonim",
        donationForm.email || "",
        { value: donationAmount }
      );

      await tx.wait();
      
      setSuccess(`Donația de ${donationForm.amount} ETH a fost trimisă cu succes!`);
      setDonationDialog(false);
      
      // Reset form
      setDonationForm({ amount: "", name: "", email: "" });
      
      // Refresh campaigns and donations
      await fetchCampaigns();
      if (selected) {
        await handleOpenModal(selected);
      }
      
    } catch (err) {
      console.error("Donation error:", err);
      setError(`Eroare la procesarea donației: ${err.message}`);
    } finally {
      setDonating(false);
    }
  };

  const openDonationDialog = (campaign) => {
    setSelected(campaign);
    setDonationDialog(true);
    setError("");
    setSuccess("");
  };

  const handleFormChange = (field, value) => {
    setDonationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box sx={{
      minHeight: "100vh", py: 6, px: { xs: 2, md: 4 },
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }}>
      <Typography variant="h3" fontWeight="bold" color="white" textAlign="center" mb={4}>
        🌟 Campaniile active pe blockchain
      </Typography>

      {/* Success Alert */}
      {success && (
        <Box mb={4} display="flex" justifyContent="center">
          <Alert severity="success" sx={{ maxWidth: 600 }}>
            {success}
          </Alert>
        </Box>
      )}

      {/* Error Alert */}
      {error && (
        <Box mb={4} display="flex" justifyContent="center">
          <Alert severity="error" sx={{ maxWidth: 600 }}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Loading state */}
      {loading && (
        <Box textAlign="center" mb={4}>
          <Typography color="white" variant="h6" mb={2}>
            🔄 Se încarcă campaniile...
          </Typography>
          <CircularProgress sx={{ color: "white" }} />
        </Box>
      )}

      {/* No campaigns found */}
      {!loading && campaigns.length === 0 && !error && (
        <Box textAlign="center" mb={4}>
          <Typography color="white" variant="h6">
            📭 Nu există campanii disponibile momentan.
          </Typography>
        </Box>
      )}

      {/* Campaigns list */}
      {!loading && campaigns.map((c, index) => (
        <Box key={index} display="flex" justifyContent="center" mb={4}>
          <Card sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            minWidth: 350,
            maxWidth: 420,
            border: "2px solid rgba(255,255,255,0.3)"
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: "white", color: "#764ba2", mr: 2 }}>
                  <CampaignIcon />
                </Avatar>
                <Typography variant="h6">{c.title}</Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>{c.description}</Typography>
              <Typography variant="body2" sx={{ fontStyle: "italic", mb: 1 }}>
                🎯 Țintă: {c.goal} ETH
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: "italic", mb: 1 }}>
                💰 Strâns: {c.raised} ETH
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: "italic", mb: 1 }}>
                📊 Progres: {((c.raised / c.goal) * 100).toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((c.raised / c.goal) * 100, 100)}
                sx={{
                  height: 8, borderRadius: 5, mb: 2,
                  bgcolor: "rgba(255,255,255,0.2)",
                  "& .MuiLinearProgress-bar": { backgroundColor: "#FFD700" },
                }}
              />
              <Typography variant="caption" sx={{ 
                color: c.finalized ? "#90EE90" : "#FFD700",
                fontWeight: "bold"
              }}>
                {c.finalized ? "✅ Finalizată" : "🟢 Activă"}
              </Typography>

              {/* Action buttons */}
              <Box sx={{ mt: 3, display: "flex", gap: 1, flexDirection: "column" }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#222",
                    fontWeight: "bold",
                    "&:hover": { bgcolor: "#ffe066", color: "#111" },
                  }}
                  onClick={() => openDonationDialog(c)}
                  disabled={c.finalized}
                >
                  💝 Donează acum
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "&:hover": { borderColor: "#FFD700", color: "#FFD700" },
                  }}
                  onClick={() => handleOpenModal(c)}
                >
                  📋 Detalii & Donatori
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ))}

      {/* Donation Dialog */}
      <Dialog 
        open={donationDialog} 
        onClose={() => setDonationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          💝 Donează pentru {selected?.title}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Suma donației (ETH) *"
              type="number"
              value={donationForm.amount}
              onChange={(e) => handleFormChange("amount", e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <InputAdornment position="start">Ξ</InputAdornment>,
              }}
              helperText="Introduceti suma în ETH"
            />
            
            <TextField
              fullWidth
              label="Numele tău (opțional)"
              value={donationForm.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment>,
              }}
              helperText="Dacă nu completezi, vei apărea ca 'Anonim'"
            />
            
            <TextField
              fullWidth
              label="Email-ul tău (opțional)"
              type="email"
              value={donationForm.email}
              onChange={(e) => handleFormChange("email", e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment>,
              }}
              helperText="Pentru a fi contactat în legătură cu donația"
            />

            {selected && (
              <Box sx={{ mt: 3, p: 2, bgcolor: "rgba(0,0,0,0.05)", borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Campania:</strong> {selected.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Progres:</strong> {selected.raised} ETH / {selected.goal} ETH
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setDonationDialog(false)}
            variant="outlined"
            disabled={donating}
          >
            Anulează
          </Button>
          <Button 
            onClick={handleDonationSubmit}
            variant="contained"
            disabled={donating || !donationForm.amount}
            startIcon={donating ? <CircularProgress size={20} /> : null}
            sx={{
              bgcolor: "#FFD700",
              color: "#222",
              "&:hover": { bgcolor: "#ffe066" }
            }}
          >
            {donating ? "Se procesează..." : "Confirmă donația"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Donors Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box sx={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            maxHeight: "80vh",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              💰 Donatori pentru {selected?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              📍 Contract: {selected?.address?.slice(0, 6)}...{selected?.address?.slice(-4)}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              📊 Progres: {selected?.raised} ETH / {selected?.goal} ETH ({selected ? ((selected.raised / selected.goal) * 100).toFixed(1) : 0}%)
            </Typography>
            
            <Box sx={{ maxHeight: "50vh", overflowY: "auto", pr: 1 }}>
              <List>
                {donations.length > 0 ? donations.map((donor, i) => (
                  <React.Fragment key={i}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#FFD700", color: "#000" }}>
                          <MonetizationOnIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {donor.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {donor.donor.slice(0, 6)}...{donor.donor.slice(-4)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="primary" fontWeight="bold">
                              💰 {donor.amount} ETH
                            </Typography>
                            {donor.email && (
                              <Typography variant="caption" color="text.secondary">
                                📧 {donor.email}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {i < donations.length - 1 && <Divider />}
                  </React.Fragment>
                )) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body2" color="text.secondary">
                      💭 Nu există donații înregistrate încă.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fii primul care donează pentru această cauză!
                    </Typography>
                  </Box>
                )}
              </List>
            </Box>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => setOpen(false)}
            >
              Închide
            </Button>
          </Box>
        </Fade>
      </Modal>

      <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <Button
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "#FFD700", color: "#FFD700" },
          }}
          onClick={() => navigate("/")}
        >
          🏠 Înapoi la Home
        </Button>
      </Box>
    </Box>
  );
};

export default AllCampaigns;