import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import {
  Button, Box, Typography, Modal, Fade,
  Backdrop, TextField, Stack
} from "@mui/material";
import ActionButtons from "../components/ActionButtons";

const Header = ({ setOpenModal }) => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({ username: "", password: "" });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const addr = await signer.getAddress();
        setAddress(addr);
      }
    };

    const isAdminStored = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(isAdminStored);

    checkWallet();
  }, []);

  const handleAdminLogin = () => {
    const { username, password } = adminForm;
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      setIsAdmin(true);
      setAdminOpen(false);
    } else {
      alert("Credentiale greșite");
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <div style={{
      animation: "slideDown 1s ease-out",
      position: "relative",
      paddingTop: "72px",
    }}>
      {/* Adresa portofelului */}
      {address && (
        <Typography
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            background: "rgba(255,255,255,0.1)",
            px: 2,
            py: 1,
            borderRadius: 2,
            color: "#fff",
            fontSize: "0.9rem",
            fontFamily: "monospace",
            zIndex: 2
          }}
        >
          Conectat ca: {address.slice(0, 6)}...{address.slice(-4)}
        </Typography>
      )}

      <h1
        style={{
          fontSize: "3.75rem",
          fontWeight: "bold",
          color: "white",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          background: "linear-gradient(45deg, #fff 30%, #f0f0f0 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "16px",
          lineHeight: 1.2,
        }}
      >
        Ajută. Donează. Inspiră.
      </h1>

      <p
        style={{
          fontSize: "1.25rem",
          color: "rgba(255, 255, 255, 0.9)",
          textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
          marginBottom: "32px",
          lineHeight: 1.6,
        }}
      >
        Susține o cauză, fă o diferență. Creează sau susține o campanie chiar acum.
      </p>

      {/* Admin buttons */}
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        {isAdmin ? (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              sx={{
                fontWeight: "bold",
                bgcolor: "#FFD700",
                color: "#222",
                "&:hover": { bgcolor: "#ffea00" },
              }}
              onClick={() => navigate("/admin-dashboard")}
            >
              Panou Admin
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#FFD700",
                color: "#FFD700",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#ffe066", color: "#000" },
              }}
              onClick={handleAdminLogout}
            >
              Logout
            </Button>
          </Stack>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setAdminOpen(true)}
          >
            Admin
          </Button>
        )}
      </Box>

      {/* Admin login modal */}
      <Modal
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={adminOpen}>
          <Box sx={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400, bgcolor: "background.paper",
            boxShadow: 24, p: 4, borderRadius: 2
          }}>
            <Typography variant="h6" gutterBottom>
              Autentificare Admin
            </Typography>
            <TextField
              fullWidth
              label="Utilizator"
              name="username"
              sx={{ mb: 2 }}
              value={adminForm.username}
              onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
            />
            <TextField
              fullWidth
              label="Parolă"
              type="password"
              name="password"
              value={adminForm.password}
              onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleAdminLogin}
            >
              Login
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Butoane de acțiune */}
      <ActionButtons setOpenModal={setOpenModal} />
    </div>
  );
};

export default Header;
