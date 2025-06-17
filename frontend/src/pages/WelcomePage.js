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
import educationImg from "../assets/Autism.jpg";
import medicalImg from "../assets/Medical.jpg";
import animalsImg from "../assets/Animal.jpg";
import businessImg from "../assets/Business.png";
import emergencyImg from "../assets/Natural.jpg";

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
    category: ""
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
      const { title, description, goal, category } = form;

      if (!title || !description || !goal || !category) {
        setErrorMessage("Toate câmpurile sunt obligatorii.");
        return;
      }

      if (isNaN(goal) || parseFloat(goal) <= 0) {
        setErrorMessage("Ținta trebuie să fie un număr pozitiv.");
        return;
      }

      if (!window.ethereum) throw new Error("MetaMask nu este instalat.");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

      const goalInWei = ethers.parseEther(goal.toString());

      const tx = await contract.proposeCampaign(title, description, category, goalInWei);
      await tx.wait();

      setOpenModal(false);
      setOpenSnackbar(true);
      setForm({ title: "", description: "", goal: "", category: "" });
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
        

        {/* Butoane categorii - FIXED ROUTES */}
        <Typography variant="h5" textAlign="center" mb={4} mt={2} fontWeight="bold">
          Alege o categorie de campanie:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
          {[
            { label: "Educație", image: educationImg, category: "educatie" },
            { label: "Medical", image: medicalImg, category: "medical" },
            { label: "Animale", image: animalsImg, category: "animale" },
            { label: "Business", image: businessImg, category: "business" },
            { label: "Urgențe", image: emergencyImg, category: "emergenta" },
          ].map(({ label, image, category }) => (
            <Box
              key={label}
              sx={{
                width: 200,
                height: 160,
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                boxShadow: 4,
                "&:hover": { boxShadow: 8 },
              }}
              onClick={() => navigate(`/${category}`)}
            >
              <img src={image} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <Box sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                background: "rgba(0,0,0,0.6)",
                color: "white",
                textAlign: "center",
                py: 1,
                fontWeight: "bold"
              }}>
                {label}
              </Box>
            </Box>
          ))}
        </Box>

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