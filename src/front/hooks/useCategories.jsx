import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token") || sessionStorage.getItem('token');

  const fetchCategories = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al cargar categorías");

      const dataCategories = await response.json();
      setCategories(dataCategories);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (newCategory) => {
    try {
      const response = await fetch(`${API_URL}api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) throw new Error("Error al crear categoría");

      const dataNewCategory = await response.json();
      setCategories((prev) => [...prev, dataNewCategory]);
      return dataNewCategory;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateCategory = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Error al actualizar categoría");

      const categoryUpdated = await response.json();
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? categoryUpdated : c))
      );
      return categoryUpdated;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`${API_URL}api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar categoría");

      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    setCategories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
