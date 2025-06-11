import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, Snackbar, Alert, Modal, TextField } from '@mui/material';

const newCampaigns = [
  { id: 1, title: 'Campanie Educațională', creator: 'John Doe', goal: 100, description: 'Ajută la educația copiilor din zonele rurale' },
  { id: 2, title: 'Asistență Medicală', creator: 'Jane Smith', goal: 500, description: 'Furnizează materiale medicale spitalelor' },
  { id: 3, title: 'Protecția Animalelor', creator: 'Tom Green', goal: 150, description: 'Ajută la salvarea animalelor vagaboande' },
];

const donations = [
  { id: 1, campaignTitle: 'Campanie Educațională', donor: 'Mark Knight', amount: 50 },
  { id: 2, campaignTitle: 'Asistență Medicală', donor: 'Linda Blue', amount: 200 },
  { id: 3, campaignTitle: 'Protecția Animalelor', donor: 'Sarah Brown', amount: 100 },
  { id: 4, campaignTitle: 'Campanie Educațională', donor: 'Emily White', amount: 30 },
  { id: 5, campaignTitle: 'Asistență Medicală', donor: 'James Black', amount: 150 },
];

const Dashboard = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openModal, setOpenModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleAcceptCampaign = (id) => {
    setSelectedCampaign(id);
    setSnackbarMessage(`Campania ID ${id} a fost acceptată.`);
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  const handleRejectCampaign = (id) => {
    setSelectedCampaign(id);
    setOpenModal(true); 
  };

  const handleRejectSubmit = () => {
    setSnackbarMessage(`Campania ID ${selectedCampaign} a fost refuzată.`);
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
    setOpenModal(false);  
    setRejectionReason(''); 
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        Panou Admin
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
        Campanii Noi
      </Typography>
      <TableContainer component={Paper} sx={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="new campaigns table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Titlu</TableCell>
              <TableCell sx={{ color: 'white' }}>Creator</TableCell>
              <TableCell sx={{ color: 'white' }}>Scop (ETH)</TableCell>
              <TableCell sx={{ color: 'white' }}>Descriere</TableCell>
              <TableCell sx={{ color: 'white' }}>Acțiune</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newCampaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell sx={{ color: 'white' }}>{campaign.title}</TableCell>
                <TableCell sx={{ color: 'white' }}>{campaign.creator}</TableCell>
                <TableCell sx={{ color: 'white' }}>{campaign.goal}</TableCell>
                <TableCell sx={{ color: 'white' }}>{campaign.description}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAcceptCampaign(campaign.id)}
                    sx={{ marginRight: 1 }}
                  >
                    Acceptă
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRejectCampaign(campaign.id)}
                  >
                    Refuză
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom sx={{ marginTop: 4, color: 'white' }}>
        Donații
      </Typography>
      <TableContainer component={Paper} sx={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="donations table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Titlu Campanie</TableCell>
              <TableCell sx={{ color: 'white' }}>Donator</TableCell>
              <TableCell sx={{ color: 'white' }}>Sumă (ETH)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell sx={{ color: 'white' }}>{donation.campaignTitle}</TableCell>
                <TableCell sx={{ color: 'white' }}>{donation.donor}</TableCell>
                <TableCell sx={{ color: 'white' }}>{donation.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Modal open={openModal} onClose={() => setOpenModal(false)} closeAfterTransition>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            padding: 4,
            boxShadow: 24,
            borderRadius: 2,
            maxWidth: 400,
            width: '100%',
          }}
        >
          <Typography variant="h6" sx={{ color: 'black', marginBottom: 2 }}>
            Motivul Refuzului
          </Typography>
          <TextField
            fullWidth
            label="Motiv refuz"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button variant="contained" color="error" fullWidth onClick={handleRejectSubmit}>
            Refuză
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Dashboard;
