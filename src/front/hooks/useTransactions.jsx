// src/hooks/useTransactions.js
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // const token = localStorage.getItem("token");
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NTE2MDg2MywianRpIjoiZmQ3YTEzZDAtNjFlNS00ZjA1LWE0MDktZjUwMTM2NWI0MjIxIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjEiLCJuYmYiOjE3NDUxNjA4NjMsImNzcmYiOiIxZTY5NDY2My01NjE2LTQ2YTItOTQ4ZC05M2MyZWEyMjU4MmUiLCJleHAiOjE3NDUyNDcyNjN9.GhXL4jEhxgu4hJTlvZ9GJZpXtiDL0i15CHNFUiFQL0s"

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch transactions.");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (newTransaction) => {
    try {
      const res = await fetch(`${API_URL}/api/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newTransaction)
      });
      if (!res.ok) throw new Error("Failed to create transaction.");
      const data = await res.json();
      setTransactions(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    setError
  };
};
