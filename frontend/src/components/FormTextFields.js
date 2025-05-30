import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const FormTextFields = ({ form, handleChange }) => {
  return (
    <>
      <TextField
        label="Titlul Campaniei"
        variant="outlined"
        fullWidth
        name="title"
        value={form.title}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Creatorul Campaniei"
        variant="outlined"
        fullWidth
        name="creator"
        value={form.creator}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Gol (ETH)"
        variant="outlined"
        fullWidth
        name="goal"
        type="number"
        value={form.goal}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Descriere"
        variant="outlined"
        fullWidth
        name="description"
        value={form.description}
        onChange={handleChange}
        sx={{
          mb: 2,
          maxHeight: "50rem",
          "& textarea": {
            resize: "both",
            overflow: "auto",
            maxHeight: "50rem",
          },
        }}
        multiline
        rows={4}
      />
      <TextField
        label="Motiv"
        variant="outlined"
        fullWidth
        name="reason"
        value={form.reason}
        onChange={handleChange}
        sx={{ mb: 2 }}
        multiline
        rows={3}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Tip Campanie</InputLabel>
        <Select
          value={form.type}
          onChange={handleChange}
          label="Tip Campanie"
          name="type"
        >
          <MenuItem value="educatie">Educație</MenuItem>
          <MenuItem value="medical">Medical</MenuItem>
          <MenuItem value="animale">Animale</MenuItem>
          <MenuItem value="business">Business</MenuItem>
          <MenuItem value="emergenta">Emergență</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default FormTextFields;
