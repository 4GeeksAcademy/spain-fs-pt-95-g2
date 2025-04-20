import { useEffect, useState } from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    Paper,
    CircularProgress,
    Box,
    Button,
} from "@mui/material";
import { useTransactions } from "../hooks/useTransactions";
import TransactionForm from "../components/TransactionForm";

const TransactionList = () => {
    const { transactions, fetchTransactions, loading, error } = useTransactions();
    const [showTransactionForm, setShowTransactionForm] = useState(false)

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <Box sx={{ p: 4 }}>

            {showTransactionForm ? (
                <TransactionForm
                    onCancel={() => setShowTransactionForm(false)}
                    onSuccess={() => {
                        fetchTransactions();
                        setShowTransactionForm(false);
                    }}
                />
            ) : loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : transactions.length === 0 ? (
                <Typography>No transactions found.</Typography>
            ) : (
                <>
                    <Paper elevation={3}>
                        <Table>
                            <TableHead sx={{ backgroundColor: "#333" }}>
                                <TableRow>
                                    <TableCell sx={{ color: "#fff" }}>#</TableCell>
                                    <TableCell sx={{ color: "#fff" }}>Product</TableCell>
                                    <TableCell sx={{ color: "#fff" }}>Inventory</TableCell>
                                    <TableCell sx={{ color: "#fff" }}>Type</TableCell>
                                    <TableCell sx={{ color: "#fff" }}>Quantity</TableCell>
                                    <TableCell sx={{ color: "#fff" }}>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((tx) => (
                                    <TableRow key={tx.id_transaction}>
                                        <TableCell>{tx.id_transaction}</TableCell>
                                        <TableCell>{tx.product_id}</TableCell>
                                        <TableCell>{tx.inventories_id}</TableCell>
                                        <TableCell>{tx.transaction_type}</TableCell>
                                        <TableCell>{tx.quantity}</TableCell>
                                        <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                    <Box display="flex" justifyContent="center" mt={3}>
                        <Button variant="contained" color="primary" onClick={() => setShowTransactionForm(true)}>Add Transaction</Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default TransactionList;
