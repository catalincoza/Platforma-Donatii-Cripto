import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TablePagination, styled } from "@mui/material";
import { useState } from "react";

const CampaignProposals = () => {
  const campaigns = [
    { id: 1, title: "Educație pentru copii", type: "Educație", creator: "John Doe", goal: "100 ETH", description: "Ajută la educația copiilor din zonele rurale", status: "Pending", rezultat: "Refuzat" },
    { id: 2, title: "Ajutor medical pentru spitale", type: "Medical", creator: "Jane Smith", goal: "500 ETH", description: "Furnizează echipamente pentru spitale", status: "Pending", rezultat: "Acceptat" },
    { id: 3, title: "Salvarea animalelor abandonate", type: "Animale", creator: "Tom Green", goal: "150 ETH", description: "Ajută animalele fără adăpost", status: "Pending", rezultat: "Refuzat" },
    { id: 4, title: "Ajutor pentru comunități", type: "Social", creator: "Alice Johnson", goal: "200 ETH", description: "Sprijină comunități sărace", status: "Pending", rezultat: "Acceptat" },
    { id: 5, title: "Refacerea infrastructurii", type: "Business", creator: "Mark Thomas", goal: "400 ETH", description: "Reconstruiește infrastructura orașului", status: "Pending", rezultat: "Refuzat" },
    { id: 6, title: "Protejarea mediului", type: "Environment", creator: "Sarah Lee", goal: "300 ETH", description: "Salvează mediul înconjurător", status: "Pending", rezultat: "Acceptat" },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const filteredCampaigns = campaigns.filter((campaign) =>
    Object.values(campaign).some(val =>
      val.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const paginatedCampaigns = filteredCampaigns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <StyledBox>
      <Typography variant="h4" color="white" gutterBottom align="center">
        Propoziții Campanii
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
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Titlu Campanie</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tipul Campaniei</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Creator</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Gol</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Descriere</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Acceptat/Refuzat</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCampaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell sx={{ color: "white" }}>{campaign.title}</TableCell>
                <TableCell sx={{ color: "white" }}>{campaign.type}</TableCell>
                <TableCell sx={{ color: "white" }}>{campaign.creator}</TableCell>
                <TableCell sx={{ color: "white" }}>{campaign.goal}</TableCell>
                <TableCell sx={{ color: "white" }}>{campaign.description}</TableCell>
                <TableCell sx={{
                  color: campaign.rezultat === "Acceptat" ? "#5bde75" : "#fa202b",
                  fontWeight: "bold"
                }}>
                  {campaign.rezultat}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCampaigns.length}
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
            "& fieldset": {
              borderColor: "white",  
            },
            "&:hover fieldset": {
              borderColor: "white",  
            },
            "&.Mui-focused fieldset": {
              borderColor: "white", 
            },
          },
          "& .MuiInputLabel-root": {
            color: "white", 
          },
          "& .MuiInputBase-input": {
            color: "white",  
          },
})