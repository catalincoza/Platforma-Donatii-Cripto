import React, { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, TablePagination, Chip
} from "@mui/material";
import { styled } from "@mui/system";
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
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(factoryAddressString, FactoryABI.abi, signer);
      const rawProposals = await contract.getProposals();

      const parsedProposals = rawProposals.map((p, idx) => ({
        id: idx,
        title: p.title,
        description: p.description,
        creator: p.proposer,
        goal: formatEther(p.goal.toString()),
        category: p.category,
        status: p.approved ? "Acceptat" : (p.rejected ? "Refuzat" : "În așteptare")
      }));

      setProposals(parsedProposals);
    } catch (err) {
      console.error("❌ Eroare la încărcarea propunerilor:", err.message);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
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
      <Typography variant="h4" align="center" color="white" fontWeight="bold" mb={4}>
        📑 Propuneri de Campanii
      </Typography>

      <SearchField
        label="Căutare"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <TableContainer component={Paper} sx={{ mt: 2, background: "rgba(255,255,255,0.05)" }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledCellTitlu>Titlu</StyledCellTitlu>
              <StyledCell>Categorie</StyledCell>
              <StyledCell>Creator</StyledCell>
              <StyledCell>Țintă (ETH)</StyledCell>
              <StyledCell sx={{ minWidth: 160 }}>Descriere</StyledCell>
              <StyledCell>Status</StyledCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((p) => (
              <TableRow key={p.id} hover>
                <StyledCell>{p.title}</StyledCell>
                <StyledCell>{p.category}</StyledCell>
                <StyledCell>{p.creator}</StyledCell>
                <StyledCell>{p.goal}</StyledCell>
                <StyledCell>{p.description}</StyledCell>
                <StyledCell>
                  <Chip
                    label={p.status}
                    color={
                      p.status === "Acceptat"
                        ? "success"
                        : p.status === "Refuzat"
                        ? "error"
                        : "warning"
                    }
                    size="small"
                  />
                </StyledCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ color: "white" }}
      />
    </StyledBox>
  );
};

export default CampaignProposals;


// --- Styling
const StyledBox = styled(Box)({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "48px 24px",
});

const SearchField = styled(TextField)({
  width: "100%",
  maxWidth: 200,
  margin: "0 auto",
  display: "block",
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": { borderColor: "white" },
    "&:hover fieldset": { borderColor: "#FFD700" },
    "&.Mui-focused fieldset": { borderColor: "#FFD700" },
  },
  "& .MuiInputLabel-root": { color: "white" },
  "& .MuiInputBase-input": { color: "white" },
});

const StyledCell = styled(TableCell)({
  color: "white",
  borderBottom: "1px solid rgba(255,255,255,0.2)"
});

const StyledCellTitlu = styled(StyledCell)({
  fontWeight: "bold"
});

