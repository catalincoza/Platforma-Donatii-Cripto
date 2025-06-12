import React, { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, TablePagination, styled
} from "@mui/material";
import { BrowserProvider, Contract, formatEther } from "ethers";
import FactoryABI from "../contracts/DonationCampaignFactory.json";
import factoryAddress from "../contracts/factory-address.json";

const factoryAddressString = factoryAddress.DonationCampaignFactory;

const CampaignProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    async function fetchProposals() {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(factoryAddressString, FactoryABI.abi, signer);

        const proposalCount = await contract.proposals.length;
        const rawProposals = await contract.getProposals();

        const parsedProposals = rawProposals.map((p, idx) => ({
          id: idx,
          title: p.title,
          description: p.description,
          creator: p.proposer,
          goal: formatEther(p.goal),
          status: p.approved ? "Acceptat" : (p.rejected ? "Refuzat" : "Pending"),
        }));

        setProposals(parsedProposals);
      } catch (err) {
        console.error("Eroare la încărcarea propunerilor:", err.message);
      }
    }

    fetchProposals();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filtered = proposals.filter((p) =>
    Object.values(p).some(val =>
      val.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <StyledBox>
      <Typography variant="h4" color="white" gutterBottom align="center">
        Propoziții Campanii (din Blockchain)
      </Typography>

      <StyledTextField
        label="Căutare campanii"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <TableContainer component={Paper} sx={{ backgroundColor: "transparent", border: '1px solid white' }}>
        <Table sx={{ minWidth: 650 }} aria-label="campaign proposals table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Titlu</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Creator</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Țintă (ETH)</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Descriere</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((p) => (
              <TableRow key={p.id}>
                <TableCell sx={{ color: "white" }}>{p.title}</TableCell>
                <TableCell sx={{ color: "white" }}>{p.creator}</TableCell>
                <TableCell sx={{ color: "white" }}>{p.goal}</TableCell>
                <TableCell sx={{ color: "white" }}>{p.description}</TableCell>
                <TableCell sx={{
                  color: p.status === "Acceptat" ? "#5bde75" : (p.status === "Refuzat" ? "#fa202b" : "#FFD700"),
                  fontWeight: "bold"
                }}>
                  {p.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ color: "white", marginTop: 2 }}
      />
    </StyledBox>
  );
};

export default CampaignProposals;

// --- Styling
const StyledBox = styled(Box)(() => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  padding: 4,
}));

const StyledTextField = styled(TextField)({
  marginBottom: '1rem',
  width: "100%",
  maxWidth: "400px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "white" },
    "&:hover fieldset": { borderColor: "white" },
    "&.Mui-focused fieldset": { borderColor: "white" },
  },
  "& .MuiInputLabel-root": { color: "white" },
  "& .MuiInputBase-input": { color: "white" },
});
