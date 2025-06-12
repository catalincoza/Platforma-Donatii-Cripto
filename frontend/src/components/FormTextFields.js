import React from "react";
import { TextField } from "@mui/material";

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
    </>
  );
};

export default FormTextFields;
