import React, { useState } from "react";
import Button from '@mui/material/Button';
import { Box, TextField } from "@mui/material";

const FormNewSupplier = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token") || sessionStorage.getItem('token');

  const [formData, setFormData] = useState({
    name: "",
    contact_name: "",
    email: "",
    phone: "",
    address: "",
  });

  const addNewSupplier = async (NewSupplierData) => {
    try {
      const response = await fetch(`${BACKEND_URL}api/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(NewSupplierData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong adding the supplier");
      }

      return { success: true };
    } catch (error) {
      console.error("Error on addNewSupplier:", error.message);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Enviando datos:", formData); 
      await addNewSupplier(formData);
      setFormData({
        name: "",
        contact_name: "",
        email: "",
        phone: "",
        address: "",
      });
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      
      <TextField
        fullWidth
        margin="normal"
        label="Supplier Name"
        name="name"
        value={formData.name || ""}
        onChange={handleInputChange}
        placeholder="e.g. Example SL."
      />

      <TextField
        fullWidth
        margin="normal"
        label="Contact Name"
        name="contact_name"
        value={formData.contact_name || ""}
        onChange={handleInputChange}
        placeholder="e.g. Juan Cuesta"
      />

      <TextField
        fullWidth
        margin="normal"
        type="email"
        label="Email"
        name="email"
        value={formData.email || ""}
        onChange={handleInputChange}
        placeholder="e.g. example@example.com"
      />

      <TextField
        fullWidth
        margin="normal"
        type="tel"
        label="Phone"
        name="phone"
        value={formData.phone || ""}
        onChange={handleInputChange}
        placeholder="e.g. 111333555"
      />

      <TextField
        fullWidth
        margin="normal"
        label="Address"
        name="address"
        value={formData.address || ""}
        onChange={handleInputChange}
        placeholder="e.g. 123 Saint Row, Springfield"
      />

      <Box mt={3}>
        <Button variant="contained" type="submit">
          Add new supplier
        </Button>
      </Box>
    </Box>
  );
}

export default FormNewSupplier;
