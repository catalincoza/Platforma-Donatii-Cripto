import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Button, Box, Snackbar, Alert, Modal, TextField
} from "@mui/material";
import { BrowserProvider, Contract, formatEther } from "ethers";
import FactoryABI from "../../contracts/DonationCampaignFactory.json";
import factoryAddress from "../../contracts/factory-address.json";

const Dashboard = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const contractAddress = factoryAddress.DonationCampaignFactory;

  useEffect(() => {
    async function fetchProposals() {
      setLoading(true);
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, FactoryABI.abi, signer);

        const proposalsRaw = await contract.getProposals();
        const parsed = proposalsRaw.map((p, idx) => ({
          id: idx,
          title: p.title,
          description: p.description,
          goal: formatEther(p.goal),
          creator: p.proposer,
          approved: p.approved,
          rejected: p.rejected,
        }));

        setProposals(parsed.filter(p => !p.approved && !p.rejected));
      } catch (err) {
        console.error("Eroare la citirea propunerilor:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, [contractAddress]);

  const handleAccept = async (id) => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, FactoryABI.abi, signer);

      const tx = await contract.acceptProposal(id);
      await tx.wait();

      setSnackbarMsg(`✅ Propunerea #${id} a fost acceptată`);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (err) {
      setSnackbarMsg(`❌ Eroare la acceptare: ${err.message}`);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleReject = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, FactoryABI.abi, signer);

      const tx = await contract.rejectProposal(selectedId);
      await tx.wait();

      setSnackbarMsg(`⛔ Propunerea #${selectedId} a fost refuzată`);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } catch (err) {
      setSnackbarMsg(`❌ Eroare la refuz: ${err.message}`);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setOpenModal(false);
      setRejectionReason("");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", p: 4 }}>
      <Typography variant="h4" sx={{ color: "white", fontWeight: "bold", mb: 3, textAlign: "center" }}>
        Panou Admin – Gestionare Propuneri
      </Typography>

      <Button
        variant="outlined"
        sx={{
          mb: 3,
          color: "white",
          borderColor: "white",
          "&:hover": { color: "#FFD700", borderColor: "#FFD700" },
        }}
        onClick={() => navigate("/admin-dashboard/statistics")}
      >
        📊 Accesează Statistici
      </Button>


      {loading ? (
        <Typography color="white">Se încarcă propunerile...</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ background: "rgba(255, 255, 255, 0.1)", borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Titlu</TableCell>
                <TableCell sx={{ color: "white" }}>Creator</TableCell>
                <TableCell sx={{ color: "white" }}>Țintă (ETH)</TableCell>
                <TableCell sx={{ color: "white" }}>Descriere</TableCell>
                <TableCell sx={{ color: "white" }}>Acțiuni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proposals.map((p) => (
                <TableRow key={p.id}>
                  <TableCell sx={{ color: "white" }}>{p.title}</TableCell>
                  <TableCell sx={{ color: "white" }}>{p.creator}</TableCell>
                  <TableCell sx={{ color: "white" }}>{p.goal}</TableCell>
                  <TableCell sx={{ color: "white" }}>{p.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleAccept(p.id)}
                      sx={{ mr: 1 }}
                    >
                      Acceptă
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        setSelectedId(p.id);
                        setOpenModal(true);
                      }}
                    >
                      Refuză
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMsg}
        </Alert>
      </Snackbar>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          bgcolor: "background.paper", p: 4, borderRadius: 2, maxWidth: 400
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Motivul refuzului (opțional)
          </Typography>
          <TextField
            fullWidth
            label="Motiv"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button fullWidth variant="contained" color="error" onClick={handleReject}>
            Confirmă Refuzul
          </Button>
        </Box>
      </Modal>

      <Box sx={{ mt: 6, textAlign: "center" }}>
              <Button
                variant="outlined"
                sx={{ color: "white", borderColor: "white", "&:hover": { borderColor: "#FFD700", color: "#FFD700" } }}
                onClick={() => navigate("/")}
              >
                🏠 Înapoi la Home
              </Button>
            </Box>
    </Box>
  );
};

export default Dashboard;
