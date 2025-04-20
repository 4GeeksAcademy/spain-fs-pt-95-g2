import { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import {
  Box,
  TextField,
  Typography,
  Button,
  Alert,
} from "@mui/material";

const ProductEditForm = ({ product, onUpdate, onCancel }) => {
  const { updateProduct } = useProducts();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
      });
    }
  }, [product]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await updateProduct(product.id_product, formData);
      onUpdate();
    } catch (error) {
      setError("Failed to update the product.");
    }
  };

  if (!product) {
    return <Typography color="text.secondary">Loading product...</Typography>;
  }

  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit}
      sx={{
        maxWidth: 500,
        margin: "auto",
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Edit Product: {product.name}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleFormChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />

      <TextField
        label="Price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleFormChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />

      <Box display="flex" justifyContent="space-between">
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
        <Button type="button" variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ProductEditForm;
