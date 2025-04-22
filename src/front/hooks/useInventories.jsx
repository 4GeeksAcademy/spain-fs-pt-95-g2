// src/hooks/useInventories.js
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const useInventories = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token") || sessionStorage.getItem('token');

  const fetchInventories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}api/inventories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error fetching inventories");
      const data = await res.json();
      setInventories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createInventory = async (newInventory) => {
    try {
      const res = await fetch(`${API_URL}api/inventories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newInventory),
      });
      if (!res.ok) throw new Error("Error creating inventory");
      const data = await res.json();
      setInventories((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateInventory = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_URL}api/inventories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Error updating inventory");
      const data = await res.json();
      setInventories((prev) =>
        prev.map((inv) => (inv.id_inventory === id ? data : inv))
      );
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteInventory = async (id) => {
    try {
      const res = await fetch(`${API_URL}api/inventories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error deleting inventory");
      setInventories((prev) => prev.filter((inv) => inv.id_inventory !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  return {
    inventories,
    loading,
    error,
    fetchInventories,
    createInventory,
    updateInventory,
    deleteInventory,
    setInventories,
  };
};
