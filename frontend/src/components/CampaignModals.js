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
            <Box sx={{ pt: 2 }}>
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
                    helperText="Dacă nu completezi, vei apărea ca 'Anonim'"
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
              onClick={onCloseDonorsModal}
            >
              Închide
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default CampaignModals;
