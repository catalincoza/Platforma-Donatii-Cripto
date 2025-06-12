import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Button, LinearProgress, Avatar,
  Modal, Fade, List, ListItem, ListItemAvatar, ListItemText, Divider, Backdrop
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/VolunteerActivism";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { BrowserProvider, Contract, formatEther } from "ethers";

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        setLoading(true);
        setError("");
        
        console.log("🔍 Starting to fetch campaigns...");
        console.log("📍 Factory address:", factoryAddress);
        
        // Check if MetaMask is available
        if (!window.ethereum) {
          throw new Error("MetaMask nu este instalat!");
        }

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const factory = new Contract(factoryAddress, FactoryABI.abi, signer);

        console.log("🏭 Factory contract initialized");
        
        const count = await factory.getCampaignCount();
        console.log("📊 Total campaigns count:", count.toString());

        if (count.toString() === "0") {
          console.log("⚠️ No campaigns found in factory");
          setCampaigns([]);
          setLoading(false);
          return;
        }

        const data = [];

        for (let i = 0; i < count; i++) {
          try {
            console.log(`🔄 Processing campaign ${i + 1}/${count}...`);
            
            const address = await factory.getCampaignAddress(i);
            console.log(`📍 Campaign ${i} address:`, address);
            
            const campaign = new Contract(address, CampaignABI.abi, signer);
            console.log(`📋 Campaign ${i} contract initialized`);
            
            const details = await campaign.getDetails();
            console.log(`📝 Campaign ${i} details:`, details);

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

            console.log(`✅ Campaign ${i} data processed:`, campaignData);
            data.push(campaignData);
            
          } catch (err) {
            console.error(`❌ Error processing campaign ${i}:`, err);
            console.error("Error details:", err.message);
            // Continue processing other campaigns
          }
        }

        console.log("📦 Final campaigns array:", data);
        console.log("🔢 Total campaigns loaded:", data.length);
        
        setCampaigns(data);
        
      } catch (e) {
        console.error("💥 Main error in fetchCampaigns:", e);
        console.error("Error message:", e.message);
        console.error("Error stack:", e.stack);
        setError(`Eroare la încărcarea campaniilor: ${e.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  const handleOpenModal = async (campaign) => {
    try {
      console.log("🔍 Opening modal for campaign:", campaign.title);
      setSelected(campaign);
      setOpen(true);
      
      console.log("📋 Fetching donations for campaign...");
      const events = await campaign.contract.queryFilter(
        campaign.contract.filters.DonationReceived(),
        0,
        "latest"
      );
      
      console.log("📨 Donation events found:", events.length);
      
      const donationsArray = events.map(ev => ({
        donor: ev.args.donor,
        amount: parseFloat(formatEther(ev.args.amount)),
      }));
      
      console.log("💰 Processed donations:", donationsArray);
      setDonations(donationsArray);
      
    } catch (err) {
      console.error("❌ Error fetching donations:", err);
      setDonations([]);
    }
  };

  // Debug render
  console.log("🎨 Rendering AllCampaigns component");
  console.log("📊 Current state - campaigns:", campaigns.length);
  console.log("⏳ Loading state:", loading);
  console.log("❌ Error state:", error);

  return (
    <Box sx={{
      minHeight: "100vh", py: 6, px: { xs: 2, md: 4 },
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }}>
      <Typography variant="h3" fontWeight="bold" color="white" textAlign="center" mb={4}>
        🌟 Campaniile active pe blockchain
      </Typography>

      {/* Loading state */}
      {loading && (
        <Box textAlign="center" mb={4}>
          <Typography color="white" variant="h6">
            🔄 Se încarcă campaniile...
          </Typography>
          <LinearProgress sx={{ mt: 2, bgcolor: "rgba(255,255,255,0.2)" }} />
        </Box>
      )}

      {/* Error state */}
      {error && (
        <Box textAlign="center" mb={4}>
          <Typography color="error" variant="h6" sx={{ bgcolor: "rgba(255,255,255,0.9)", p: 2, borderRadius: 2 }}>
            ❌ {error}
          </Typography>
        </Box>
      )}

      {/* Debug info */}
      {!loading && (
        <Box textAlign="center" mb={4}>
          <Typography color="white" variant="body2">
            🔍 Debug: {campaigns.length} campanii găsite
          </Typography>
        </Box>
      )}

      {/* No campaigns found */}
      {!loading && campaigns.length === 0 && !error && (
        <Box textAlign="center" mb={4}>
          <Typography color="white" variant="h6">
            📭 Nu există campanii disponibile momentan.
          </Typography>
          <Typography color="white" variant="body2" sx={{ mt: 1 }}>
            Verificați consola pentru detalii despre debugging.
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
              <Typography variant="caption" display="block" sx={{ mt: 1, fontSize: "0.7rem" }}>
                📍 Adresa: {c.address.slice(0, 6)}...{c.address.slice(-4)}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  bgcolor: "#FFD700",
                  color: "#222",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#ffe066", color: "#111" },
                }}
                onClick={() => handleOpenModal(c)}
              >
                Detalii campanie & Donatori
              </Button>
            </CardContent>
          </Card>
        </Box>
      ))}

      {/* Modal Donatori */}
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
            width: { xs: "80%", sm: 400 },
            maxHeight: "70vh",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Donatori pentru {selected?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              📍 Adresa contractului: {selected?.address}
            </Typography>
            <Box sx={{ maxHeight: "40vh", overflowY: "auto", pr: 1 }}>
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
                        primary={`${donor.donor.slice(0, 6)}...${donor.donor.slice(-4)}`}
                        secondary={`A donat ${donor.amount} ETH`}
                      />
                    </ListItem>
                    {i < donations.length - 1 && <Divider />}
                  </React.Fragment>
                )) : (
                  <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                    💭 Nu există donații înregistrate încă.
                  </Typography>
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