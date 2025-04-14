import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const Suppliers = () => {
    const [dataSuppliers, setDataSuppliers] = useState([]);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const getSuppliers = async () =>{
        try{
            const response = await fetch(`${BACKEND_URL}api/suppliers`);
            if (!response.ok) {
                throw new Error(`Something went wrong, error: ${response.status}`);
            }
            const data = await response.json();
            setDataSuppliers(data);
        } catch(error){
            console.error('Error getting suppliers data:', error);
            
        }
    }
    useEffect(()=> {
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
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));

    return (
        <>
        <TableContainer component={Paper}>
            <Table sx={{minWidth:500}} aria-label='supplier table'>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Contact Name</StyledTableCell>
                        <StyledTableCell>Email</StyledTableCell>
                        <StyledTableCell>Phone</StyledTableCell>
                        <StyledTableCell>Address</StyledTableCell>
                        <StyledTableCell>Created at</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataSuppliers.map((supplier) =>(
                        <StyledTableRow key={supplier.id_supplier}>
                            <StyledTableCell>{supplier.name}</StyledTableCell>
                            <StyledTableCell>{supplier.contact_name}</StyledTableCell>
                            <StyledTableCell>{supplier.email}</StyledTableCell>
                            <StyledTableCell>{supplier.phone}</StyledTableCell>
                            <StyledTableCell>{supplier.address}</StyledTableCell>
                            <StyledTableCell>{new Date(supplier.created_at).toLocaleDateString()}</StyledTableCell>
                        </StyledTableRow>   
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </>
    )
}

export default Suppliers;