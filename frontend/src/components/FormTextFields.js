import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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
        label="Descriere"
        variant="outlined"
        fullWidth
        name="description"
        value={form.description}
        onChange={handleChange}
        multiline
        rows={4}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Țintă (ETH)"
        variant="outlined"
        fullWidth
        name="goal"
        type="number"
        value={form.goal}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="category-label">Categorie</InputLabel>
        <Select
          labelId="category-label"
          id="category-select"
          name="category"
          value={form.category}
          onChange={handleChange}
          label="Categorie"
        >
          <MenuItem value="educatie">🎓 Educație</MenuItem>
          <MenuItem value="medical">🏥 Medical</MenuItem>
          <MenuItem value="animale">🐾 Ajutor animale</MenuItem>
          <MenuItem value="business">💼 Afacere</MenuItem>
          <MenuItem value="emergenta">🚨 Urgență naturală</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default FormTextFields;
