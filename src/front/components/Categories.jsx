import { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Box
} from "@mui/material";
import { useCategories } from "../hooks/useCategories";
import ModalAddCategory from "./ModalAddCategory";

const Categories = () => {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    setCategories,
    deleteCategory,
  } = useCategories();

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleDeleteCategory = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this category?");
    if (!confirm) return;

    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleModalSave = async (newCatData) => {
    try {
      const newCat = await createCategory(newCatData);
      setCategories([...categories, newCat]);
      setShowCategoryModal(false);
    } catch (error) {
      alert("Could not create category.");
    }
  };

  if (loading) return <Typography>Loading categories...</Typography>;
  if (error) return <Typography color="error">An error occurred: {error}</Typography>;

  return (
    <Box sx={{ p: 4 }}>
  
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#333" }}>
              <TableCell sx={{ color: "white" }}>#</TableCell>
              <TableCell sx={{ color: "white" }}>Name</TableCell>
              <TableCell sx={{ color: "white" }}>Description</TableCell>
              <TableCell sx={{ color: "white" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((cat, idx) => (
                <TableRow key={cat.id_category}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteCategory(cat.id_category)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="textSecondary">No categories available</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center">
        <Button variant="contained" onClick={() => setShowCategoryModal(true)}>
          Create Category
        </Button>
      </Box>

      <ModalAddCategory
        show={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleModalSave}
      />
    </Box>
  );
};

export default Categories;
