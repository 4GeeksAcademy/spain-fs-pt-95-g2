import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from "@mui/material";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useInventories } from "../hooks/useInventories";
import ModalAddCategory from "./ModalAddCategory";


const ProductForm = ({ onSuccess, onCancel }) => {
  const { createProduct, error, setError } = useProducts();
  const { categories, setCategories, createCategory, fetchCategories } = useCategories();
  const { inventories, loading: inventoriesLoading } = useInventories();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image_url: "",
    category_id: "",
    inventories_id: "",
  });
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "category_id" && value === "new") {
      setShowCategoryModal(true);
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleModalSave = async (newCatData) => {
    try {
      const newCat = await createCategory(newCatData);
      setCategories([...categories, newCat]);
      setFormData((prev) => ({ ...prev, category_id: newCat.id_category }));
      setShowCategoryModal(false);
    } catch (error) {
      alert("Failed to create category");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const productNew = await createProduct(formData);
      onSuccess && onSuccess(productNew);
      onCancel && onCancel();
      setFormData({
        name: "",
        price: "",
        image_url: "",
        category_id: "",
        inventories_id: ""
      });
    } catch (error) {
      console.log("error", error)
      setError("Error al crear el producto");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "easyInventory");
    data.append("cloud_name", "dttjh1qaf");
    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dttjh1qaf/image/upload", {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudinary error", errorData);
        return
      }
      const result = await response.json();
      const imageURL = result.secure_url;

      setFormData((prev) => ({
        ...prev,
        image_url: imageURL,
      }));
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit}
      sx={{ maxWidth: 500, margin: "auto", p: 4, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}
    >
      <Typography variant="h5" gutterBottom>
        Create New Product
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField
        fullWidth
        name="name"
        label="Product Name"
        value={formData.name}
        onChange={handleFormChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        name="price"
        label="Price"
        type="number"
        value={formData.price}
        onChange={handleFormChange}
        margin="normal"
        required
      />

      <input
        type="file"
        name="image_url"
        className="form-control"
        accept="image/*"
        onChange={handleFileChange}
        required
      />


      <FormControl fullWidth margin="normal" required>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          name="category_id"
          value={formData.category_id}
          onChange={handleFormChange}
          label="Category"
        >
          <MenuItem value="">Select a category</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id_category} value={cat.id_category}>
              {cat.name}
            </MenuItem>
          ))}
          <MenuItem value="new">+ Add new category</MenuItem>
        </Select>
      </FormControl>

      <ModalAddCategory
        show={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleModalSave}
      />

      <FormControl fullWidth margin="normal" required>
        <InputLabel id="inventory-label">Inventory</InputLabel>
          <Select labelId="inventory-label" name="inventories_id" value={formData.inventories_id}
            onChange={handleFormChange} label="Inventory">
            <MenuItem value="">Select an inventory</MenuItem>
            {inventories.map((inv) => (
              <MenuItem key={inv.id_inventory} value={inv.id_inventory}>{inv.name}</MenuItem>
            ))}
          </Select>
      </FormControl>

      <Box mt={3} display="flex" justifyContent="space-between">
        <Button type="submit" variant="contained" color="primary">
          Save Product
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;
