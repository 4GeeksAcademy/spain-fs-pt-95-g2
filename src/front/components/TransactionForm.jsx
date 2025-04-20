// src/components/TransactionForm.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useProducts } from "../hooks/useProducts";
import { useInventories } from "../hooks/useInventories"; 
import { useTransactions } from "../hooks/useTransactions";

const TransactionForm = ({ onCancel, onSuccess }) => {
  const { products, fetchProducts } = useProducts();
  const { inventories, fetchInventories } = useInventories();
  const { createTransaction, error, setError } = useTransactions();

  const [formData, setFormData] = useState({
    product_id: "",
    inventories_id: "",
    quantity: "",
    transaction_type: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchInventories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createTransaction(formData);
      onSuccess && onSuccess();
    } catch (err) {
      setError("Error while creating the transaction");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 500,
        mx: "auto",
        p: 4,
        bgcolor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: 3,
        mt: 4,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Add Transaction
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <FormControl fullWidth margin="normal">
        <InputLabel>Product</InputLabel>
        <Select
          name="product_id"
          value={formData.product_id}
          onChange={handleChange}
          required
        >
          {products.map((product) => (
            <MenuItem key={product.id_product} value={product.id_product}>
              {product.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Inventory</InputLabel>
        <Select
          name="inventories_id"
          value={formData.inventories_id}
          onChange={handleChange}
          required
        >
          {inventories.map((inv) => (
            <MenuItem key={inv.id_inventory} value={inv.id_inventory}>
              {inv.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>
        <Select
          name="transaction_type"
          value={formData.transaction_type}
          onChange={handleChange}
          required
        >
          <MenuItem value="entrada">Entry</MenuItem>
          <MenuItem value="salida">Exit</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Quantity"
        name="quantity"
        type="number"
        fullWidth
        margin="normal"
        value={formData.quantity}
        onChange={handleChange}
        required
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="contained" color="primary" type="submit">
          Save
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default TransactionForm;
