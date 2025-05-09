import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token") || sessionStorage.getItem('token');

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}api/products`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("No se pudieron cargar los productos.");
      const dataProduct = await response.json();
      setProducts(dataProduct);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsId = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("No se pudo cargar el producto.");
      const dataProduct = await response.json();
      return dataProduct;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (newProductData) => {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newProductData)
      });

      if (!response.ok) throw new Error("Error al crear producto");
      const newProduct = await response.json();
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateProduct = async (productId, updatedProductData) => {
    try {
      console.log("entra")
      const response = await fetch(`${API_URL}api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedProductData)
      });
      console.log(response)
      if (!response.ok) throw new Error("Error al actualizar el producto");
      const updateProduct = await response.json();
      setProducts(prev => prev.map(product => product.id_product === productId ? updateProduct : product));
      return updateProduct;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar el producto");

      setProducts((prev) => prev.filter((p) => p.id_product !== id));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };


  const fetchProductsWithStock = async () => {
    setProducts([]);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}api/products/stock`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch products with stock");

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    products,
    error,
    setError,
    loading,
    fetchProducts,
    fetchProductsId,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProductsWithStock
  };
};
