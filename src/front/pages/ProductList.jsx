import { useEffect, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductEditForm from "../components/ProductEditForm";
import ProductForm from "../components/ProductForm";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from "@mui/material";

const ProductList = () => {
  const { products, fetchProductsWithStock, deleteProduct, loading } = useProducts();
  const [productEdit, setProductEdit] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchProductsWithStock();
  }, []);

  // const handleFormDelete = async (id) => {
  //   const confirm = window.confirm("Are you sure you want to delete this product?");
  //   if (!confirm) return;

  //   try {
  //     await deleteProduct(id);
  //     fetchProductsWithStock();

  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      {productEdit ? (
        <ProductEditForm
          product={productEdit}
          onUpdate={() => {
            fetchProductsWithStock();
            setProductEdit(null);
          }}
          onCancel={() => {
            fetchProductsWithStock();
            setProductEdit(null);
          }}
        />
      ) : showCreateForm ? (
        <ProductForm
          onSuccess={() => {
            fetchProductsWithStock();
            setShowCreateForm(false);
          }}
          onCancel={() => {
            setShowCreateForm(false);
          }}
        />
      ) : (
        <>
          { loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#333" }}>
                    <TableCell sx={{ color: "#fff" }}>ID</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Price</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Stock</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id_product}>
                      <TableCell>{product.id_product}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => setProductEdit(product)}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        {/* <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleFormDelete(product.id_product)}
                        >
                          Delete
                        </Button> */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box display="flex" justifyContent="center" mt={3}>
            <Button variant="contained" color="primary" onClick={() => setShowCreateForm(true)}>
              Add Product
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProductList;
