import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FormNewSupplier from "./FormNewSupplier";
import Grid from '@mui/material/Grid';

const Suppliers = () => {
    const [dataSuppliers, setDataSuppliers] = useState([]);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [open, setOpen] = React.useState(false);
    const token = localStorage.getItem("token") || sessionStorage.getItem('token');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const getSuppliers = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}api/suppliers`);
            if (!response.ok) {
                throw new Error(`Something went wrong, error: ${response.status}`);
            }
            const data = await response.json();
            setDataSuppliers(data);
        } catch (error) {
            console.error('Error getting suppliers data:', error);

        }
    }

    const handleDelete = async (id_supplier) => {
        try {
            const response = await fetch(`${BACKEND_URL}api/suppliers/${id_supplier}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Error al eliminar el producto");

            setDataSuppliers((prev) => prev.filter((s) => s.id_supplier !== id_supplier));
        } catch (error) {

            throw error;
        }
    }

    useEffect(() => {
        getSuppliers();
    }, []);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },

        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        height: 500,
        bgcolor: 'background.paper',
        border: '1px solid grey.500',
        borderRadius: '25px',
        boxShadow: 24,
        p: 4,
    };




    return (
        <>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label='supplier table'>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Contact Name</StyledTableCell>
                            <StyledTableCell>Email</StyledTableCell>
                            <StyledTableCell>Phone</StyledTableCell>
                            <StyledTableCell>Address</StyledTableCell>
                            <StyledTableCell>Created at</StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataSuppliers.map((supplier) => (
                            <StyledTableRow key={supplier.id_supplier}>
                                <StyledTableCell>{supplier.name}</StyledTableCell>
                                <StyledTableCell>{supplier.contact_name}</StyledTableCell>
                                <StyledTableCell>{supplier.email}</StyledTableCell>
                                <StyledTableCell>{supplier.phone}</StyledTableCell>
                                <StyledTableCell>{supplier.address}</StyledTableCell>
                                <StyledTableCell>{new Date(supplier.created_at).toLocaleDateString()}</StyledTableCell>
                                <StyledTableCell><Button variant="outlined" color="error" onClick={() => handleDelete(supplier.id_supplier)}>DELETE</Button></StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Grid container justifyContent="center" alignItems="center" sx={{ paddingTop: 3 }}>
                <Button variant="contained" onClick={handleOpen}> ADD NEW SUPPLIER </Button>
                <Modal open={open} onClose={handleClose}
                    aria-labelledby="modal-modal-tittle"
                    aria-describedby="modal-modal-forAddSuppliers">
                    <Box sx={style}>
                        <Typography id="modal-modal-tittle" variant="h4" component="h2">
                            Complete the form for add a new supplier!
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <FormNewSupplier></FormNewSupplier>
                        </Typography>
                    </Box>
                </Modal>
            </Grid>
        </>
    )
}

export default Suppliers;