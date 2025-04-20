import React, { useState } from "react";
import Button from '@mui/material/Button';

const FormNewSupplier = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NTE0MTU2MywianRpIjoiZGM1YjIyYmItZTI5Zi00MWUxLWIyYmItYzE0YmIxMTE1OTJlIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjEiLCJuYmYiOjE3NDUxNDE1NjMsImNzcmYiOiIxZjMzMjMwZi02ZTlmLTQyZjQtOWRiZS0zNGYxMTJjMTUzY2MiLCJleHAiOjE3NDUyMjc5NjN9.CmaUwJ0bos5O41kZoSMNKgHHIwWamGJcwpkj6A9PVuU";

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
      console.log("Enviando datos:", formData); // para depurar
      await addNewSupplier(formData);
      alert("Supplier added!"); // luego puedes usar snackbar
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
    <div className="container">
    <form onSubmit={handleSubmit}>

      <div className="mb-2">
      <label>Supplier name:</label>
      <input
      className="form-control"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="e.g. Example SL."
      />
      </div>

      <div className="mb-2">
      <label>Contact Name:</label>
      <input
      className="form-control"
        type="text"
        name="contact_name"
        value={formData.contact_name}
        onChange={handleInputChange}
        placeholder="e.g. Juan Cuesta"
      />
      </div>

      <div className="mb-2">
      <label>Email:</label>
      <input
      className="form-control"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="e.g. example@example.com"
      />
      </div>

      <div className="mb-2">
      <label>Phone:</label>
      <input
      className="form-control"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        placeholder="e.g. 111333555"
      />
      </div>
      
      
      <div className="mb-2">
      <label>Address:</label>
      <input
      className="form-control"
        type="text"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        placeholder="e.g. 123 Saint Row, Springfield"
      />
      </div>
      <div className="mt-3">
      <Button variant="contained">Add new supplier</Button>
      </div>
    </form>
    </div>
  );
};

export default FormNewSupplier;
