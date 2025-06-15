// frontend/src/components/CampaignModals.js
import React from "react";
import {
  Modal, Fade, Box, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, TextField,
  Typography, Button, CircularProgress, InputAdornment
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EmailIcon from "@mui/icons-material/Email";

const CampaignModals = ({
  selected,
  donations,
  donationForm,
  onDonationChange,
  onSubmitDonation,
  donationDialogOpen,
  donorsModalOpen,
  onCloseDonationDialog,
  onCloseDonorsModal,
  donating,
}) => {
  return (
    <>
      {/* Donation Dialog */}
      <Dialog
        open={donationDialogOpen}
        onClose={onCloseDonationDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          💝 Donează
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Suma donației (ETH) *"
            type="number"
            value={donationForm.amount}
            onChange={(e) => onDonationChange("amount", e.target.value)}
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
            onChange={(e) => onDonationChange("name", e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment>,
            }}
          />
          <TextField
            fullWidth
            label="Email (opțional)"
            type="email"
            value={donationForm.email}
            onChange={(e) => onDonationChange("email", e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment>,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onCloseDonationDialog} variant="outlined">Anulează</Button>
          <Button
            onClick={onSubmitDonation}
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
        open={donorsModalOpen}
        onClose={onCloseDonorsModal}
        closeAfterTransition
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={donorsModalOpen}>
          <Box sx={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            maxHeight: "80vh",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4
          }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              💰 Donatori pentru {selected?.title}
            </Typography>
            <List sx={{ maxHeight: "50vh", overflowY: "auto" }}>
              {donations.length > 0 ? donations.map((d, i) => (
                <React.Fragment key={i}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#FFD700", color: "#000" }}>
                        <MonetizationOnIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${d.name} - ${d.amount} ETH`}
                      secondary={d.email || ""}
                    />
                  </ListItem>
                  {i < donations.length - 1 && <Divider />}
                </React.Fragment>
              )) : (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Nicio donație înregistrată.
                </Typography>
              )}
            </List>
            <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={onCloseDonorsModal}>
              Închide
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default CampaignModals;
