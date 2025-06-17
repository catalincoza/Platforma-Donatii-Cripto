import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ActionButtons = ({ setOpenModal }) => {
  const [viewButtonHovered, setViewButtonHovered] = useState(false);
  const [createButtonHovered, setCreateButtonHovered] = useState(false);
  const [proposalButtonHovered, setProposalButtonHovered] = useState(false);
  const [historyButtonHovered, setHistoryButtonHovered] = useState(false);

  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
      <button
        onClick={() => navigate("/all-campaigns")}
        onMouseEnter={() => setViewButtonHovered(true)}
        onMouseLeave={() => setViewButtonHovered(false)}
        style={{
          marginTop: "16px",
          padding: "16px 40px",
          fontSize: "1.2rem",
          background: viewButtonHovered
            ? "linear-gradient(45deg, #FF5252 30%, #26C6DA 90%)"
            : "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
          border: "none",
          borderRadius: "30px",
          boxShadow: viewButtonHovered
            ? "0 15px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(255, 107, 107, 0.5)"
            : "0 8px 25px rgba(0, 0, 0, 0.2)",
          color: "white",
          cursor: "pointer",
          transform: viewButtonHovered ? "scale(1.08) translateY(-2px)" : "scale(1)",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          fontWeight: "600",
          letterSpacing: "0.5px",
        }}
      >
        Total Campanii
      </button>

      <button
        onClick={() => setOpenModal(true)}
        onMouseEnter={() => setCreateButtonHovered(true)}
        onMouseLeave={() => setCreateButtonHovered(false)}
        style={{
          marginTop: "16px",
          padding: "16px 40px",
          fontSize: "1.2rem",
          background: createButtonHovered
            ? "linear-gradient(45deg, #FF5252 30%, #26C6DA 90%)"
            : "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
          border: "none",
          borderRadius: "30px",
          boxShadow: createButtonHovered
            ? "0 15px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(255, 107, 107, 0.5)"
            : "0 8px 25px rgba(0, 0, 0, 0.2)",
          color: "white",
          cursor: "pointer",
          transform: createButtonHovered ? "scale(1.08) translateY(-2px)" : "scale(1)",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          fontWeight: "600",
          letterSpacing: "0.5px",
        }}
      >
        Crează Campanie
      </button>

      <button
        onClick={() => navigate("/campaign-proposals")}
        onMouseEnter={() => setProposalButtonHovered(true)}
        onMouseLeave={() => setProposalButtonHovered(false)}
        style={{
          marginTop: "16px",
          padding: "16px 40px",
          fontSize: "1.2rem",
          background: proposalButtonHovered
            ? "linear-gradient(45deg, #FF5252 30%, #26C6DA 90%)"
            : "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
          border: "none",
          borderRadius: "30px",
          boxShadow: proposalButtonHovered
            ? "0 15px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(255, 107, 107, 0.5)"
            : "0 8px 25px rgba(0, 0, 0, 0.2)",
          color: "white",
          cursor: "pointer",
          transform: proposalButtonHovered ? "scale(1.08) translateY(-2px)" : "scale(1)",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          fontWeight: "600",
          letterSpacing: "0.5px",
        }}
      >
        Vezi Propunerile de Campanii
      </button>

      <button
        onClick={() => navigate("/my-donations")}
        onMouseEnter={() => setHistoryButtonHovered(true)}
        onMouseLeave={() => setHistoryButtonHovered(false)}
        style={{
          marginTop: "16px",
          padding: "16px 40px",
          fontSize: "1.2rem",
          background: historyButtonHovered
            ? "linear-gradient(45deg, #FF5252 30%, #26C6DA 90%)"
            : "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
          border: "none",
          borderRadius: "30px",
          boxShadow: historyButtonHovered
            ? "0 15px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(255, 107, 107, 0.5)"
            : "0 8px 25px rgba(0, 0, 0, 0.2)",
          color: "white",
          cursor: "pointer",
          transform: historyButtonHovered ? "scale(1.08) translateY(-2px)" : "scale(1)",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          fontWeight: "600",
          letterSpacing: "0.5px",
        }}
      >
        Istoric Donații
      </button>
    </div>
  );
};

export default ActionButtons;
