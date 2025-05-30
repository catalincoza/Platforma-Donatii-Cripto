import ActionButtons from "../components/ActionButtons";

const Header = ({setOpenModal}) => {
    return (
        <div style={{ animation: "slideDown 1s ease-out" }}>
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
            Susține o cauză, fă o diferență. Creează sau susține o campanie
            chiar acum.
          </p>
          <ActionButtons
            setOpenModal={setOpenModal}
          />
        </div>
    )
}

export default Header