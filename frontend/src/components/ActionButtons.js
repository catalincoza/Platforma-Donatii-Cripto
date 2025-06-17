import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ActionButtons = ({ setOpenModal }) => {
  const [viewButtonHovered, setViewButtonHovered] = useState(false);
  const [createButtonHovered, setCreateButtonHovered] = useState(false);
  const [proposalButtonHovered, setProposalButtonHovered] = useState(false);
  const [ripples, setRipples] = useState([]);

  const navigate = useNavigate();

  const createRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 1000);
  };

  const ButtonComponent = ({ 
    onClick, 
    isHovered, 
    setHovered, 
    children, 
    rippleKey 
  }) => (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={createRipple}
      style={{
        marginTop: "16px",
        padding: "16px 40px",
        fontSize: "1.2rem",
        background: isHovered
          ? "linear-gradient(45deg, #FF5252 30%, #26C6DA 90%)"
          : "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
        border: "none",
        borderRadius: "30px",
        boxShadow: isHovered
          ? "0 15px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(255, 107, 107, 0.5)"
          : "0 8px 25px rgba(0, 0, 0, 0.2)",
        color: "white",
        cursor: "pointer",
        transform: isHovered
          ? "scale(1.08) translateY(-2px)"
          : "scale(1)",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        position: "relative",
        overflow: "hidden",
        fontWeight: "600",
        letterSpacing: "0.5px",
      }}
    >
      {children}
      {/* Render ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: "absolute",
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.6)",
            transform: "scale(0)",
            animation: "ripple 1s linear",
            pointerEvents: "none",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
      <ButtonComponent
        onClick={() => navigate("/all-campaigns")}
        isHovered={viewButtonHovered}
        setHovered={setViewButtonHovered}
        rippleKey="view"
      >
        Total Campanii
      </ButtonComponent>

      <ButtonComponent
        onClick={() => setOpenModal(true)}
        isHovered={createButtonHovered}
        setHovered={setCreateButtonHovered}
        rippleKey="create"
      >
        Crează Campanie
      </ButtonComponent>

      <ButtonComponent
        onClick={() => navigate("/campaign-proposals")}
        isHovered={proposalButtonHovered}
        setHovered={setProposalButtonHovered}
        rippleKey="proposal"
      >
        Vezi Propunerile de Campanii
      </ButtonComponent>
    </div>
  );
};

export default ActionButtons;