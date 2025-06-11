import React, { useState } from "react";
import AnimalDonations from "../assets/Animal.jpg";
import AutismDonations from "../assets/Autism.jpg";
import BusinessDonations from "../assets/Business.png";
import MedicalDonations from "../assets/Medical.jpg";
import NaturalDonations from "../assets/Natural.jpg";
import {
  Modal,
  Box,
  Button,
  Typography,
  Backdrop,
  Fade,
  Snackbar,
  Alert,
  styled,
  TextField,
} from "@mui/material";
import "../styles/animation.css";
import Layout from "../components/Layout";
import FormTextFields from "../components/FormTextFields";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    title: "Educație",
    image: AutismDonations,
    color: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
  },
  {
    title: "Medical",
    image: MedicalDonations,
    color: "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    title: "Animale",
    image: AnimalDonations,
    color: "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    title: "Business",
    image: BusinessDonations,
    color: "linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)",
  },
  {
    title: "Emergență",
    image: NaturalDonations,
    color: "linear-gradient(45deg, #fa709a 0%, #fee140 100%)",
  },
];

const WelcomePage = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openAdminModal, setOpenAdminModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    creator: "",
    goal: "",
    description: "",
    reason: "",
  });
  const [adminForm, setAdminForm] = useState({
    username: "",
    password: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminForm({ ...adminForm, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Campaign Created:", form);
    setOpenModal(false);
    setOpenSnackbar(true);
  };

  const handleAdminSubmit = () => {
    if (adminForm.username === "admin" && adminForm.password === "admin123") {
      setOpenAdminModal(false);
      navigate("/admin-dashboard");
    } else {
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
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            fontWeight: "bold",
          }}
          onClick={() => setOpenAdminModal(true)}
        >
          Admin
        </Button>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "32px",
            justifyContent: "center",
            marginTop: "48px",
            maxWidth: "1000px",
            margin: "48px auto 0",
          }}
        >
          {categories.map((cat, index) => (
            <div
              key={index}
              style={{
                animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                perspective: "1000px",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                setHoveredCard(index);
                e.currentTarget.style.transform =
                  "scale(1.05) rotateY(5deg) rotateX(5deg)";
              }}
              onMouseLeave={(e) => {
                setHoveredCard(null);
                e.currentTarget.style.transform =
                  "scale(1) rotateY(0deg) rotateX(0deg)";
              }}
            >
              {hoveredCard === index && (
                <>
                  {[...Array(6)].map((_, bubbleIndex) => (
                    <div
                      key={bubbleIndex}
                      style={{
                        position: "absolute",
                        width: Math.random() * 25 + 15,
                        height: Math.random() * 25 + 15,
                        borderRadius: "50%",
                        background: `rgba(255, 255, 255, ${
                          0.2 + Math.random() * 0.3
                        })`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `bubble ${
                          1.5 + Math.random() * 2
                        }s ease-out forwards`,
                        pointerEvents: "none",
                        zIndex: 10,
                        boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
                      }}
                    />
                  ))}

                  {[...Array(10)].map((_, smallBubbleIndex) => (
                    <div
                      key={`small-${smallBubbleIndex}`}
                      style={{
                        position: "absolute",
                        width: Math.random() * 8 + 4,
                        height: Math.random() * 8 + 4,
                        borderRadius: "50%",
                        background: `rgba(255, 255, 255, ${
                          0.4 + Math.random() * 0.4
                        })`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `fastBubble ${
                          0.8 + Math.random() * 1
                        }s ease-out forwards`,
                        pointerEvents: "none",
                        zIndex: 11,
                      }}
                    />
                  ))}

                  {[...Array(8)].map((_, sparkleIndex) => (
                    <div
                      key={`sparkle-${sparkleIndex}`}
                      style={{
                        position: "absolute",
                        width: 6,
                        height: 6,
                        background: "#FFD700",
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `enhancedSparkle ${
                          0.6 + Math.random() * 1.4
                        }s ease-out forwards`,
                        pointerEvents: "none",
                        zIndex: 12,
                        clipPath:
                          "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                        boxShadow: "0 0 8px #FFD700, 0 0 12px #FFD700",
                      }}
                    />
                  ))}

                  {[...Array(3)].map((_, ringIndex) => (
                    <div
                      key={`ring-${ringIndex}`}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "50px",
                        height: "50px",
                        border: "2px solid rgba(255, 255, 255, 0.4)",
                        borderRadius: "50%",
                        transform: "translate(-50%, -50%)",
                        animation: `expandRing ${
                          1.2 + ringIndex * 0.3
                        }s ease-out forwards`,
                        pointerEvents: "none",
                        zIndex: 9,
                      }}
                    />
                  ))}
                </>
              )}

              <div
                style={{
                  borderRadius: "50%",
                  overflow: "hidden",
                  width: "200px",
                  height: "200px",
                  margin: "0 auto",
                  background: cat.color,
                  boxShadow:
                    hoveredCard === index
                      ? "0 30px 60px rgba(0,0,0,0.4), 0 0 40px rgba(255,255,255,0.3), inset 0 0 20px rgba(255,255,255,0.1)"
                      : "0 20px 40px rgba(0,0,0,0.2)",
                  border:
                    hoveredCard === index
                      ? "4px solid rgba(255, 255, 255, 0.4)"
                      : "3px solid rgba(255, 255, 255, 0.2)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition:
                    "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  cursor: "pointer",
                  background:
                    hoveredCard === index
                      ? `linear-gradient(45deg, ${
                          cat.color.split("(")[1].split(")")[0]
                        }, rgba(255,255,255,0.1))`
                      : cat.color,
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                    filter:
                      hoveredCard === index
                        ? "brightness(1.3) saturate(1.4) contrast(1.2) hue-rotate(5deg)"
                        : "brightness(0.9)",
                    transition: "filter 0.4s ease",
                    transform:
                      hoveredCard === index ? "scale(1.05)" : "scale(1)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      hoveredCard === index
                        ? "radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)"
                        : "rgba(0, 0, 0, 0.4)",
                    borderRadius: "50%",
                    transition: "background 0.4s ease",
                  }}
                />

                {hoveredCard === index && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-50%",
                      left: "-50%",
                      right: "-50%",
                      bottom: "-50%",
                      background:
                        "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent)",
                      borderRadius: "50%",
                      animation: "rotate 2s linear infinite",
                      zIndex: 1,
                    }}
                  />
                )}

                <h3
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textShadow:
                      hoveredCard === index
                        ? "3px 3px 6px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.5)"
                        : "2px 2px 4px rgba(0,0,0,0.7)",
                    textAlign: "center",
                    fontSize: hoveredCard === index ? "1.35rem" : "1.25rem",
                    margin: 0,
                    position: "absolute",
                    zIndex: 3,
                    transform:
                      hoveredCard === index
                        ? "scale(1.1) translateY(-2px)"
                        : "scale(1)",
                    transition:
                      "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    letterSpacing: hoveredCard === index ? "1px" : "0px",
                  }}
                >
                  {cat.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
        <Modal
          open={openAdminModal}
          onClose={() => setOpenAdminModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={openAdminModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "40rem",
                bgcolor: "background.paper",
                borderRadius: 3,
                boxShadow: 24,
                p: 4,
                outline: "none",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Admin Login
              </Typography>
              <TextField
                label="Nume Administrator"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 2 }}
                value={adminForm.username}
                onChange={handleAdminChange}
                name="username"
              />
              <TextField
                label="Parolă Administrator"
                variant="outlined"
                fullWidth
                type="password"
                sx={{ marginBottom: 2 }}
                value={adminForm.password}
                onChange={handleAdminChange}
                name="password"
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleAdminSubmit}
              >
                Login
              </Button>
            </Box>
          </Fade>
        </Modal>
        <div
          style={{
            marginTop: "64px",
            animation: "slideUp 1s ease-out 0.8s both",
          }}
        >
          <h2
            style={{
              color: "white",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              marginBottom: "8px",
              fontSize: "2rem",
              fontWeight: "normal",
            }}
          >
            Peste{" "}
            <span
              style={{
                color: "#FFD700",
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                animation: "glow 2s ease-in-out infinite alternate",
              }}
            >
              50.000 ETH
            </span>{" "}
            strânși pentru cauze importante
          </h2>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              fontSize: "1.1rem",
              margin: 0,
            }}
          >
            Alătură-te și tu comunității noastre de susținători.
          </p>
        </div>
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={openModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "40rem",
                bgcolor: "background.paper",
                borderRadius: 3,
                boxShadow: 24,
                p: 4,
                outline: "none",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Crează o Nouă Campanie
              </Typography>

              <form>
                <FormTextFields form={form} handleChange={handleChange} />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit}
                  sx={{ mt: 2 }}
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => setOpenModal(false)}
                  sx={{ mt: 1 }}
                >
                  Close
                </Button>
              </form>
            </Box>
          </Fade>
        </Modal>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Admin înștiințat despre o nouă campanie!
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default WelcomePage;

const Container = styled(Box)({
  textAlign: "center",
  padding: "64px 24px",
  position: "relative",
  zIndex: 2,
  maxWidth: "1200px",
  margin: "0 auto",
});
