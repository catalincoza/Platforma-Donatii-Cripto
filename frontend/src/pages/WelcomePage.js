import React, { useState } from "react";
import { ethers } from "ethers";
import {
  Modal, Box, Button, Typography, Backdrop, Fade,
  Snackbar, Alert, styled, TextField
} from "@mui/material";
import Layout from "../components/Layout";
import FormTextFields from "../components/FormTextFields";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import contractABI from "../contracts/DonationCampaignFactory.json";
import contractAddressJSON from "../contracts/factory-address.json";

const contractAddress = contractAddressJSON.DonationCampaignFactory;

const WelcomePage = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openAdminModal, setOpenAdminModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    goal: "",
  });
  const [adminForm, setAdminForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminForm({ ...adminForm, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!form.title || !form.description || !form.goal) {
        setErrorMessage("Toate câmpurile sunt obligatorii.");
        return;
      }

      if (isNaN(form.goal) || parseFloat(form.goal) <= 0) {
        setErrorMessage("Ținta trebuie să fie un număr pozitiv.");
        return;
      }

      if (!window.ethereum) throw new Error("MetaMask nu este instalat.");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

      const goalInWei = ethers.parseEther(form.goal.toString());

      const tx = await contract.proposeCampaign(form.title, form.description, goalInWei);
      await tx.wait();

      setOpenModal(false);
      setOpenSnackbar(true);
      setForm({ title: "", description: "", goal: "" });
      setErrorMessage("");
    } catch (err) {
      console.error("Eroare la propunere:", err);
      setErrorMessage(err.message || "Eroare necunoscută");
    }
  };

  const handleAdminSubmit = () => {
    if (adminForm.username === "admin" && adminForm.password === "admin123") {
      setOpenAdminModal(false);
      navigate("/admin-dashboard");
    } else {
      alert("Credentiale incorecte!");
      setOpenAdminModal(false);
    }
  };

  return (
    <Layout>
      <Container>
        <Header setOpenModal={setOpenModal} />
        <Button
          variant="contained"
          color="secondary"
          sx={{ position: "absolute", top: 16, right: 16, fontWeight: "bold" }}
          onClick={() => setOpenAdminModal(true)}
        >
          Admin
        </Button>

        {/* Modal campanie */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={openModal}>
            <Box sx={modalStyle}>
              <Typography variant="h6" gutterBottom>
                Propune o campanie
              </Typography>
              <form>
                <FormTextFields form={form} handleChange={handleChange} />
                <Button variant="contained" fullWidth onClick={handleSubmit} sx={{ mt: 2 }}>
                  Trimite
                </Button>
              </form>
              {errorMessage && (
                <Typography color="error" sx={{ mt: 2 }}>{errorMessage}</Typography>
              )}
            </Box>
          </Fade>
        </Modal>

        {/* Modal admin login */}
        <Modal
          open={openAdminModal}
          onClose={() => setOpenAdminModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={openAdminModal}>
            <Box sx={modalStyle}>
              <Typography variant="h6" gutterBottom>
                Autentificare Admin
              </Typography>
              <TextField
                label="Utilizator"
                name="username"
                fullWidth
                value={adminForm.username}
                onChange={handleAdminChange}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Parolă"
                name="password"
                type="password"
                fullWidth
                value={adminForm.password}
                onChange={handleAdminChange}
              />
              <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleAdminSubmit}>
                Login
              </Button>
            </Box>
          </Fade>
        </Modal>

        {/* Confirmare */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
            Campanie propusă cu succes!
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default WelcomePage;

const Container = styled(Box)(() => ({
  padding: "64px 24px",
  position: "relative",
  zIndex: 2,
  maxWidth: "1200px",
  margin: "0 auto",
}));

const modalStyle = {
  position: "absolute",
  top: "50%", left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40rem",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  outline: "none",
};
