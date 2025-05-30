import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Avatar,
  Grid,
  Tooltip,
  Button,
  Modal,
  Backdrop,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import CampaignIcon from "@mui/icons-material/VolunteerActivism";
import PeopleIcon from "@mui/icons-material/People";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const campaigns = [
  {
    title: "Sprijin pentru copiii cu cancer",
    description:
      "Ajută la acoperirea tratamentelor costisitoare pentru copiii diagnosticați cu cancer.",
    type: "medical",
    goal: 100,
    progress: 60,
    creator: "0x123...abc",
    donators: 421,
    donations: [
      { name: "Donator 1", amount: "1.5" },
      { name: "Donator 2", amount: "2.0" },
    ],
  },
  {
    title: "Refacerea adăpostului pentru animale",
    description:
      "Refacem adăpostul distrus pentru a oferi un cămin sigur pentru 100+ animale.",
    type: "animal",
    goal: 50,
    progress: 35,
    creator: "0x456...def",
    donators: 2500,
    donations: [
      { name: "Donator 1", amount: "0.5" },
      { name: "Donator 2", amount: "3.0" },
    ],
  },
  {
    title: "Ajutor pentru refugiați",
    description:
      "Sprijin financiar și material pentru refugiații afectați de conflicte.",
    type: "medical",
    goal: 75,
    progress: 70,
    creator: "0x789...ghi",
    donators: 620,
    donations: [
      { name: "Donator 1", amount: "0.8" },
      { name: "Donator 2", amount: "1.2" },
    ],
  },
];

const AllCampaigns = () => {
  const [open, setOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const handleOpen = (campaign) => {
    setSelectedCampaign(campaign);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCampaign(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 6,
        px: { xs: 2, md: 4 },
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
        textAlign="center"
        color="white"
        mb={4}
        sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
      >
        🌟 Toate Campaniile
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {campaigns.map((camp, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledCard>
              <StyledCardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: "white", color: "#764ba2", mr: 2 }}>
                    <CampaignIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    {camp.title}
                  </Typography>
                </Box>

                <DescriptionTypography variant="body2" color="white">
                  {camp.description}
                </DescriptionTypography>

                <Typography variant="body2" sx={{ fontStyle: "italic", mb: 1 }}>
                  🎯 Țintă: {camp.goal} ETH
                </Typography>

                <Typography variant="body2" sx={{ fontStyle: "italic", mb: 1 }}>
                  📊 Progres: {camp.progress}%
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={camp.progress}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    mb: 2,
                    bgcolor: "rgba(255,255,255,0.2)",
                    "& .MuiLinearProgress-bar": { backgroundColor: "#FFD700" },
                  }}
                />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={2}
                >
                  <Tooltip title="Adresa Creatorului">
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      👤 {camp.creator}
                    </Typography>
                  </Tooltip>
                  <Tooltip title="Număr Donatori">
                    <Box display="flex" alignItems="center">
                      <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="caption">{camp.donators}</Typography>
                    </Box>
                  </Tooltip>
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 3,
                    color: "white",
                    borderColor: "white",
                    "&:hover": { borderColor: "#FFD700", color: "#FFD700" },
                  }}
                  onClick={() => handleOpen(camp)}
                >
                  Detalii donații
                </Button>
              </StyledCardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "80%", sm: 400 },
              maxHeight: "70vh",
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              outline: "none",
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Donatori - {selectedCampaign?.title}
            </Typography>

            <Box sx={{ maxHeight: "40vh", overflowY: "auto", pr: 1 }}>
              <List>
                {selectedCampaign?.donations?.map((donor, i) => (
                  <React.Fragment key={i}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#FFD700", color: "#000" }}>
                          <MonetizationOnIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={donor.name}
                        secondary={`A donat ${donor.amount} ETH`}
                      />
                    </ListItem>
                    {i < selectedCampaign.donations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>

            <Button
              onClick={handleClose}
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Închide
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default AllCampaigns;

const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  transition: "transform 0.4s ease, box-shadow 0.4s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
  },
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  height: "400px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  maxHeight: "350px",
  overflow: "hidden",
}));

const DescriptionTypography = styled(Typography)({
  opacity: 0.9,
  mb: 2,
  maxHeight: "60px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "normal",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  wordBreak: "break-word",
});
