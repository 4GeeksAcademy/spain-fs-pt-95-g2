import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useInventories } from "../hooks/useInventories";

const ModalAddCategory = ({ show, onClose, onSave }) => {
  const { inventories , fetchInventories } = useInventories();
  const [inventoryId, setInventoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchInventories();
  },[])
  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ name, description, inventories_id: inventoryId });
    setName("");
    setDescription("");
    setInventoryId("");
    onClose();
  };

  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Category</DialogTitle>

      <DialogContent dividers>
        <TextField
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />
        <FormControl fullWidth required>
          <InputLabel id="inventory-select-label">Inventory</InputLabel>
          <Select
            labelId="inventory-select-label"
            value={inventoryId}
            label="Inventory"
            onChange={(e) => setInventoryId(e.target.value)}
          >
            {inventories.map((inv) => (
              <MenuItem key={inv.id_inventory} value={inv.id_inventory}>
                {inv.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAddCategory;

